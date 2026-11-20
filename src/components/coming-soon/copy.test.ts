import { describe, expect, it } from 'vitest';
import { COPY } from './copy';

const BANNED = /[–—]|\belevate|\bseamless|\bbespoke|\btransformative/i;

const flatten = (value: unknown): string[] => {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') return [String(value('IG-REQ-201126-0042', 5))];
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (value && typeof value === 'object') return Object.values(value).flatMap(flatten);
  return [];
};

describe('page copy', () => {
  it('has the same keys in English and Arabic', () => {
    expect(Object.keys(COPY.ar).sort()).toEqual(Object.keys(COPY.en).sort());
    expect(COPY.ar.services).toHaveLength(COPY.en.services.length);
    expect(COPY.ar.steps).toHaveLength(COPY.en.steps.length);
    expect(COPY.ar.malls).toHaveLength(COPY.en.malls.length);
  });

  it('has no em dashes, banned words or Eastern Arabic digits', () => {
    for (const lang of ['en', 'ar'] as const) {
      for (const text of flatten(COPY[lang])) {
        expect(text).not.toMatch(BANNED);
        expect(text).not.toMatch(/[٠-٩]/);
      }
    }
  });

  it('uses one Arabic name for Core & Shell and the agreed upload wording', () => {
    for (const text of flatten(COPY.ar)) expect(text).not.toMatch(/الإعادة إلى الهيكل|الهيكل الأساسي/);
    expect(COPY.ar.services).toContain('ترميم الهيكل والأساس');
    expect(COPY.ar.uploadTouch).toBe('اضغط لرفع الملفات');
  });

  it('uses the agreed door hint and short skip link', () => {
    expect(COPY.en.doorHint).toBe('Scroll or tap the door to step inside');
    expect(COPY.ar.doorHint).toBe('مرّر أو اضغط على الباب للدخول');
    expect(COPY.en.skipToFormShort).toBe('Skip to form');
    expect(COPY.ar.skipToFormShort).toBe('انتقل إلى النموذج');
  });

  it('keeps the reference out of the thank-you sentence', () => {
    expect(COPY.en.thankYou).toBe('Thank you. We have your request and will contact you within 24 hours.');
    expect(COPY.ar.thankYou).toBe('شكراً لك. استلمنا طلبك وسنتواصل معك خلال 24 ساعة.');
  });

  it('prefills the WhatsApp message with the reference', () => {
    expect(COPY.en.whatsappReference('IG-REQ-201126-1342-K7')).toBe('Hi, my request reference is IG-REQ-201126-1342-K7');
    expect(COPY.ar.whatsappReference('IG-REQ-201126-1342-K7')).toBe('مرحباً، الرقم المرجعي لطلبي هو IG-REQ-201126-1342-K7');
  });
});
