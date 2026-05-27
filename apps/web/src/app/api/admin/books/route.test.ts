import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  book: {
    create: vi.fn(),
  },
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

import { POST } from "./route";

describe("POST /api/admin/books", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("sets available copies equal to total copies", async () => {
    prismaMock.book.create.mockResolvedValue({
      id: "book_1",
      title: "Distributed Systems",
      author: "Tanenbaum",
      category: "textbook",
      totalCopies: 4,
      availableCopies: 4,
    });

    const response = await POST(
      new Request("http://localhost/api/admin/books", {
        method: "POST",
        body: JSON.stringify({
          title: "Distributed Systems",
          author: "Tanenbaum",
          category: "textbook",
          totalCopies: 4,
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(prismaMock.book.create).toHaveBeenCalledWith({
      data: {
        title: "Distributed Systems",
        author: "Tanenbaum",
        category: "textbook",
        totalCopies: 4,
        availableCopies: 4,
      },
    });
  });
});
