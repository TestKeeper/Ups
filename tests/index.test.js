import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

async function sendTelegramMessage(message) {
  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;

  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    console.error('❌ TG_BOT_TOKEN или TG_CHAT_ID не заданы!');
    return;
  }

  await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: message,
    }),
  });
}

const expectedTitle = 'Upscale — Prop Trading in Telegram • Capital up to $100 000';

test('Test on Site A', async ({ page }) => {
  try {
    await page.goto('https://app.upscale.stormtrade.de/sign-in');
    await expect(page).toHaveTitle(expectedTitle);
    await sendTelegramMessage('✅ Стейдж сервер доступен!');
  } catch (e) {
    await sendTelegramMessage(`❌ Стейдж сервер упал: ${e.message}`);
    throw e;
  }
});

test('Test on Site B', async ({ page }) => {
  try {
    await page.goto('https://app.upscale.trad/sign-in');
    await expect(page).toHaveTitle(expectedTitle);
    await sendTelegramMessage('✅ Прод сервер доступен!');
  } catch (e) {
    await sendTelegramMessage(`❌ Прод сервер упал: ${e.message}`);
    throw e;
  }
});




