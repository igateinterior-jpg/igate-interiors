import { describe, expect, it } from 'vitest';
import { getPath } from './paths';
import { normalizeKuwaitPhone, validateFiles, validateRequest, validateStep } from './validate';

const TODAY = '2026-11-20';

const projectDetails = {
  company: 'Alshaya Retail',
  brand: 'Cafe Nero',
  mall: 'avenues',
  shop: 'G-114, ground floor',
  manager: 'Sara Ahmed',
  phone: '9723 4117',
  representative: 'Omar Ali',
};

const quick = {
  fullName: 'Sara Ahmed',
  phone: '97234117',
  services: ['fitout'],
  details: 'Fit-out for a 120 m² cafe.',
};

const hoarding = {
  ...projectDetails,
  frontage: '12.5',
  height: ['full'],
  fireRated: ['yes'],
  graphics: ['client'],
  accessDoor: ['no'],
  installDate: '2026-12-01',
};

const core = {
  ...projectDetails,
  unitType: ['retail'],
  assets: ['none'],
  demolition: ['screed'],
  mep: ['hvac'],
  mepExtent: ['capped'],
  workingHours: ['night'],
  duration: ['d15'],
  hoarding: ['igate'],
  drawings: ['no'],
  payment: ['cash'],
};

const run = (path: 'quick' | 'hoarding' | 'core', values: Record<string, unknown>, details = {}, confirmed = true) =>
  validateRequest(path, { values, details }, { today: TODAY, confirmed });

describe('normalizeKuwaitPhone', () => {
  it.each([
    ['97234117', '97234117'],
    ['9723 4117', '97234117'],
    ['+965 9723 4117', '97234117'],
    ['00965 6998 9934', '69989934'],
    ['22401234', '22401234'],
  ])('accepts %s', (raw, expected) => {
    expect(normalizeKuwaitPhone(raw)).toBe(expected);
  });

  it.each(['1234567', '123456789', '12345678', '87234117', 'abcdefgh', ''])('rejects %s', (raw) => {
    expect(normalizeKuwaitPhone(raw)).toBeNull();
  });
});

describe('validateRequest: quick enquiry', () => {
  it('accepts the required answers and normalises them', () => {
    const result = run('quick', { ...quick, fullName: '  Sara Ahmed ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.path).toBe('quick');
      expect(result.data.values.fullName).toBe('Sara Ahmed');
      expect(result.data.values.phone).toBe('97234117');
    }
  });

  it('flags missing required fields with the right codes', () => {
    const result = run('quick', {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toMatchObject({
        fullName: 'required',
        phone: 'required',
        services: 'chooseOption',
        details: 'required',
      });
      expect(result.errors.email).toBeUndefined();
    }
  });

  it('checks phone and email formats', () => {
    const result = run('quick', { ...quick, phone: '1234', email: 'not-an-email' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors.phone).toBe('invalidPhone');
      expect(result.errors.email).toBe('invalidEmail');
    }
  });

  it('only sends answers that belong to the quick path', () => {
    const result = run('quick', { ...quick, frontage: '10', payment: ['cash'] });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.values).not.toHaveProperty('frontage');
      expect(result.data.values).not.toHaveProperty('payment');
    }
  });

  it('rejects text over the limit', () => {
    const result = run('quick', { ...quick, details: 'x'.repeat(2001) });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.details).toBe('tooLong');
  });
});

