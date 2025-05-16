const { test, expect } = require('@playwright/test');

test('basic test', async ({ page }) => {
  await page.goto('https://app.upscale.stormtrade.dev/sign-in');
  await page.waitForLoadState('domcontentloaded');

  const title = await page.title();
  console.log('TITLE:', title);

  await expect(page).toHaveTitle('Upscale — Prop Trading in Telegram • Capital up to $100 000');
});
