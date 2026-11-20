import { describe, expect, it } from 'vitest';
import { comingSoonRewrite, isComingSoonEnabled } from './site-mode';

describe('comingSoonRewrite', () => {
  it.each([
    ['/', '/coming-soon/en'],
    ['/en', '/coming-soon/en'],
    ['/en/about', '/coming-soon/en'],
    ['/ar', '/coming-soon/ar'],
    ['/ar/projects/abc', '/coming-soon/ar'],
  ])('rewrites %s to %s', (pathname, expected) => {
    expect(comingSoonRewrite(pathname)).toBe(expected);
  });

  it.each(['/en/studio', '/ar/studio/desk', '/arabic'])('leaves %s alone', (pathname) => {
    expect(comingSoonRewrite(pathname)).toBeNull();
  });
});

describe('isComingSoonEnabled', () => {
  it('is on unless explicitly switched off', () => {
    expect(isComingSoonEnabled(undefined)).toBe(true);
    expect(isComingSoonEnabled('on')).toBe(true);
    expect(isComingSoonEnabled('off')).toBe(false);
    expect(isComingSoonEnabled(' OFF ')).toBe(false);
  });
});
