import { expect, test, type Page } from '@playwright/test';

const REFERENCE = 'IG-REQ-201126-1342-K7';

/** Reads multipart form fields from the intercepted request body. */
const parseMultipart = (body: string): Record<string, string[]> =>
  [...body.matchAll(/name="([^"]+)"(?:; filename="[^"]*")?\r\n(?:Content-Type: [^\r]+\r\n)?\r\n([^\r]*)/g)].reduce<
    Record<string, string[]>
  >((acc, [, name, value]) => ({ ...acc, [name]: [...(acc[name] ?? []), value] }), {});

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();
const radio = (page: Page, name: string) => page.getByRole('radio', { name, exact: true }).click();
const checkbox = (page: Page, name: string) => page.getByRole('checkbox', { name, exact: true }).click();
const stepHeading = (page: Page, name: string) => expect(page.locator('#request h3')).toHaveText(name);

test('a complete Core & Shell request is sent with only its own answers', async ({ page }) => {
  let sent: Record<string, string[]> = {};
  await page.route('**/api/project-request', async (route) => {
    sent = parseMultipart(route.request().postDataBuffer()?.toString('utf8') ?? '');
    await route.fulfill({ json: { success: true, reference: REFERENCE } });
  });

  await page.goto('/en');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await page.getByRole('link', { name: /Skip to/ }).click();

  // Step 1: choose the path.
  await page.getByRole('button', { name: /Core & Shell restoration/ }).click();
  await expect(page.getByText('Step 2 of 8')).toBeVisible();

  // Project details.
  await stepHeading(page, 'Project details');
  await page.locator('#field-company').fill('Alshaya Retail');
  await page.locator('#field-brand').fill('Cafe Nero');
  await page.locator('#field-mall').selectOption('avenues');
  await page.locator('#field-shop').fill('G-114, ground floor');
  await page.locator('#field-manager').fill('Sara Ahmed');
  await page.locator('#field-phone').fill('+965 9723 4117');
  await page.locator('#field-representative').fill('Omar Ali');
  await next(page);

  // Unit: Next is blocked until required choices are made.
  await stepHeading(page, 'Unit');
  await next(page);
  await expect(page.getByText('Choose at least one option.').first()).toBeVisible();
  await stepHeading(page, 'Unit');
  await radio(page, 'F&B (restaurant / cafe / heavy cooking)');
  await checkbox(page, 'CCTV removal and packing');
  await checkbox(page, 'None');
  await expect(page.getByRole('checkbox', { name: 'CCTV removal and packing' })).not.toBeChecked();
  await next(page);

  // Civil: screed depth only appears once deep slab removal is ticked.
  await stepHeading(page, 'Civil and structural');
  await expect(page.getByRole('radio', { name: 'FFL 12 cm below mall' })).toHaveCount(0);
  await checkbox(page, 'Deep slab removal back to structural slab level');
  await radio(page, 'FFL 12 cm below mall');
  await next(page);

  // MEP: F&B extras appear because the unit is F&B.
  await stepHeading(page, 'MEP');
  await checkbox(page, 'HVAC: isolate chilled water lines and cap at lease line boundary');
  await checkbox(page, 'Gas line disconnection and capping by a certified party');
  await radio(page, 'Leave existing disconnected network safely capped at ceiling level');
  await next(page);

  // Timing and site.
  await stepHeading(page, 'Timing and site');
  await radio(page, 'Night works only');
  await radio(page, '15 days');
  await radio(page, 'Contractor (iGATE to supply and install)');
  await radio(page, 'No (requires a preliminary site survey to verify levels)');
  await next(page);

  // Payment, with "Other" needing its box filled.
  await stepHeading(page, 'Payment');
  await checkbox(page, 'Cash');
  await checkbox(page, 'Other');
  await page.locator('#field-payment-detail').fill('Split 50/50');
  await next(page);

  // Review and send.
  await stepHeading(page, 'Review your request');
  await expect(page.getByText('Step 8 of 8')).toBeVisible();
  await page.getByRole('checkbox', { name: /I confirm the details above are correct/ }).check();
  await page.getByRole('button', { name: 'Send request' }).click();

  await expect(page.getByRole('status')).toHaveText('Thank you. We have your request and will contact you within 24 hours.');
  await expect(page.getByText(REFERENCE, { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'WhatsApp us' }).last()).toHaveAttribute(
    'href',
    `https://wa.me/96597234117?text=${encodeURIComponent(`Hi, my request reference is ${REFERENCE}`)}`,
  );

  expect(sent.path).toEqual(['core']);
  expect(sent.confirm).toEqual(['yes']);
  expect(sent['f.phone']).toEqual(['97234117']);
  expect(sent['f.assets']).toEqual(['none']);
  expect(sent['f.screedDepth']).toEqual(['ffl12']);
  expect(sent['f.fnbExtras']).toEqual(['gas']);
  expect(sent['f.payment']).toEqual(['cash', 'other']);
  expect(sent['d.payment']).toEqual(['Split 50/50']);

  const answered = Object.keys(sent).filter((k) => k.startsWith('f.')).map((k) => k.slice(2)).sort();
  expect(answered).toEqual(
    [
      'assets', 'brand', 'company', 'demolition', 'drawings', 'duration', 'fnbExtras', 'hoarding', 'mall',
      'manager', 'mep', 'mepExtent', 'payment', 'phone', 'representative', 'screedDepth', 'shop', 'unitType',
      'workingHours',
    ].sort(),
  );

  // The saved draft is removed once the request is sent.
  expect(await page.evaluate(() => localStorage.getItem('igate-request-draft'))).toBeNull();
});
