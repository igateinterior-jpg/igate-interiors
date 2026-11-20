import { describe, expect, it } from 'vitest';
import { buildRequestEmail } from './email';
import type { CleanRequest } from './validate';

const ctx = {
  reference: 'IG-REQ-201126-0042',
  lang: 'ar' as const,
  fileNames: ['plan.pdf'],
  submittedAt: new Date('2026-11-20T10:00:00Z'),
};

const core: CleanRequest = {
  path: 'core',
  values: {
    company: 'Alshaya <script>',
    brand: 'Cafe Nero',
    mall: 'avenues',
    shop: 'G-114',
    manager: 'Sara Ahmed',
    phone: '97234117',
    representative: 'Omar',
    unitType: ['fnb'],
    assets: ['none'],
    demolition: ['deepSlab'],
    screedDepth: ['ffl12'],
    payment: ['cash', 'other'],
  },
  details: { payment: 'Split 50/50' },
};

describe('buildRequestEmail', () => {
  const email = buildRequestEmail(core, ctx);

  it('puts path, brand, mall and reference in the subject', () => {
    expect(email.subject).toBe('Project request [Core & Shell restoration]: Cafe Nero, The Avenues (IG-REQ-201126-0042)');
  });

  it('shows the path and reference at the top', () => {
    const top = email.text.split('\n').slice(0, 3).join('\n');
    expect(top).toContain('Core & Shell restoration');
    expect(top).toContain('IG-REQ-201126-0042');
  });

  it('escapes user-supplied HTML', () => {
    expect(email.html).toContain('Alshaya &lt;script&gt;');
    expect(email.html).not.toContain('<script>');
  });

  it('writes every answer in English with details and formatted phone', () => {
    expect(email.text).toContain('Original unit typology: F&B (restaurant / cafe / heavy cooking)');
    expect(email.text).toContain('Payment terms: Cash, Other: Split 50/50');
    expect(email.text).toContain('Contact number: +965 9723 4117');
    expect(email.text).toContain('Target screed depressed depth: FFL 12 cm below mall');
  });

  it('marks unanswered questions and skips questions that did not apply', () => {
    expect(email.text).toContain('Unit area (m²): Not answered');
    expect(email.text).toContain('F&B extras: Not answered');

    const retail = buildRequestEmail({ ...core, values: { ...core.values, unitType: ['retail'] } }, ctx);
    expect(retail.text).not.toContain('F&B extras');
  });

  it('lists attachments and the form language', () => {
    expect(email.text).toContain('plan.pdf');
    expect(email.text).toContain('Arabic');
  });

  it('contains no em or en dashes', () => {
    expect(email.subject + email.html + email.text).not.toMatch(/[–—]/);
  });

  it('falls back sensibly for a quick enquiry without company or location', () => {
    const quick = buildRequestEmail(
      { path: 'quick', values: { fullName: 'Sara', phone: '97234117', services: ['mep'], details: 'Hi' }, details: {} },
      ctx,
    );
    expect(quick.subject).toBe('Project request [Quick enquiry]: Sara, Location not given (IG-REQ-201126-0042)');
  });

  it('names an "Other" mall from its detail box', () => {
    const other = buildRequestEmail({ ...core, values: { ...core.values, mall: 'other' }, details: { mall: 'Al Fanar, Salmiya' } }, ctx);
    expect(other.subject).toContain('Cafe Nero, Al Fanar, Salmiya');
  });
});
