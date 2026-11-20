/**
 * In-memory fixed-window rate limiter. Each serverless instance keeps its own
 * window and it resets on deploy, so treat it as a spam brake, not a guarantee.
 */

interface Window {
  readonly count: number;
  readonly resetAt: number;
}

export interface RateLimiterOptions {
  readonly max: number;
  readonly windowMs: number;
}

export interface RateLimiter {
  isLimited(key: string, now?: number): boolean;
}

export function createRateLimiter({ max, windowMs }: RateLimiterOptions): RateLimiter {
  const windows = new Map<string, Window>();

  return {
    isLimited(key, now = Date.now()) {
      const current = windows.get(key);

      if (!current || now > current.resetAt) {
        windows.set(key, { count: 1, resetAt: now + windowMs });
        return false;
      }

      if (current.count >= max) return true;

      windows.set(key, { ...current, count: current.count + 1 });
      return false;
    },
  };
}

export function clientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
