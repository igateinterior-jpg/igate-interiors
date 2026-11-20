import { describe, expect, it } from 'vitest';
import { formatAnswer, formatKuwaitPhone, sanitizePhoneInput } from './format';
import { getPath } from './paths';

const field = (id: string) => getPath('hoarding').steps.flatMap((s) => s.fields).find((f) => f.id === id)!;

describe('sanitizePhoneInput', () => {
  it.each([
    ['9723', '9723'],
    ['9723 4117', '97234117'],
    ['+965 9723 4117', '97234117'],
    ['00965 6998 9934', '69989934'],
    ['972341171234', '97234117'],
    ['abc', ''],
  ])('turns %s into %s', (raw, expected) => {
    expect(sanitizePhoneInput(raw)).toBe(expected);
  });
});

describe('formatAnswer', () => {
  it('formats phones, chips with details and malls', () => {
    expect(formatKuwaitPhone('97234117')).toBe('+965 9723 4117');
    expect(formatAnswer(field('height'), ['set'], '3.2', 'en')).toBe('Set height: 3.2');
    expect(formatAnswer(field('height'), ['set'], '3.2', 'ar')).toBe('تحديد ارتفاع معين: 3.2');
    expect(formatAnswer(field('mall'), 'avenues', undefined, 'ar')).toBe('الأفنيوز');
    expect(formatAnswer(field('installDate'), '', undefined, 'en')).toBe('');
  });
});
