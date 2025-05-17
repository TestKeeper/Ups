const { test, expect } = require('@playwright/test');
const fetch = require('node-fetch');

const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

const sendTelegramMessage = async (message) => {
  await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: message,
    }),
  });
};

const expectedTitle = 'Upscale — Prop Trading in Telegram • Capital up to $100 000';

test('Test on Site A', async ({ page }) => {
  try {
    await page.goto('https://app.upscale.stormtrade.dev/sign-in');
    await expect(page).toHaveTitle(expectedTitle);
    await sendTelegramMessage('✅ Стейдж сервер доступен!');
  } catch (e) {
    await sendTelegramMessage(`❌ СТейдж сервер упал: ${e.message}`);
    throw e;
  }
});

test('Test on Site B', async ({ page }) => {
  try {
    await page.goto('https://app.upscale.trade/sign-in');
    await expect(page).toHaveTitle(expectedTitle);
    await sendTelegramMessage('✅ Прод сервер доступен');
  } catch (e) {
    await sendTelegramMessage(`❌ Прод сервер упал: ${e.message}`);
    throw e;
  }
});
