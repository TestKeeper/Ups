import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config(); // загружаем .env переменные

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
    const refreshToken = process.env.REFRESH_TOKEN;
    if (!refreshToken) throw new Error('REFRESH_TOKEN не указан в .env');

    const debugUrl = `https://app.upscale.stormtrade.dev/debug/${refreshToken}`;
    await page.goto(debugUrl);

    // Ждём появления iframe с Telegram
    const telegramFrame = page.frameLocator('iframe[src*="telegram.org/embed/upscale_stage_bot"]');
    const telegramButton = telegramFrame.locator('button.tgme_widget_login_button');
    await telegramButton.waitFor({ timeout: 10000 });

    // Клик и отслеживание popup окна
    const [popup] = await Promise.all([
      page.context().waitForEvent('page'),
      telegramButton.click()
    ]);

    await popup.waitForLoadState('load');

    const finalUrl = popup.url();
    if (!finalUrl.startsWith('https://app.upscale.stormtrade.dev/accounts')) {
      throw new Error(`Ожидался переход на /accounts, но был: ${finalUrl}`);
    }

    await sendTelegramMessage(`✅ Telegram-кнопка работает, переход на ${finalUrl}`);
  } catch (e) {
    await sendTelegramMessage(`❌ Ошибка в debug-тесте: ${e.message}`);
    throw e;
  }
});

