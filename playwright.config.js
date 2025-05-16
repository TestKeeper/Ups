// playwright.config.js
/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  use: {
    headless: false,  // чтобы браузер был виден
  },
};
module.exports = config;
