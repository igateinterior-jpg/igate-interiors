import { asList } from './paths';
import type { FieldDef, Lang } from './types';

const LIST_SEPARATOR: Record<Lang, string> = { en: ', ', ar: '، ' };

const LOCAL_DIGITS = 8;

/** Keeps only the 8 local digits as someone types or pastes, dropping a +965 or 00965 prefix. */
export function sanitizePhoneInput(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length <= LOCAL_DIGITS) return digits;
  const local = digits.startsWith('00965') ? digits.slice(5) : digits.startsWith('965') ? digits.slice(3) : digits;
  return local.slice(0, LOCAL_DIGITS);
}

export const formatKuwaitPhone = (digits: string): string =>
  digits.length === 8 ? `+965 ${digits.slice(0, 4)} ${digits.slice(4)}` : digits;

/** Human-readable answer for the review screen and the email. Empty answers return ''. */
export function formatAnswer(field: FieldDef, value: unknown, detail: string | undefined, lang: Lang): string {
  switch (field.type) {
    case 'chips':
    case 'mall': {
      const chosen = asList(value);
      return (field.options ?? [])
        .filter((o) => chosen.includes(o.id))
        .map((o) => (o.detail && detail ? `${o.label[lang]}: ${detail}` : o.label[lang]))
        .join(LIST_SEPARATOR[lang]);
    }
    case 'phone':
      return typeof value === 'string' ? formatKuwaitPhone(value) : '';
    case 'datetime':
      return typeof value === 'string' ? value.replace('T', ' ') : '';
    case 'upload':
      return '';
    default:
      return typeof value === 'string' ? value : '';
  }
}
