'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePathname } from '@/i18n/routing';

gsap.registerPlugin(ScrollTrigger);

/**
 * Recursively splits text nodes inside a heading into per-word spans.
 * Preserves <br> and styled <span> children (like .serif-accent).
 */
function splitHeadingWords(el: HTMLElement) {
  const nodes = Array.from(el.childNodes);
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      const words = text.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      words.forEach((w) => {
        if (/^\s+$/.test(w)) {
          frag.appendChild(document.createTextNode(w));
        } else if (w) {
          const span = document.createElement('span');
          span.className = 'word';
          span.style.display = 'inline-block';
          span.textContent = w;
          frag.appendChild(span);
        }
      });
      node.parentNode?.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as HTMLElement;
      if (child.tagName !== 'BR') {
        splitHeadingWords(child);
      }
    }
  });
}

export default function GSAPProvider() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const isRTL = document.documentElement.dir === 'rtl';

      // ─── WORD-BY-WORD HEADING REVEALS (all viewports) ───
      const headings = gsap.utils.toArray<HTMLElement>(
        'main h1.reveal, main h2.reveal'
      );
      headings.forEach((heading) => {
        heading.classList.remove('reveal');
        splitHeadingWords(heading);
        const words = heading.querySelectorAll('.word');
        if (!words.length) return;

        gsap.fromTo(
          words,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.04,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: heading,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onComplete() {
              gsap.set(words, { clearProps: 'opacity,y' });
            },
          }
        );
      });

      if (window.innerWidth <= 1024) return;

      // ─── HERO PARALLAX (homepage only) ───
      const heroSection = document.querySelector<HTMLElement>(
        'section.min-h-screen'
      );
      if (heroSection) {
        const heroBg = heroSection.querySelector<HTMLElement>(
          ':scope > div:first-child'
        );
        if (heroBg) {
          gsap.to(heroBg, {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });
        }

        // ─── HERO CONTENT FADEOUT ───
        const heroContent = heroSection.querySelector<HTMLElement>(
          ':scope > div:last-child'
        );
        if (heroContent) {
          gsap.to(heroContent, {
            opacity: 0,
            y: -50,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: '20% top',
              end: '70% top',
              scrub: true,
            },
          });
        }
      }

      // ─── STAGGERED CARD ENTRANCES ───
      const allCards = gsap.utils.toArray<HTMLElement>(
        '.service-card, .project-card'
      );
      if (allCards.length) {
        // Remove .reveal so GSAP has full control (prevents CSS transition conflict)
        allCards.forEach((card) => card.classList.remove('reveal'));

        // Group cards by parent for independent stagger groups
        const parentMap = new Map<Element, HTMLElement[]>();
        allCards.forEach((card) => {
          const parent = card.parentElement;
          if (!parent) return;
          if (!parentMap.has(parent)) parentMap.set(parent, []);
          parentMap.get(parent)!.push(card);
        });

        parentMap.forEach((cards, parent) => {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: parent,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
              onComplete() {
                gsap.set(cards, { clearProps: 'opacity,y' });
              },
            }
          );
        });
      }

      // ─── PROJECT CARD CLIP-PATH REVEAL ───
      const projectCards = gsap.utils.toArray<HTMLElement>('.project-card');
      projectCards.forEach((card) => {
        gsap.fromTo(
          card,
          { clipPath: 'inset(12%)' },
          {
            clipPath: 'inset(0%)',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 40%',
              scrub: true,
            },
          }
        );
      });

      // ─── SECTION LABELS: line grows then text fades in ───
      document.querySelectorAll('.section-label').forEach((label) => {
        const line = label.querySelector<HTMLElement>('.line');
        const text = label.querySelector<HTMLElement>('span');
        if (!line || !text) return;

        // Remove .reveal from container so GSAP handles the entrance
        label.classList.remove('reveal');

        gsap.set(line, {
          scaleX: 0,
          transformOrigin: isRTL ? 'right center' : 'left center',
        });
        gsap.set(text, { opacity: 0, x: isRTL ? 10 : -10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: label,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });

        tl.to(line, { scaleX: 1, duration: 0.6, ease: 'power2.out' }).to(
          text,
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );

        tl.eventCallback('onComplete', () => {
          gsap.set(line, { clearProps: 'scaleX,transformOrigin' });
          gsap.set(text, { clearProps: 'opacity,x' });
        });
      });

      // ─── DIVIDERS: grow from center ───
      document.querySelectorAll('.divider').forEach((divider) => {
        gsap.fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.2,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: divider,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
            onComplete() {
              gsap.set(divider, { clearProps: 'scaleX' });
            },
          }
        );
      });

      ScrollTrigger.refresh();
    },
    { dependencies: [pathname] }
  );

  return null;
}
