import { test, expect } from '@playwright/test';

// ✅ Функция отправки сообщения в Telegram
async function sendTelegramMessage(message) {
  const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
  const TG_CHAT_ID = process.env.TG_CHAT_ID;

  await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text: message,
    }),
  });
}

// ✅ Ожидаемый заголовок страницы
const expectedTitle = 'Upscale — Prop Trading in Telegram • Capital up to $100 000';

// ✅ Тест стейдж-сервера
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

// ✅ Тест прод-сервера
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

