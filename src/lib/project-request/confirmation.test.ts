import { describe, expect, it } from 'vitest';
import { buildConfirmationEmail } from './confirmation';
import type { CleanRequest } from './validate';

const REF = 'IG-REQ-201126-1342-K7';
const LOGO = 'https://igateinteriors.com/brand/igate-logo-email.png';

const core: CleanRequest = {
  path: 'core',
  values: {
    company: 'Alshaya Retail',
    brand: 'Cafe Nero <b>',
    mall: 'avenues',
    shop: 'G-114',
    manager: 'Sara Ahmed',
    phone: '97234117',
    email: 'sara@example.com',
    representative: 'Omar',
    unitType: ['fnb'],
    assets: ['none'],
    demolition: ['deepSlab', 'ceilings'],
    screedDepth: ['ffl12'],
    mep: ['hvac'],
    mepExtent: ['capped'],
    duration: ['d15'],
    workingHours: ['night'],
    hoarding: ['igate'],
    drawings: ['no'],
    payment: ['cash'],
  },
  details: {},
};

const quick: CleanRequest = {
  path: 'quick',
  values: { fullName: 'Sara', phone: '97234117', email: 'sara@example.com', services: ['fitout', 'mep'], details: 'Hi', location: 'Marina Mall' },
  details: {},
};

describe('buildConfirmationEmail: English', () => {
  const email = buildConfirmationEmail(core, { reference: REF, lang: 'en', logoUrl: LOGO });

  it('uses the agreed subject', () => {
    expect(email.subject).toBe(`We received your request (${REF})`);
  });

  it('thanks the client, shows the reference and the 24 hour promise', () => {
    expect(email.text).toContain('Thank you');
    expect(email.text).toContain(REF);
    expect(email.text).toContain('within 24 hours');
    expect(email.html).toContain(REF);
  });

  it('summarises path, brand, mall, shop and the main Core & Shell scope', () => {
    expect(email.text).toContain('Request type: Core & Shell restoration');
    expect(email.text).toContain('Brand / trading name: Cafe Nero <b>');
    expect(email.text).toContain('Mall name and location: The Avenues');
    expect(email.text).toContain('Shop number and floor level: G-114');
    expect(email.text).toContain('Original unit typology: F&B (restaurant / cafe / heavy cooking)');
    expect(email.text).toContain('Civil and structural demolition requirements: Deep slab removal back to structural slab level, Remove all false ceilings and expose upper concrete slab');
    expect(email.text).toContain('MEP and services disconnection boundaries: HVAC');
    expect(email.text).toContain('Duration for Core & Shell project: 15 days');
  });

  it('leaves out details the client did not need to repeat', () => {
    expect(email.text).not.toContain('Payment terms');
    expect(email.text).not.toContain('Contact number');
  });

  it('escapes what the client typed', () => {
    expect(email.html).toContain('Cafe Nero &lt;b&gt;');
    expect(email.html).not.toContain('Cafe Nero <b>');
  });

  it('has a WhatsApp button prefilled with the reference', () => {
    const link = `https://wa.me/96597234117?text=${encodeURIComponent(`Hi, my request reference is ${REF}`)}`;
    expect(email.html).toContain(`href="${link}"`);
  });

  it('shows the logo, contact details and a left-to-right layout', () => {
    expect(email.html).toContain(`src="${LOGO}"`);
    expect(email.html).toContain('info@igateinteriors.com');
    expect(email.html).toContain('(+965) 9723 4117');
    expect(email.html).toContain('dir="ltr"');
    expect(email.html).not.toContain('dir="rtl"');
  });

  it('contains no em or en dashes', () => {
    expect(email.subject + email.html + email.text).not.toMatch(/[–—]/);
  });
});

describe('buildConfirmationEmail: Arabic', () => {
  const email = buildConfirmationEmail(core, { reference: REF, lang: 'ar', logoUrl: LOGO });

  it('uses the Arabic subject and a right-to-left layout', () => {
    expect(email.subject).toBe(`استلمنا طلبك (${REF})`);
    expect(email.html).toContain('dir="rtl"');
    expect(email.html).toContain('lang="ar"');
  });

  it('writes the summary in Arabic and keeps the reference left to right', () => {
    expect(email.text).toContain('نوع الطلب: ترميم الهيكل والأساس');
    expect(email.text).toContain('اسم المجمع والموقع: الأفنيوز');
    expect(email.text).toContain('مدة مشروع ترميم الهيكل والأساس: 15 يوماً');
    expect(email.html).toMatch(new RegExp(`dir="ltr"[^>]*>${REF}`));
  });

  it('prefills the Arabic WhatsApp message and has no em dashes', () => {
    expect(email.html).toContain(encodeURIComponent(`مرحباً، الرقم المرجعي لطلبي هو ${REF}`));
    expect(email.subject + email.html + email.text).not.toMatch(/[–—]/);
  });
});

describe('buildConfirmationEmail: quick enquiry', () => {
  it('summarises company, location and services', () => {
    const email = buildConfirmationEmail(quick, { reference: REF, lang: 'en', logoUrl: LOGO });
    expect(email.text).toContain('Request type: Quick enquiry');
    expect(email.text).toContain('Mall or location: Marina Mall');
    expect(email.text).toContain('Service needed: Interior fit-out, MEP works');
    expect(email.text).not.toContain('Company or brand');
  });
});
