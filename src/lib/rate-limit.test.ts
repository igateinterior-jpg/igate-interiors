import { describe, expect, it } from 'vitest';
import { createRateLimiter } from './rate-limit';

describe('createRateLimiter', () => {
  it('allows requests up to the limit, then blocks', () => {
    const limiter = createRateLimiter({ max: 2, windowMs: 1000 });
    expect(limiter.isLimited('a', 0)).toBe(false);
    expect(limiter.isLimited('a', 10)).toBe(false);
    expect(limiter.isLimited('a', 20)).toBe(true);
  });

  it('tracks keys separately', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 1000 });
    expect(limiter.isLimited('a', 0)).toBe(false);
    expect(limiter.isLimited('b', 0)).toBe(false);
    expect(limiter.isLimited('a', 0)).toBe(true);
  });

  it('resets after the window passes', () => {
    const limiter = createRateLimiter({ max: 1, windowMs: 1000 });
    expect(limiter.isLimited('a', 0)).toBe(false);
    expect(limiter.isLimited('a', 500)).toBe(true);
    expect(limiter.isLimited('a', 1001)).toBe(false);
  });
});
