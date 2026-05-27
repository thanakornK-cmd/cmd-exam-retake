import { expect, test } from "@playwright/test";

test("member borrows a book and sees the due date", async ({ page }) => {
  const uniqueId = Date.now();
  const bookTitle = `Borrowable Book ${uniqueId}`;
  const memberEmail = `borrower-${uniqueId}@example.com`;

  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(process.env.LIBRARIAN_USERNAME ?? "admin");
  await page.getByLabel("Password").fill(process.env.LIBRARIAN_PASSWORD ?? "securepassword");
  await page.getByRole("button", { name: "Admin log in" }).click();

  await page.goto("/admin/books");
  await page.getByLabel("Title").fill(bookTitle);
  await page.getByLabel("Author").fill("Tanenbaum");
  await page.getByLabel("Category").selectOption("novel");
  await page.getByLabel("Total copies").fill("2");
  await page.getByRole("button", { name: "Add book" }).click();

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Borrower");
  await page.getByLabel("Email").fill(memberEmail);
  await page.getByLabel("Phone").fill("0123456789");
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.getByLabel("Email").fill(memberEmail);
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.goto("/catalog");
  await page.getByRole("button", { name: "Borrow" }).first().click();

  await page.goto("/loans");
  await expect(page.getByText(bookTitle)).toBeVisible();
  await expect(page.getByText(/due date/i)).toBeVisible();
});
