import { describe, expect, it } from 'vitest';
import { REFERENCE_PATTERN, kuwaitDate, makeReference } from './reference';

const fixed = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe('makeReference', () => {
  it('formats as IG-REQ-DDMMYY-HHMM-XX in Kuwait time', () => {
    // 10:42 UTC is 13:42 in Kuwait. 0.28 picks "K", 0.92 picks "7".
    expect(makeReference(new Date('2026-11-20T10:42:00Z'), fixed(0.28, 0.92))).toBe('IG-REQ-201126-1342-K7');
  });

  it('rolls over to the next day at Kuwait midnight, not UTC midnight', () => {
    expect(makeReference(new Date('2026-11-20T22:30:00Z'), fixed(0))).toBe('IG-REQ-211126-0130-AA');
  });

  it('uses a 24-hour clock with leading zeros', () => {
    expect(makeReference(new Date('2026-01-05T05:07:00Z'), fixed(0))).toMatch(/^IG-REQ-050126-0807-/);
    expect(makeReference(new Date('2026-01-05T20:59:59Z'), fixed(0))).toMatch(/^IG-REQ-050126-2359-/);
  });

  it('ends with two uppercase letters or digits, never out of range', () => {
    expect(makeReference(new Date('2026-11-20T10:42:00Z'), fixed(0.99999))).toBe('IG-REQ-201126-1342-99');
    for (let i = 0; i < 200; i++) {
      expect(makeReference(new Date('2026-11-20T10:42:00Z'), Math.random)).toMatch(REFERENCE_PATTERN);
    }
  });

  it('gives different references to requests in the same minute', () => {
    const now = new Date('2026-11-20T10:42:00Z');
    const refs = new Set(Array.from({ length: 50 }, () => makeReference(now, Math.random)));
    expect(refs.size).toBeGreaterThan(40);
  });
});

describe('kuwaitDate', () => {
  it('returns the Kuwait calendar date as YYYY-MM-DD', () => {
    expect(kuwaitDate(new Date('2026-11-20T21:30:00Z'))).toBe('2026-11-21');
    expect(kuwaitDate(new Date('2026-11-20T20:59:00Z'))).toBe('2026-11-20');
  });
});