describe('validateRequest: hoarding', () => {
  it('accepts a complete hoarding request', () => {
    expect(run('hoarding', hoarding).success).toBe(true);
  });

  it('requires the height when "Set height" is chosen', () => {
    const missing = run('hoarding', { ...hoarding, height: ['set'] });
    expect(missing.success).toBe(false);
    if (!missing.success) expect(missing.errors['height.detail']).toBe('required');

    const given = run('hoarding', { ...hoarding, height: ['set'] }, { height: '3.2' });
    expect(given.success).toBe(true);
    if (given.success) expect(given.data.details.height).toBe('3.2');
  });

  it('drops a detail whose option is not chosen', () => {
    const result = run('hoarding', hoarding, { height: '3.2' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.details).not.toHaveProperty('height');
  });

  it('rejects non-positive and non-numeric widths', () => {
    for (const frontage of ['0', '-2', 'wide', '5000']) {
      const result = run('hoarding', { ...hoarding, frontage });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.errors.frontage).toBe('invalidNumber');
    }
  });

  it('rejects past or malformed installation dates', () => {
    for (const installDate of ['2026-11-19', '2026-13-01', 'tomorrow']) {
      const result = run('hoarding', { ...hoarding, installDate });
      expect(result.success).toBe(false);
      if (!result.success) expect(result.errors.installDate).toBe('invalidDate');
    }
  });

  it('requires "Other" mall to be named', () => {
    const result = run('hoarding', { ...hoarding, mall: 'other' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors['mall.detail']).toBe('required');
  });

  it('rejects a mall that is not on the list', () => {
    const result = run('hoarding', { ...hoarding, mall: 'dubai-mall' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.mall).toBe('invalidOption');
  });
});

describe('validateRequest: Core & Shell', () => {
  it('accepts a complete request', () => {
    expect(run('core', core).success).toBe(true);
  });

  it('asks for screed depth only when deep slab removal is ticked', () => {
    const asked = run('core', { ...core, demolition: ['deepSlab'] });
    expect(asked.success).toBe(false);
    if (!asked.success) expect(asked.errors.screedDepth).toBe('chooseOption');

    const hidden = run('core', { ...core, screedDepth: ['ffl10'] });
    expect(hidden.success).toBe(true);
    if (hidden.success) expect(hidden.data.values).not.toHaveProperty('screedDepth');
  });

  it('sends F&B extras only for F&B units', () => {
    const retail = run('core', { ...core, fnbExtras: ['gas'] });
    if (retail.success) expect(retail.data.values).not.toHaveProperty('fnbExtras');

    const fnb = run('core', { ...core, unitType: ['fnb'], fnbExtras: ['gas'] });
    expect(fnb.success).toBe(true);
    if (fnb.success) expect(fnb.data.values.fnbExtras).toEqual(['gas']);
  });

  it('rejects an exclusive asset option combined with others', () => {
    const result = run('core', { ...core, assets: ['none', 'cctv'] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.assets).toBe('invalidOption');
  });

  it('rejects two choices in a choose-one field', () => {
    const result = run('core', { ...core, duration: ['d10', 'd15'] });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.duration).toBe('invalidOption');
  });

  it('requires the box next to "Other" payment', () => {
    const result = run('core', { ...core, payment: ['other'] }, { payment: '  ' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors['payment.detail']).toBe('required');
  });

  it('requires the confirmation tick', () => {
    const result = run('core', core, {}, false);
    expect(result.success).toBe(false);
    if (!result.success) expect(result.errors.confirm).toBe('confirm');
  });

  it('does not mutate its input', () => {
    const values = { ...core, payment: ['cash', 'cash'] };
    const snapshot = structuredClone(values);
    run('core', values);
    expect(values).toEqual(snapshot);
  });
});

describe('validateStep', () => {
  it('validates only the fields of one step', () => {
    const step = getPath('core').steps.find((s) => s.id === 'unit')!;
    const errors = validateStep(step, {}, {}, TODAY);
    expect(Object.keys(errors).sort()).toEqual(['assets', 'unitType']);
  });

  it('returns no errors when the step is complete', () => {
    const step = getPath('core').steps.find((s) => s.id === 'unit')!;
    expect(validateStep(step, { unitType: ['fnb'], assets: ['cctv'] }, {}, TODAY)).toEqual({});
  });
});

describe('validateFiles', () => {
  const pdf = { name: 'plan.pdf', size: 1024, type: 'application/pdf' };

  it('accepts images and PDFs under the limit', () => {
    expect(validateFiles([])).toBeNull();
    expect(validateFiles([pdf, { name: 'a.jpg', size: 2048, type: 'image/jpeg' }])).toBeNull();
  });

  it('rejects bad types, too many files and too many bytes', () => {
    expect(validateFiles([{ name: 'a.exe', size: 10, type: 'application/x-msdownload' }])).toBe('badType');
    expect(validateFiles(Array.from({ length: 7 }, () => pdf))).toBe('tooMany');
    expect(validateFiles([{ ...pdf, size: 3 * 1024 * 1024 }, { ...pdf, size: 3 * 1024 * 1024 }])).toBe('tooLarge');
  });
});
