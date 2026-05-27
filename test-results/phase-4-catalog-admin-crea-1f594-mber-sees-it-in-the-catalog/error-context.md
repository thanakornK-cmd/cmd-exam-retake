# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase-4-catalog.spec.ts >> admin creates a book and member sees it in the catalog
- Location: tests/e2e/phase-4-catalog.spec.ts:3:5

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/admin\/dashboard$/
Received string:  "http://127.0.0.1:3000/admin/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    13 × unexpected value "http://127.0.0.1:3000/admin/login"

```

```yaml
- main:
  - paragraph: Admin access
  - heading "Librarian sign in" [level=1]
  - paragraph: Use the environment-backed admin account to manage books, loans, overdue items, and reports.
  - text: Username
  - textbox "Username":
    - /placeholder: admin
    - text: admin
  - text: Password
  - textbox "Password":
    - /placeholder: ••••••••
    - text: securepassword
  - alert: Invalid credentials
  - button "Admin log in"
- alert
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("admin creates a book and member sees it in the catalog", async ({ page }) => {
  4  |   const uniqueId = Date.now();
  5  |   const bookTitle = `Distributed Systems ${uniqueId}`;
  6  |   const memberEmail = `reader-${uniqueId}@example.com`;
  7  | 
  8  |   await page.goto("/admin/login");
  9  |   await page.getByLabel("Username").fill(process.env.LIBRARIAN_USERNAME ?? "admin");
  10 |   await page.getByLabel("Password").fill(process.env.LIBRARIAN_PASSWORD ?? "securepassword");
  11 |   await page.getByRole("button", { name: "Admin log in" }).click();
> 12 |   await expect(page).toHaveURL(/\/admin\/dashboard$/);
     |                      ^ Error: expect(page).toHaveURL(expected) failed
  13 | 
  14 |   await page.goto("/admin/books");
  15 |   await page.getByLabel("Title").fill(bookTitle);
  16 |   await page.getByLabel("Author").fill("Tanenbaum");
  17 |   await page.getByLabel("Category").selectOption("textbook");
  18 |   await page.getByLabel("Total copies").fill("4");
  19 |   await page.getByRole("button", { name: "Add book" }).click();
  20 |   await expect(page.getByRole("status")).toHaveText("Book added");
  21 | 
  22 |   await page.goto("/signup");
  23 |   await page.getByLabel("Name").fill("Reader");
  24 |   await page.getByLabel("Email").fill(memberEmail);
  25 |   await page.getByLabel("Phone").fill("0123456789");
  26 |   await page.getByLabel("Password").fill("secret123");
  27 |   await page.getByRole("button", { name: "Create account" }).click();
  28 |   await expect(page).toHaveURL(/\/login$/);
  29 | 
  30 |   await page.getByLabel("Email").fill(memberEmail);
  31 |   await page.getByLabel("Password").fill("secret123");
  32 |   await page.getByRole("button", { name: "Log in" }).click();
  33 |   await expect(page).toHaveURL(/\/catalog$/);
  34 | 
  35 |   await expect(page.getByText(bookTitle)).toBeVisible();
  36 |   await expect(page.getByText("Tanenbaum")).toBeVisible();
  37 | });
  38 | 
```