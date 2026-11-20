'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { SCROLLY_ATTR } from '../theme';
import { afterScroll, focusQuietly, goTo, prefersReducedMotion } from './navigation';
import { doorState, progressFor, sceneFrame, type SceneGeometry } from './scroll-scene';

interface Refs {
  readonly pin: RefObject<HTMLDivElement | null>;
  readonly sticky: RefObject<HTMLElement | null>;
  readonly scene: RefObject<HTMLDivElement | null>;
  readonly door: RefObject<HTMLButtonElement | null>;
}

/** Extra zoom past "doorway fills the screen" so no frame edge is left showing. */
const FILL_MARGIN = 1.12;

/** Position of an element inside a positioned ancestor, ignoring CSS transforms. */
const offsetWithin = (el: HTMLElement, ancestor: HTMLElement): { x: number; y: number } => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== ancestor) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
};

const behindSection = (behindId: string): HTMLElement | null =>
  document.getElementById(behindId)?.closest('section') ?? null;

/**
 * Drives the pinned landing from native scrolling: a passive scroll listener
 * reads window.scrollY and, once per animation frame, writes CSS variables
 * that only feed transform, opacity and filter. Scrolling is never intercepted.
 */
export function useScrollScene(refs: Refs, behindId: string) {
  const [enabled, setEnabled] = useState(false);
  const metrics = useRef({ top: 0, length: 0 });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      const on = !query.matches;
      if (on) document.documentElement.setAttribute(SCROLLY_ATTR, 'on');
      else document.documentElement.removeAttribute(SCROLLY_ATTR);
      setEnabled(on);
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const { pin, sticky, scene, door } = refs;
    const header = sticky.current;
    const behind = behindSection(behindId);
    if (!header) return;

    if (!enabled) {
      // Reduced motion: no pinning, the door simply shows open.
      header.style.setProperty('--open', '1');
      header.dataset.door = 'open';
      behind?.style.removeProperty('opacity');
      behind?.style.removeProperty('pointer-events');
      return;
    }

    let geometry: SceneGeometry = { dx: 0, dy: 0, maxScale: 1 };
    let frame = 0;

    const measure = () => {
      const pinEl = pin.current;
      const sceneEl = scene.current;
      const doorEl = door.current;
      if (!pinEl || !sceneEl || !doorEl) return;
      metrics.current = {
        top: pinEl.getBoundingClientRect().top + window.scrollY,
        length: pinEl.offsetHeight - header.offsetHeight,
      };
      const { x, y } = offsetWithin(doorEl, sceneEl);
      const centreX = x + doorEl.offsetWidth / 2;
      const centreY = y + doorEl.offsetHeight / 2;
      geometry = {
        dx: header.clientWidth / 2 - centreX,
        dy: header.clientHeight / 2 - (sceneEl.offsetTop + centreY),
        maxScale: Math.max(header.clientWidth / doorEl.offsetWidth, header.clientHeight / doorEl.offsetHeight) * FILL_MARGIN,
      };
      header.style.setProperty('--origin-x', `${centreX}px`);
      header.style.setProperty('--origin-y', `${centreY}px`);
      header.style.setProperty('--door-x', `${centreX}px`);
    };

    const render = () => {
      frame = 0;
      const p = progressFor(window.scrollY, metrics.current.top, metrics.current.length);
      const f = sceneFrame(p, geometry);
      const set = (name: string, value: string) => header.style.setProperty(name, value);
      set('--open', f.open.toFixed(4));
      set('--hero-opacity', f.heroOpacity.toFixed(3));
      set('--hero-shift', `${f.heroShift.toFixed(1)}px`);
      set('--hint-opacity', f.hintOpacity.toFixed(3));
      set('--light', f.light.toFixed(3));
      set('--scale', f.scale.toFixed(4));
      set('--tx', `${f.translateX.toFixed(1)}px`);
      set('--ty', `${f.translateY.toFixed(1)}px`);
      set('--blur', `${f.blur.toFixed(2)}px`);
      set('--side-opacity', f.sideOpacity.toFixed(3));
      set('--vignette', f.vignette.toFixed(3));
      const state = doorState(f.open);
      if (header.dataset.door !== state) header.dataset.door = state;
      if (behind) {
        behind.style.opacity = f.cross.toFixed(3);
        behind.style.pointerEvents = f.cross > 0.5 ? 'auto' : 'none';
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    void document.fonts?.ready.then(onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame) window.cancelAnimationFrame(frame);
      behind?.style.removeProperty('opacity');
      behind?.style.removeProperty('pointer-events');
    };
  }, [enabled, refs, behindId]);

  /** Door click, tap, Enter or Space: scroll to the end of the pinned section so the same animation plays. */
  const enter = () => {
    if (!enabled || prefersReducedMotion()) {
      goTo(behindId, false);
      return;
    }
    const { top, length } = metrics.current;
    window.scrollTo({ top: top + length, behavior: 'smooth' });
    afterScroll(() => focusQuietly(behindId));
  };

  return { enabled, enter };
}
