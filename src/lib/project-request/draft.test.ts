import { describe, expect, it } from 'vitest';
import { parseDraft, serializeDraft, type Draft } from './draft';

const draft: Draft = {
  path: 'core',
  step: 3,
  values: { brand: 'Cafe Nero', payment: ['cash', 'wamd'] },
  details: { payment: 'Split 50/50' },
};

describe('draft storage', () => {
  it('round-trips a draft', () => {
    expect(parseDraft(serializeDraft(draft))).toEqual(draft);
  });

  it.each([null, '', 'not json', '{"v":1}', '[]'])('returns null for unusable input %s', (raw) => {
    expect(parseDraft(raw)).toBeNull();
  });

  it('drops an unknown path and clamps the step', () => {
    const raw = JSON.stringify({ v: 2, path: 'pizza', step: -4, values: {}, details: {} });
    expect(parseDraft(raw)).toMatchObject({ path: null, step: 0 });
  });

  it('keeps only string and string-list values', () => {
    const raw = JSON.stringify({
      v: 2,
      path: 'quick',
      step: 1,
      values: { fullName: 'Sara', bad: 42, list: ['a', 3], nested: { x: 1 } },
      details: { ok: 'yes', bad: false },
    });
    const parsed = parseDraft(raw);
    expect(parsed?.values).toEqual({ fullName: 'Sara' });
    expect(parsed?.details).toEqual({ ok: 'yes' });
  });
});
