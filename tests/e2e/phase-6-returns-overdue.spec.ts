import { expect, test } from "@playwright/test";

test("admin returns an overdue loan and sees the fine", async ({ page }) => {
  const uniqueId = Date.now();
  const bookTitle = `Overdue Book ${uniqueId}`;
  const memberEmail = `overdue-${uniqueId}@example.com`;

  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(process.env.LIBRARIAN_USERNAME ?? "admin");
  await page.getByLabel("Password").fill(process.env.LIBRARIAN_PASSWORD ?? "securepassword");
  await page.getByRole("button", { name: "Admin log in" }).click();

  await page.goto("/admin/books");
  await page.getByLabel("Title").fill(bookTitle);
  await page.getByLabel("Author").fill("Tanenbaum");
  await page.getByLabel("Category").selectOption("textbook");
  await page.getByLabel("Total copies").fill("1");
  await page.getByRole("button", { name: "Add book" }).click();

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Overdue Reader");
  await page.getByLabel("Email").fill(memberEmail);
  await page.getByLabel("Phone").fill("0123456789");
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: "Create account" }).click();

  await page.getByLabel("Email").fill(memberEmail);
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: "Log in" }).click();

  await page.goto("/catalog");
  await page.getByRole("button", { name: "Borrow" }).first().click();

  await page.goto("/admin/loans");
  await page.getByLabel("Due date").first().fill("2020-01-01T00:00");
  await page.getByRole("button", { name: "Save loan" }).first().click();

  await page.goto("/admin/overdue");
  await expect(page.getByText(bookTitle)).toBeVisible();

  await page.goto("/admin/loans");
  await page.getByRole("button", { name: "Return" }).first().click();
  await expect(page.getByText(/Loan returned/i)).toBeVisible();
});
