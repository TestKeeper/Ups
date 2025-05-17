import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config(); // загружаем .env переменные

async function sendTelegramMessage(message: string) {
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

// ✅ Первый тест — стейдж
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

// ✅ Второй тест — прод
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

// ✅ Тест нажатия на Telegram кнопку и проверка авторизации
test('Telegram login button opens auth page', async ({ page, context }) => {
  try {
    await page.goto('https://app.upscale.stormtrade.dev/sign-in');

    // Ожидаем iframe
    const frameLocator = page.frameLocator('iframe[src*="telegram.org/embed/upscale_stage_bot"]');
    const telegramButton = frameLocator.locator('button.tgme_widget_login_button');

    await telegramButton.waitFor({ state: 'visible', timeout: 10000 });

    // Ждём открытия новой вкладки после клика
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      telegramButton.click()
    ]);

    await newPage.waitForLoadState('load');

    // Проверяем URL
    const newUrl = newPage.url();
    expect(newUrl).toContain('https://oauth.telegram.org/auth?bot_id=7764719532');

    await sendTelegramMessage('✅ Кнопка Telegram работает и открывает окно авторизации!');
  } catch (e) {
    await sendTelegramMessage(`❌ Ошибка при переходе на Telegram авторизацию: ${e.message}`);
    throw e;
  }
});

