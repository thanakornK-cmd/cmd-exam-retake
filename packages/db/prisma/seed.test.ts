import { describe, expect, it } from "vitest";
import { seededBooks } from "./seed";

describe("seed books", () => {
  it("includes starter books across all loan categories", () => {
    const categories = new Set(seededBooks.map((book) => book.category));

    expect(seededBooks).toHaveLength(8);
    expect(categories).toEqual(new Set(["textbook", "general", "novel"]));
  });
});
