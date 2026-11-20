export type Theme = 'light' | 'dark';

export const THEME_KEY = 'igate-theme';

/**
 * Runs in <head> before first paint so the page never flashes the wrong theme
 * or jumps when the scroll-driven landing switches on.
 * A saved theme choice wins; otherwise the device setting is used.
 */
export const THEME_BOOT_SCRIPT = `(function(){var d=document.documentElement;try{var s=localStorage.getItem('${THEME_KEY}');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.setAttribute('data-theme',t);}catch(e){d.setAttribute('data-theme','dark');}try{if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)d.setAttribute('data-scrolly','on');}catch(e){}})();`;

/** Set by the boot script when the scroll-driven landing is active (no reduced motion). */
export const SCROLLY_ATTR = 'data-scrolly';

export const currentTheme = (): Theme =>
  document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

export function applyTheme(theme: Theme, persist: boolean): void {
  document.documentElement.setAttribute('data-theme', theme);
  if (!persist) return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
}

export function hasSavedTheme(): boolean {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'light' || saved === 'dark';
  } catch {
    return false;
  }
}
