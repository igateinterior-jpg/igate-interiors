'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/routing';
import gsap from 'gsap';

export default function PageTransition() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    const overlay = document.querySelector<HTMLElement>('.page-transition');
    if (!overlay) return;

    const tl = gsap.timeline();

    tl.set(overlay, { transformOrigin: 'bottom', scaleY: 0 })
      .to(overlay, {
        scaleY: 1,
        duration: 0.5,
        ease: 'power3.inOut',
      })
      .add(() => {
        window.scrollTo(0, 0);
      })
      .set(overlay, { transformOrigin: 'top' })
      .to(overlay, {
        scaleY: 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
  }, [pathname]);

  return null;
}
