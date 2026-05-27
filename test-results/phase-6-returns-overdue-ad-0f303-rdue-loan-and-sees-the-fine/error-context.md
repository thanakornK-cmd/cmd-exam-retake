# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase-6-returns-overdue.spec.ts >> admin returns an overdue loan and sees the fine
- Location: tests/e2e/phase-6-returns-overdue.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Log in' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - paragraph [ref=e5]: Private library access
        - heading "Join the lending system" [level=1] [ref=e6]
        - paragraph [ref=e7]: Sign up once, borrow books, and keep track of active loans and history in a clean member dashboard.
      - region "Signup form" [ref=e9]:
        - generic [ref=e10]:
          - generic [ref=e11]:
            - paragraph [ref=e12]: Member access
            - heading "Create your account" [level=2] [ref=e13]
            - paragraph [ref=e14]: Join the library, borrow books, and track your loans in one place.
          - generic [ref=e15]:
            - generic [ref=e16]: Name
            - textbox "Name" [ref=e17]:
              - /placeholder: Your name
              - text: Overdue Reader
          - generic [ref=e18]:
            - generic [ref=e19]: Email
            - textbox "Email" [ref=e20]:
              - /placeholder: you@example.com
              - text: overdue-1779886908861@example.com
          - generic [ref=e21]:
            - generic [ref=e22]: Phone
            - textbox "Phone" [ref=e23]:
              - /placeholder: "0900000000"
              - text: "0123456789"
          - generic [ref=e24]:
            - generic [ref=e25]: Password
            - textbox "Password Use at least 8 characters." [active] [ref=e26]:
              - /placeholder: ••••••••
              - text: secret123
            - generic [ref=e27]: Use at least 8 characters.
          - alert [ref=e28]: Database is temporarily unavailable
          - button "Create account" [ref=e29] [cursor=pointer]
  - button "Open Next.js Dev Tools" [ref=e35] [cursor=pointer]:
    - img [ref=e36]
  - alert [ref=e39]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("admin returns an overdue loan and sees the fine", async ({ page }) => {
  4  |   const uniqueId = Date.now();
  5  |   const bookTitle = `Overdue Book ${uniqueId}`;
  6  |   const memberEmail = `overdue-${uniqueId}@example.com`;
  7  | 
  8  |   await page.goto("/admin/login");
  9  |   await page.getByLabel("Username").fill(process.env.LIBRARIAN_USERNAME ?? "admin");
  10 |   await page.getByLabel("Password").fill(process.env.LIBRARIAN_PASSWORD ?? "securepassword");
  11 |   await page.getByRole("button", { name: "Admin log in" }).click();
  12 | 
  13 |   await page.goto("/admin/books");
  14 |   await page.getByLabel("Title").fill(bookTitle);
  15 |   await page.getByLabel("Author").fill("Tanenbaum");
  16 |   await page.getByLabel("Category").selectOption("textbook");
  17 |   await page.getByLabel("Total copies").fill("1");
  18 |   await page.getByRole("button", { name: "Add book" }).click();
  19 | 
  20 |   await page.goto("/signup");
  21 |   await page.getByLabel("Name").fill("Overdue Reader");
  22 |   await page.getByLabel("Email").fill(memberEmail);
  23 |   await page.getByLabel("Phone").fill("0123456789");
  24 |   await page.getByLabel("Password").fill("secret123");
  25 |   await page.getByRole("button", { name: "Create account" }).click();
  26 | 
  27 |   await page.getByLabel("Email").fill(memberEmail);
  28 |   await page.getByLabel("Password").fill("secret123");
> 29 |   await page.getByRole("button", { name: "Log in" }).click();
     |                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  30 | 
  31 |   await page.goto("/catalog");
  32 |   await page.getByRole("button", { name: "Borrow" }).first().click();
  33 | 
  34 |   await page.goto("/admin/loans");
  35 |   await page.getByLabel("Due date").first().fill("2020-01-01T00:00");
  36 |   await page.getByRole("button", { name: "Save loan" }).first().click();
  37 | 
  38 |   await page.goto("/admin/overdue");
  39 |   await expect(page.getByText(bookTitle)).toBeVisible();
  40 | 
  41 |   await page.goto("/admin/loans");
  42 |   await page.getByRole("button", { name: "Return" }).first().click();
  43 |   await expect(page.getByText(/Loan returned/i)).toBeVisible();
  44 | });
  45 | 
```