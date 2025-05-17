// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests', // путь к директории с тестами
  use: {
    headless: true, // запускаем браузер в headless режиме
  },
};

module.exports = config;
