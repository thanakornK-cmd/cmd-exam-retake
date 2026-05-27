import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  book: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../../../../lib/auth/guards", () => ({
  requireAdminSession: vi.fn(),
}));

import { GET, POST } from "./route";

describe("GET /api/admin/books", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns books in newest-first order", async () => {
    const { requireAdminSession } = await import("../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.book.findMany.mockResolvedValue([
      { id: "book_2", title: "B", createdAt: new Date("2026-05-02T00:00:00Z") },
      { id: "book_1", title: "A", createdAt: new Date("2026-05-01T00:00:00Z") },
    ]);

    const response = await GET(new Request("http://localhost/api/admin/books"));

    expect(response.status).toBe(200);
    expect(prismaMock.book.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });
});

describe("POST /api/admin/books", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("sets available copies equal to total copies", async () => {
    const { requireAdminSession } = await import("../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.book.create.mockResolvedValue({
      id: "book_1",
      title: "Distributed Systems",
      author: "Tanenbaum",
      category: "science",
      totalCopies: 4,
      availableCopies: 4,
    });

    const response = await POST(
      new Request("http://localhost/api/admin/books", {
        method: "POST",
        body: JSON.stringify({
          title: "Distributed Systems",
          author: "Tanenbaum",
          category: "science",
          totalCopies: 4,
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(prismaMock.book.create).toHaveBeenCalledWith({
      data: {
        title: "Distributed Systems",
        author: "Tanenbaum",
        category: "science",
        totalCopies: 4,
        availableCopies: 4,
      },
    });
  });
});
