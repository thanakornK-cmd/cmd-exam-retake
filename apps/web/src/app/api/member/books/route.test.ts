import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  book: {
    findMany: vi.fn(),
  },
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

import { GET } from "./route";

describe("GET /api/member/books", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns books for the catalog", async () => {
    prismaMock.book.findMany.mockResolvedValue([
      {
        id: "book_1",
        title: "Distributed Systems",
        author: "Tanenbaum",
        category: "textbook",
        totalCopies: 4,
        availableCopies: 4,
      },
    ]);

    const response = await GET(new Request("http://localhost/api/member/books"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual([
      {
        id: "book_1",
        title: "Distributed Systems",
        author: "Tanenbaum",
        category: "textbook",
        totalCopies: 4,
        availableCopies: 4,
      },
    ]);
  });
});
