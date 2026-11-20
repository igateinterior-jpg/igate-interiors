import { CONTACT, whatsappLink, whatsappReferenceMessage } from '../contact';
import { escapeHtml } from './email';
import { formatAnswer } from './format';
import { getPath } from './paths';
import type { Lang, PathId } from './types';
import type { CleanRequest } from './validate';

/**
 * Confirmation sent to the client, in the language they used on the form.
 * Table layout with inline styles so it holds up in Gmail and Outlook on phones.
 */

const COLOURS = {
  page: '#f2f2ef',
  card: '#ffffff',
  header: '#1e2024',
  red: '#e13226',
  button: '#c8281e',
  ink: '#1f2124',
  body: '#3b3e43',
  muted: '#6b6e73',
  line: '#e3e3df',
  footerText: '#c9c6bf',
} as const;

const FONTS: Record<Lang, string> = {
  en: "Arial, Helvetica, sans-serif",
  ar: "Tahoma, Arial, sans-serif",
};

/** The answers worth repeating back to the client, per path. */
const SUMMARY_FIELDS: Record<PathId, readonly string[]> = {
  quick: ['company', 'location', 'services'],
  hoarding: ['brand', 'mall', 'shop', 'frontage', 'height', 'installDate'],
  core: ['brand', 'mall', 'shop', 'unitType', 'demolition', 'mep', 'duration'],
};

interface Strings {
  readonly subject: (ref: string) => string;
  readonly preheader: (ref: string) => string;
  readonly heading: string;
  readonly intro: string;
  readonly referenceLabel: string;
  readonly summaryTitle: string;
  readonly requestType: string;
  readonly whatsapp: string;
  readonly kuwait: string;
  readonly rights: string;
}

const STRINGS: Record<Lang, Strings> = {
  en: {
    subject: (ref) => `We received your request (${ref})`,
    preheader: (ref) => `Your reference is ${ref}. We will contact you within 24 hours.`,
    heading: 'Thank you for your request.',
    intro: 'We have received your request and will contact you within 24 hours.',
    referenceLabel: 'Your reference',
    summaryTitle: 'What you sent us',
    requestType: 'Request type',
    whatsapp: 'WhatsApp us',
    kuwait: 'Kuwait',
    rights: '© 2026 iGate Interiors. All rights reserved.',
  },
  ar: {
    subject: (ref) => `استلمنا طلبك (${ref})`,
    preheader: (ref) => `الرقم المرجعي لطلبك هو ${ref}. سنتواصل معك خلال 24 ساعة.`,
    heading: 'شكراً لطلبك.',
    intro: 'استلمنا طلبك وسنتواصل معك خلال 24 ساعة.',
    referenceLabel: 'الرقم المرجعي لطلبك',
    summaryTitle: 'ملخص ما أرسلته',
    requestType: 'نوع الطلب',
    whatsapp: 'تواصل عبر واتساب',
    kuwait: 'الكويت',
    rights: '© 2026 آي غيت للتصميم الداخلي. جميع الحقوق محفوظة.',
  },
};

export interface ConfirmationContext {
  readonly reference: string;
  readonly lang: Lang;
  readonly logoUrl: string;
}

