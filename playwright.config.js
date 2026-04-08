// Optional browser-level tests. Requires Node.js and Playwright browsers.
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  timeout: 30000,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:5000",
    trace: "retain-on-failure"
  }
});
