import { expect, test } from "@playwright/test";

test("admin creates a book and member sees it in the catalog", async ({ page }) => {
  const uniqueId = Date.now();
  const bookTitle = `Distributed Systems ${uniqueId}`;
  const memberEmail = `reader-${uniqueId}@example.com`;

  await page.goto("/admin/login");
  await page.getByLabel("Username").fill(process.env.LIBRARIAN_USERNAME ?? "admin");
  await page.getByLabel("Password").fill(process.env.LIBRARIAN_PASSWORD ?? "securepassword");
  await page.getByRole("button", { name: "Admin log in" }).click();
  await expect(page).toHaveURL(/\/admin\/dashboard$/);

  await page.goto("/admin/books");
  await page.getByLabel("Title").fill(bookTitle);
  await page.getByLabel("Author").fill("Tanenbaum");
  await page.getByLabel("Category").selectOption("textbook");
  await page.getByLabel("Total copies").fill("4");
  await page.getByRole("button", { name: "Add book" }).click();
  await expect(page.getByRole("status")).toHaveText("Book added");

  await page.goto("/signup");
  await page.getByLabel("Name").fill("Reader");
  await page.getByLabel("Email").fill(memberEmail);
  await page.getByLabel("Phone").fill("0123456789");
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel("Email").fill(memberEmail);
  await page.getByLabel("Password").fill("secret123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/catalog$/);

  await expect(page.getByText(bookTitle)).toBeVisible();
  await expect(page.getByText("Tanenbaum")).toBeVisible();
});
