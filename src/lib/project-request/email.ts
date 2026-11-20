import { formatAnswer } from './format';
import { MALLS } from './shared-fields';
import { getPath, visibleFields } from './paths';
import type { Lang } from './types';
import type { CleanRequest } from './validate';

const BRAND_RED = '#E13226';
const NOT_ANSWERED = 'Not answered';

interface Row {
  readonly label: string;
  readonly value: string;
}

interface Section {
  readonly title: string;
  readonly rows: readonly Row[];
}

export interface RequestEmail {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

export interface RequestEmailContext {
  readonly reference: string;
  readonly lang: Lang;
  readonly fileNames: readonly string[];
  readonly submittedAt: Date;
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const str = (value: unknown): string => (typeof value === 'string' ? value : '');

const mallName = (request: CleanRequest): string => {
  const { values, details } = request;
  if (request.path === 'quick') return str(values.location) || 'Location not given';
  if (values.mall === 'other') return details.mall ?? 'Other mall';
  return MALLS.find((m) => m.id === values.mall)?.label.en ?? 'Mall not given';
};

const brandName = (request: CleanRequest): string =>
  request.path === 'quick' ? str(request.values.company) || str(request.values.fullName) : str(request.values.brand);

const kuwaitTime = (date: Date): string =>
  new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kuwait', dateStyle: 'medium', timeStyle: 'short' }).format(date);

const buildSections = (request: CleanRequest, ctx: RequestEmailContext): readonly Section[] => {
  const path = getPath(request.path);

  const summary: Section = {
    title: 'Request',
    rows: [
      { label: 'Path', value: path.emailLabel },
      { label: 'Reference', value: ctx.reference },
      { label: 'Submitted', value: `${kuwaitTime(ctx.submittedAt)} (Kuwait)` },
      { label: 'Form language', value: ctx.lang === 'ar' ? 'Arabic' : 'English' },
    ],
  };

  const answers = path.steps.map((step) => ({
    title: step.title.en,
    rows: visibleFields(step, request.values)
      .filter((f) => f.type !== 'upload')
      .map((field) => ({
        label: field.label.en,
        value: formatAnswer(field, request.values[field.id], request.details[field.id], 'en') || NOT_ANSWERED,
      })),
  }));

  const attachments: Section = {
    title: 'Attachments',
    rows: [{ label: 'Files', value: ctx.fileNames.length > 0 ? ctx.fileNames.join(', ') : 'None' }],
  };

  return [summary, ...answers, attachments];
};

const rowHtml = ({ label, value }: Row): string => {
  const colour = value === NOT_ANSWERED ? '#9a9a9a' : '#222';
  return `<tr>
    <td style="padding:7px 12px 7px 0;vertical-align:top;width:44%;color:#555;font-size:13px;">${escapeHtml(label)}</td>
    <td style="padding:7px 0;vertical-align:top;font-size:14px;color:${colour};white-space:pre-wrap;">${escapeHtml(value)}</td>
  </tr>`;
};

const sectionHtml = (section: Section): string => `
  <h3 style="margin:26px 0 6px;font-size:15px;color:#111;border-bottom:2px solid ${BRAND_RED};padding-bottom:6px;">${escapeHtml(section.title)}</h3>
  <table style="width:100%;border-collapse:collapse;">${section.rows.map(rowHtml).join('')}</table>`;

const sectionText = (section: Section): string =>
  [section.title.toUpperCase(), ...section.rows.map((r) => `${r.label}: ${r.value}`)].join('\n');

export function buildRequestEmail(request: CleanRequest, ctx: RequestEmailContext): RequestEmail {
  const path = getPath(request.path);
  const sections = buildSections(request, ctx);

  const headline = `${path.emailLabel} | ${ctx.reference}`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:660px;margin:0 auto;">
    <p style="margin:0 0 4px;color:${BRAND_RED};font-weight:bold;font-size:13px;">${escapeHtml(headline)}</p>
    <h2 style="margin:0 0 4px;color:#111;">New project request</h2>
    <p style="margin:0;color:#555;font-size:14px;">Sent from the igateinteriors.com request form.</p>
    ${sections.map(sectionHtml).join('')}
  </div>`;

  return {
    subject: `Project request [${path.emailLabel}]: ${brandName(request)}, ${mallName(request)} (${ctx.reference})`,
    html,
    text: [headline, '', ...sections.map(sectionText).join('\n\n').split('\n')].join('\n'),
  };
}
