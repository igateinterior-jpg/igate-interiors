import { describe, expect, it } from 'vitest';
import { PATHS } from './paths';
import type { Bilingual } from './types';

const BANNED = /[–—]|\belevate|\bseamless|\bbespoke|\btransformative/i;

const collectText = (): Bilingual[] =>
  PATHS.flatMap((path) => [
    path.title,
    path.line,
    ...(path.heading ? [path.heading] : []),
    ...(path.description ? [path.description] : []),
    ...path.steps.flatMap((step) => [
      step.title,
      ...step.fields.flatMap((f) => [
        f.label,
        ...(f.question ? [f.question] : []),
        ...(f.placeholder ? [f.placeholder] : []),
        ...(f.options ?? []).flatMap((o) => [o.label, ...(o.detailLabel ? [o.detailLabel] : [])]),
      ]),
    ]),
  ]);

describe('form content', () => {
  it('has English and Arabic for every piece of text', () => {
    for (const text of collectText()) {
      expect(text.en.trim()).not.toBe('');
      expect(text.ar.trim()).not.toBe('');
    }
  });

  it('uses Western digits in Arabic', () => {
    for (const text of collectText()) expect(text.ar).not.toMatch(/[٠-٩]/);
  });

  it('has no em dashes or banned words', () => {
    for (const text of collectText()) {
      expect(text.en).not.toMatch(BANNED);
      expect(text.ar).not.toMatch(BANNED);
    }
  });

  it('uses one Arabic name for Core & Shell', () => {
    for (const text of collectText()) {
      expect(text.ar).not.toMatch(/الإعادة إلى الهيكل|الهيكل الأساسي/);
      if (text.en.includes('Core & Shell')) expect(text.ar).toContain('ترميم الهيكل والأساس');
    }
  });

  it('uses unique field ids within each path', () => {
    for (const path of PATHS) {
      const ids = path.steps.flatMap((s) => s.fields.map((f) => f.id));
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('uses unique option ids within each field and points conditions at real fields', () => {
    for (const path of PATHS) {
      const fields = path.steps.flatMap((s) => s.fields);
      for (const f of fields) {
        const ids = (f.options ?? []).map((o) => o.id);
        expect(new Set(ids).size).toBe(ids.length);
        if (f.showIf) {
          const target = fields.find((t) => t.id === f.showIf!.field);
          expect(target?.options?.some((o) => o.id === f.showIf!.includes)).toBe(true);
        }
      }
    }
  });
});
