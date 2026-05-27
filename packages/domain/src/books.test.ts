import { describe, expect, it } from "vitest";
import { createBookSchema, initializeBookInventory } from "./books";

describe("book rules", () => {
  it("rejects unknown categories", () => {
    const result = createBookSchema.safeParse({
      title: "Distributed Systems",
      author: "Tanenbaum",
      category: "science",
      totalCopies: 4,
    });

    expect(result.success).toBe(false);
  });

  it("initializes available copies from total copies", () => {
    expect(
      initializeBookInventory({
        title: "Distributed Systems",
        author: "Tanenbaum",
        category: "textbook",
        totalCopies: 4,
      }),
    ).toEqual({
      title: "Distributed Systems",
      author: "Tanenbaum",
      category: "textbook",
      totalCopies: 4,
      availableCopies: 4,
    });
  });
});
