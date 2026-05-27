import { expect, test } from "@playwright/test";

test("admin downloads the overdue report pdf", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(process.env.LIBRARIAN_USERNAME ?? "admin");
  await page.getByLabel("Password").fill(process.env.LIBRARIAN_PASSWORD ?? "securepassword");
  await page.getByRole("button", { name: "Admin log in" }).click();

  await page.goto("/admin/reports");

  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: /download overdue report/i }).click(),
  ]);

  expect(download.suggestedFilename()).toMatch(/overdue/i);
});
