const { test, expect } = require('@playwright/test');

test('Test on Site A', async ({ page }) => {
  await page.goto('https://app.upscale.stormtrade.dev/sign-in');
  await expect(page).toHaveTitle(/Upscale — Prop Trading in Telegram • Capital up to $100 000/);
});

test('Test on Site B', async ({ page }) => {
  await page.goto('https://app.upscale.trade/sign-in');
  await expect(page).toHaveTitle(/Upscale — Prop Trading in Telegram • Capital up to $100 000/);
});
