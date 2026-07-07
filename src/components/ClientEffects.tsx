'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ClientEffects() {
  // ─── LENIS SMOOTH SCROLLING ───
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4), // easeOutExpo-ish
      autoRaf: false,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // ─── CUSTOM CURSOR ───
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (dot && ring && window.innerWidth > 1024) {
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

      const onMove = (e: MouseEvent) => {
        mouseX = e.clientX; mouseY = e.clientY;
        dot.style.left = `${mouseX - 4}px`;
        dot.style.top = `${mouseY - 4}px`;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      };
      const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseleave', onLeave);

      function animateCursor() {
        if (!ring) return;
        ringX += (mouseX - ringX) * 0.1;
        ringY += (mouseY - ringY) * 0.1;
        ring.style.left = `${ringX - 20}px`;
        ring.style.top = `${ringY - 20}px`;
        requestAnimationFrame(animateCursor);
      }
      animateCursor();

      // Hover effects
      const targets = 'a, button, .project-card, .service-card, input, textarea, select';
      document.querySelectorAll(targets).forEach(el => {
        el.addEventListener('mouseenter', () => { if (ring) ring.classList.add('hovering'); });
        el.addEventListener('mouseleave', () => { if (ring) ring.classList.remove('hovering'); });
      });

      return () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseleave', onLeave);
      };
    }
  }, []);

  useEffect(() => {
    // ─── SCROLL PROGRESS + NAV HIDE ───
    const nav = document.getElementById('mainNav');
    const progress = document.getElementById('scrollProgress');
    let lastScroll = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;

      if (progress) progress.style.transform = `scaleX(${Math.min(y / docH, 1)})`;

      if (nav) {
        nav.classList.toggle('scrolled', y > 80);
        if (y > 400) {
          nav.classList.toggle('hidden', y > lastScroll);
        } else {
          nav.classList.remove('hidden');
        }
        lastScroll = y;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // ─── SCROLL REVEAL (IntersectionObserver) ───
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    // Observe with a slight delay to let DOM settle
    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // ─── MAGNETIC BUTTONS ───
    const btns = document.querySelectorAll('.btn-primary, .btn-outline');
    const handlers: Array<{ el: Element; move: (e: Event) => void; leave: () => void }> = [];

    btns.forEach(btn => {
      const move = (e: Event) => {
        const me = e as MouseEvent;
        const rect = (btn as HTMLElement).getBoundingClientRect();
        const x = me.clientX - rect.left - rect.width / 2;
        const y = me.clientY - rect.top - rect.height / 2;
        (btn as HTMLElement).style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      };
      const leave = () => {
        (btn as HTMLElement).style.transform = '';
        (btn as HTMLElement).style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => { (btn as HTMLElement).style.transition = ''; }, 500);
      };
      btn.addEventListener('mousemove', move);
      btn.addEventListener('mouseleave', leave);
      handlers.push({ el: btn, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  useEffect(() => {
    // ─── COUNTER ANIMATION ───
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.target || '0');
            const suffix = el.dataset.suffix || '+';
            const duration = 2000;
            const start = performance.now();

            function update(now: number) {
              const progress = Math.min((now - start) / duration, 1);
              el.textContent = Math.floor(target * easeOutQuart(progress)) + suffix;
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.counter').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ─── CARD SUBTLE TILT (desktop only) ───
  useEffect(() => {
    if (window.innerWidth <= 1024) return;

    const isRTL = document.documentElement.dir === 'rtl';
    const cards = document.querySelectorAll<HTMLElement>('.service-card, .project-card');
    const handlers: Array<{ el: HTMLElement; move: (e: MouseEvent) => void; leave: () => void }> = [];

    cards.forEach((card) => {
      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateY = (isRTL ? -1 : 1) * x * 6; // ±3deg
        const rotateX = -y * 6;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transition = 'transform 0.1s ease-out';
      };
      const leave = () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      };
      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', leave);
      handlers.push({ el: card, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return null; // This component only runs side effects
}
