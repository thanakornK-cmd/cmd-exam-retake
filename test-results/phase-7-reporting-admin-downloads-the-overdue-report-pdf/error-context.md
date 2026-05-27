# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase-7-reporting.spec.ts >> admin downloads the overdue report pdf
- Location: tests/e2e/phase-7-reporting.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForEvent: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for event "download"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e2]: "{\"error\":\"Unauthorized\"}"
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("admin downloads the overdue report pdf", async ({ page }) => {
  4  |   await page.goto("/admin/login");
  5  |   await page.getByLabel("Username").fill(process.env.LIBRARIAN_USERNAME ?? "admin");
  6  |   await page.getByLabel("Password").fill(process.env.LIBRARIAN_PASSWORD ?? "securepassword");
  7  |   await page.getByRole("button", { name: "Admin log in" }).click();
  8  | 
  9  |   await page.goto("/admin/reports");
  10 | 
  11 |   const [download] = await Promise.all([
> 12 |     page.waitForEvent("download"),
     |          ^ Error: page.waitForEvent: Test timeout of 30000ms exceeded.
  13 |     page.getByRole("link", { name: /download overdue report/i }).click(),
  14 |   ]);
  15 | 
  16 |   expect(download.suggestedFilename()).toMatch(/overdue/i);
  17 | });
  18 | 
```