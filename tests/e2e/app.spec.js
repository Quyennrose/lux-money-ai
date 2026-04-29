const { test, expect } = require("@playwright/test");

test("dashboard shell loads and core navigation is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Lux Money AI/);
  await expect(page.getByText("Lux Money AI").first()).toBeVisible();
  await expect(page.getByText("Tổng quan").first()).toBeVisible();
  await expect(page.getByText("Giao dịch").first()).toBeVisible();
  await expect(page.getByText("AI").first()).toBeVisible();
});

test("AI assistant accepts a question", async ({ page }) => {
  await page.goto("/");
  await page.locator('.tab-button[data-tab="ai"]').click();
  const input = page.locator("#chat-input");
  const send = page.locator("#chat-send");
  await expect(input).toBeVisible();
  await input.fill("Tháng này tôi chi nhiều nhất ở đâu?");
  await send.click();
  await expect(page.locator("#chat-messages")).toContainText(/chi|thu|dữ liệu|ngân sách/i, {
    timeout: 15000
  });
});
