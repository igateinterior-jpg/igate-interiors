import { expect, test } from '@playwright/test';

test('the spam trap field is hidden from screen readers and keyboard users', async ({ page }) => {
  await page.goto('/en');
  const trap = page.locator('input[name="website"]');

  await expect(trap).toHaveAttribute('aria-hidden', 'true');
  await expect(trap).toHaveAttribute('tabindex', '-1');
  await expect(trap).toHaveAttribute('autocomplete', 'off');

  // Not exposed in the accessibility tree.
  expect(await page.locator('#request form').ariaSnapshot()).not.toContain('Website');

  // Tabbing through the whole first form step never lands on it.
  await page.locator('#request form button').first().focus();
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('name'))).not.toBe('website');
  }
});
