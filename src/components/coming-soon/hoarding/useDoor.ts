'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

export type DoorState = 'closed' | 'opening' | 'open';
export type ScenePhase = 'idle' | 'pushing' | 'fading';

const DOOR_KEY = 'igate-door-open';
const PUSH_START_MS = 420;
const PUSH_MS = 560;
const FADE_MS = 200;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const rememberOpened = () => {
  try {
    sessionStorage.setItem(DOOR_KEY, '1');
  } catch {
    // Storage blocked: the door simply plays again next time.
  }
};

const wasOpened = (): boolean => {
  try {
    return sessionStorage.getItem(DOOR_KEY) === '1';
  } catch {
    return false;
  }
};

export const goTo = (targetId: string, smooth: boolean) => {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  target.focus({ preventScroll: true });
};

/**
 * Door sequence: the leaf swings on its hinge, the scene pushes forward through
 * the doorway, then the page jumps to the section behind the hoarding.
 */
export function useDoor(sceneRef: RefObject<HTMLElement | null>, doorRef: RefObject<HTMLElement | null>, targetId: string) {
  const [state, setState] = useState<DoorState>('closed');
  const [phase, setPhase] = useState<ScenePhase>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (wasOpened()) setState('open');
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  const later = (ms: number, fn: () => void) => {
    timers.current = [...timers.current, window.setTimeout(fn, ms)];
  };

  const finish = useCallback(() => {
    goTo(targetId, false);
    setPhase('idle');
    setState('open');
  }, [targetId]);

  const setPushOrigin = () => {
    const scene = sceneRef.current;
    const door = doorRef.current;
    if (!scene || !door) return;
    const s = scene.getBoundingClientRect();
    const d = door.getBoundingClientRect();
    scene.style.setProperty('--push-x', `${d.left - s.left + d.width / 2}px`);
    scene.style.setProperty('--push-y', `${d.top - s.top + d.height / 2}px`);
  };

  const enter = () => {
    const reduce = prefersReducedMotion();
    if (state === 'opening') return;
    if (state === 'open') {
      goTo(targetId, !reduce);
      return;
    }

    rememberOpened();
    if (reduce) {
      setPhase('fading');
      later(FADE_MS, finish);
      return;
    }

    setPushOrigin();
    setState('opening');
    later(PUSH_START_MS, () => setPhase('pushing'));
    later(PUSH_START_MS + PUSH_MS, finish);
  };

  return { state, phase, enter };
}