export interface ConfirmationEmail {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

interface Row {
  readonly label: string;
  readonly value: string;
}

/*
 * The confirmation goes to an address nobody has verified, so free text typed
 * into the form is treated with care: anything that looks like a link or an
 * email address is left out, and the rest is shortened. Fixed option labels
 * are shown as they are. The team email always gets the full answers.
 */
const FREE_TEXT_MAX = 60;
const LINK_LIKE = /(https?:\/\/|www\.|@|[\p{L}\p{N}-]+\.[a-z]{2,}(?=$|[\s/:?#]))/iu;

const safeFreeText = (value: string): string | null => {
  if (LINK_LIKE.test(value)) return null;
  return value.length > FREE_TEXT_MAX ? `${value.slice(0, FREE_TEXT_MAX)}...` : value;
};

const summaryRows = (request: CleanRequest, lang: Lang): readonly Row[] => {
  const path = getPath(request.path);
  const fields = path.steps.flatMap((s) => s.fields);
  const answers = SUMMARY_FIELDS[request.path]
    .map((id) => fields.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => f !== undefined)
    .map((f) => {
      const value = formatAnswer(f, request.values[f.id], request.details[f.id], lang);
      const freeText = f.type === 'text' || Boolean(request.details[f.id]);
      return { label: f.label[lang], value: freeText ? safeFreeText(value) : value };
    })
    .filter((row): row is Row => row.value !== null && row.value !== '');
  return [{ label: STRINGS[lang].requestType, value: path.title[lang] }, ...answers];
};

const rowHtml = ({ label, value }: Row, font: string, align: string): string => `
  <tr><td style="padding:10px 0;border-bottom:1px solid ${COLOURS.line};font-family:${font};text-align:${align};">
    <div style="font-size:13px;line-height:1.4;color:${COLOURS.muted};">${escapeHtml(label)}</div>
    <div style="font-size:15px;line-height:1.5;color:${COLOURS.ink};">${escapeHtml(value)}</div>
  </td></tr>`;

const footerHtml = (s: Strings, font: string, align: string): string => {
  const phones = CONTACT.phones
    .map((p) => `<a href="${p.href}" dir="ltr" style="color:#ffffff;text-decoration:none;">${p.display}</a>`)
    .join('<br>');
  return `
  <tr><td bgcolor="${COLOURS.header}" style="background:${COLOURS.header};padding:22px 28px;font-family:${font};font-size:13px;line-height:1.8;color:${COLOURS.footerText};text-align:${align};">
    ${phones}<br>
    <a href="mailto:${CONTACT.email}" style="color:#ffffff;text-decoration:underline;">${CONTACT.email}</a><br>
    ${escapeHtml(s.kuwait)}<br>
    <span style="font-size:12px;">${escapeHtml(s.rights)}</span>
  </td></tr>`;
};

export function buildConfirmationEmail(request: CleanRequest, ctx: ConfirmationContext): ConfirmationEmail {
  const { reference, lang, logoUrl } = ctx;
  const s = STRINGS[lang];
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const align = lang === 'ar' ? 'right' : 'left';
  const font = FONTS[lang];
  const rows = summaryRows(request, lang);
  const whatsapp = whatsappLink(whatsappReferenceMessage(lang, reference));
  const subject = s.subject(reference);

  const html = `<!doctype html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:${COLOURS.page};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(s.preheader(reference))}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOURS.page}" style="background:${COLOURS.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" dir="${dir}" style="max-width:600px;background:${COLOURS.card};">
  <tr><td bgcolor="${COLOURS.header}" align="${align}" style="background:${COLOURS.header};padding:24px 28px;">
    <img src="${logoUrl}" width="140" alt="iGate Interiors" style="display:block;border:0;width:140px;max-width:140px;height:auto;">
  </td></tr>
  <tr><td bgcolor="${COLOURS.red}" style="background:${COLOURS.red};height:4px;line-height:4px;font-size:4px;">&nbsp;</td></tr>
  <tr><td style="padding:32px 28px 8px;font-family:${font};text-align:${align};">
    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.3;color:${COLOURS.ink};">${escapeHtml(s.heading)}</h1>
    <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:${COLOURS.body};">${escapeHtml(s.intro)}</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:2px dashed #b9bcc2;">
      <tr><td style="padding:14px 16px;text-align:${align};">
        <div style="font-family:${font};font-size:13px;line-height:1.4;color:${COLOURS.muted};">${escapeHtml(s.referenceLabel)}</div>
        <div dir="ltr" style="font-family:Arial, Helvetica, sans-serif;font-size:22px;line-height:1.4;font-weight:bold;letter-spacing:1px;color:${COLOURS.ink};text-align:${align};">${escapeHtml(reference)}</div>
      </td></tr>
    </table>
  </td></tr>
  <tr><td style="padding:24px 28px 8px;font-family:${font};text-align:${align};">
    <h2 style="margin:0 0 4px;font-size:17px;line-height:1.4;color:${COLOURS.ink};">${escapeHtml(s.summaryTitle)}</h2>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows.map((r) => rowHtml(r, font, align)).join('')}
    </table>
  </td></tr>
  <tr><td align="${align}" style="padding:20px 28px 32px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td bgcolor="${COLOURS.button}" style="background:${COLOURS.button};border-radius:2px;">
        <a href="${whatsapp}" style="display:inline-block;padding:14px 26px;font-family:${font};font-size:16px;font-weight:bold;line-height:1.2;color:#ffffff;text-decoration:none;">${escapeHtml(s.whatsapp)}</a>
      </td>
    </tr></table>
  </td></tr>
  ${footerHtml(s, font, align)}
</table>
</td></tr>
</table>
</body>
</html>`;

  const text = [
    s.heading,
    s.intro,
    '',
    `${s.referenceLabel}: ${reference}`,
    '',
    s.summaryTitle,
    ...rows.map((r) => `${r.label}: ${r.value}`),
    '',
    `${s.whatsapp}: ${whatsapp}`,
    '',
    ...CONTACT.phones.map((p) => p.display),
    CONTACT.email,
    s.kuwait,
  ].join('\n');

  return { subject, html, text };
}
