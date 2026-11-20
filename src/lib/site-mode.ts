/**
 * Coming soon mode shows the project request page on every public URL while
 * the full site is finished. Set COMING_SOON_MODE=off in Vercel to restore it.
 */

const STUDIO_PATH = /^\/(en|ar)\/studio(\/|$)/;
const ARABIC_PATH = /^\/ar(\/|$)/;
const LOCALE_PATH = /^\/(en|ar)?(\/|$)/;

export function isComingSoonEnabled(flag: string | undefined): boolean {
  return flag?.trim().toLowerCase() !== 'off';
}

/** The internal path to serve instead, or null when the request should pass through. */
export function comingSoonRewrite(pathname: string): string | null {
  if (STUDIO_PATH.test(pathname) || !LOCALE_PATH.test(pathname)) return null;
  return ARABIC_PATH.test(pathname) ? '/coming-soon/ar' : '/coming-soon/en';
}
