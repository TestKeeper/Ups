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
    await page.goto('https://app.upscale.stormtrade.dev/sign-in');
    await expect(page).toHaveTitle(expectedTitle);
    await sendTelegramMessage('✅ Стейдж сервер доступен!');
  } catch (e) {
    await sendTelegramMessage(`❌ Стейдж сервер упал: ${e.message}`);
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

test('Debug link test: Telegram button and redirect check', async ({ page }) => {
  try {
    // Получаем refreshToken
    const response = await fetch('https://api.upscale.stormtrade.dev/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'mrzcheck_1' }),
    });

    if (!response.ok) throw new Error(`Ошибка получения токена: ${response.status}`);
    const data = await response.json();
    const refreshToken = data.refreshToken;
    if (!refreshToken) throw new Error('Не получен refreshToken из ответа');

    // Заходим по debug-ссылке
    const debugUrl = `https://app.upscale.stormtrade.dev/debug/${refreshToken}`;
    await page.goto(debugUrl);

    // Ждём iframe с кнопкой Telegram
    const telegramFrame = page.frameLocator('iframe[src*="telegram.org/embed/upscale_stage_bot"]');
    const telegramButton = telegramFrame.locator('button.tgme_widget_login_button');

    await telegramButton.waitFor({ timeout: 10000 });
    await telegramButton.click();

    // Ждём редирект на /accounts/**
    await page.waitForURL('**/accounts/**', { timeout: 15000 });
    expect(page.url()).toContain('/accounts');

    await sendTelegramMessage('✅ Telegram-кнопка нажата и редирект на /accounts выполнен');
  } catch (e) {
    await sendTelegramMessage(`❌ Ошибка в debug-проверке: ${e.message}`);
    throw e;
  }
});


