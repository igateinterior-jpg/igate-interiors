import { expect, test, type Page } from '@playwright/test';

const door = (page: Page) => page.getByRole('button', { name: 'Enter the site' });
const hoarding = (page: Page) => page.locator('header[data-door]');

test.beforeEach(async ({ page }) => {
  await page.goto('/en');
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
  await expect(hoarding(page)).toHaveAttribute('data-door', 'closed');
});

test('door opens with a click and lands behind the hoarding', async ({ page }) => {
  await door(page).click();

  await expect(hoarding(page)).toHaveAttribute('data-door', 'open');
  await expect(page.locator('#behind')).toBeFocused();
  await expect(page.getByRole('heading', { name: 'Behind the hoarding' })).toBeInViewport();

  // Remembered for the visit: going back does not replay it.
  await page.reload();
  await expect(hoarding(page)).toHaveAttribute('data-door', 'open');
});

for (const key of ['Enter', 'Space']) {
  test(`door opens with the keyboard (${key})`, async ({ page }) => {
    await door(page).focus();
    await page.keyboard.press(key);

    await expect(hoarding(page)).toHaveAttribute('data-door', 'open');
    await expect(page.locator('#behind')).toBeFocused();
    await expect(page.getByRole('heading', { name: 'Behind the hoarding' })).toBeInViewport();
  });
}
