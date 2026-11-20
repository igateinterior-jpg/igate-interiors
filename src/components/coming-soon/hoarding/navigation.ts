export const prefersReducedMotion = (): boolean =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Moves focus to an element without scrolling to it again. */
export const focusQuietly = (id: string): void => {
  document.getElementById(id)?.focus({ preventScroll: true });
};

/** Scrolls to an element (smoothly unless motion is reduced) and moves focus there. */
export const goTo = (targetId: string, smooth: boolean): void => {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  focusQuietly(targetId);
};

const SCROLL_END_FALLBACK_MS = 1500;

/** Runs once the current smooth scroll has finished (or after a fallback delay). */
export const afterScroll = (callback: () => void): void => {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    window.removeEventListener('scrollend', finish);
    callback();
  };
  window.addEventListener('scrollend', finish, { once: true });
  window.setTimeout(finish, SCROLL_END_FALLBACK_MS);
};
