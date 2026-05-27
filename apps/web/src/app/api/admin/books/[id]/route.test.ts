import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  book: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../../../../../lib/auth/guards", () => ({
  requireAdminSession: vi.fn(),
}));

import { PUT } from "./route";

describe("PUT /api/admin/books/:id", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("updates book details and keeps borrowed copies intact", async () => {
    const { requireAdminSession } = await import("../../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.book.findUnique.mockResolvedValue({
      id: "book_1",
      totalCopies: 5,
      availableCopies: 2,
    });
    prismaMock.book.update.mockResolvedValue({
      id: "book_1",
      title: "Distributed Systems",
      author: "Tanenbaum",
      category: "science",
      totalCopies: 6,
      availableCopies: 3,
    });

    const response = await PUT(
      new Request("http://localhost/api/admin/books/book_1", {
        method: "PUT",
        body: JSON.stringify({
          title: "Distributed Systems",
          author: "Tanenbaum",
          category: "science",
          totalCopies: 6,
        }),
      }),
      { params: Promise.resolve({ id: "book_1" }) },
    );

    expect(response.status).toBe(200);
    expect(prismaMock.book.update).toHaveBeenCalledWith({
      where: { id: "book_1" },
      data: {
        title: "Distributed Systems",
        author: "Tanenbaum",
        category: "science",
        totalCopies: 6,
        availableCopies: 3,
      },
    });
  });
});
