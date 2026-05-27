import { describe, expect, it } from "vitest";
import { seededBooks, seededLoanPeriods } from "./seed";

describe("seed books", () => {
  it("includes starter books across all loan categories", () => {
    const categories = new Set(seededBooks.map((book) => book.category));

    expect(seededBooks).toHaveLength(8);
    expect(categories).toEqual(new Set(["textbook", "general", "novel"]));
  });
});

describe("seed loan periods", () => {
  it("includes a default period for each category", () => {
    expect(seededLoanPeriods).toEqual([
      { category: "textbook", days: 3 },
      { category: "general", days: 7 },
      { category: "novel", days: 14 },
    ]);
  });
});
