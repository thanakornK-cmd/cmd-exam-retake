import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  loan: {
    count: vi.fn(),
    create: vi.fn(),
  },
  book: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../../../../lib/auth/guards", () => ({
  requireMemberSession: vi.fn(),
}));

import { POST } from "./route";

describe("POST /api/member/loans", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects borrowing when member already has 3 active loans", async () => {
    const { requireMemberSession } = await import("../../../../lib/auth/guards");
    requireMemberSession.mockResolvedValue({
      session: { sub: "member_1", role: "member" },
      response: null,
    });
    prismaMock.loan.count.mockResolvedValueOnce(3);
    prismaMock.loan.count.mockResolvedValueOnce(0);
    prismaMock.book.findUnique.mockResolvedValue({
      id: "book_1",
      category: "textbook",
      availableCopies: 4,
    });

    const response = await POST(
      new Request("http://localhost/api/member/loans", {
        method: "POST",
        body: JSON.stringify({ bookId: "book_1" }),
      }),
    );

    expect(response.status).toBe(409);
  });

  it("creates a loan and decrements inventory", async () => {
    const { requireMemberSession } = await import("../../../../lib/auth/guards");
    requireMemberSession.mockResolvedValue({
      session: { sub: "member_1", role: "member" },
      response: null,
    });
    prismaMock.loan.count.mockResolvedValueOnce(1);
    prismaMock.loan.count.mockResolvedValueOnce(0);
    prismaMock.book.findUnique.mockResolvedValue({
      id: "book_1",
      category: "novel",
      availableCopies: 2,
    });

    const createdLoan = {
      id: "loan_1",
      loanCode: "LN-20260527-0002",
      dueDate: new Date("2026-06-10T00:00:00.000Z"),
    };

    prismaMock.$transaction.mockImplementation(async (callback) =>
      callback({
        loan: {
          create: vi.fn().mockResolvedValue(createdLoan),
        },
        book: {
          update: vi.fn().mockResolvedValue({}),
        },
      }),
    );

    const response = await POST(
      new Request("http://localhost/api/member/loans", {
        method: "POST",
        body: JSON.stringify({ bookId: "book_1" }),
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.loanCode).toBe("LN-20260527-0002");
    expect(prismaMock.$transaction).toHaveBeenCalled();
  });

  it("rejects borrowing when the member has overdue loans", async () => {
    const { requireMemberSession } = await import("../../../../lib/auth/guards");
    requireMemberSession.mockResolvedValue({
      session: { sub: "member_1", role: "member" },
      response: null,
    });
    prismaMock.loan.count.mockResolvedValueOnce(1);
    prismaMock.loan.count.mockResolvedValueOnce(1);
    prismaMock.book.findUnique.mockResolvedValue({
      id: "book_1",
      category: "novel",
      availableCopies: 2,
    });

    const response = await POST(
      new Request("http://localhost/api/member/loans", {
        method: "POST",
        body: JSON.stringify({ bookId: "book_1" }),
      }),
    );

    expect(response.status).toBe(409);
  });

  it("rejects borrowing when no copies are available", async () => {
    const { requireMemberSession } = await import("../../../../lib/auth/guards");
    requireMemberSession.mockResolvedValue({
      session: { sub: "member_1", role: "member" },
      response: null,
    });
    prismaMock.loan.count.mockResolvedValueOnce(1);
    prismaMock.loan.count.mockResolvedValueOnce(0);
    prismaMock.book.findUnique.mockResolvedValue({
      id: "book_1",
      category: "novel",
      availableCopies: 0,
    });

    const response = await POST(
      new Request("http://localhost/api/member/loans", {
        method: "POST",
        body: JSON.stringify({ bookId: "book_1" }),
      }),
    );

    expect(response.status).toBe(409);
  });
});
