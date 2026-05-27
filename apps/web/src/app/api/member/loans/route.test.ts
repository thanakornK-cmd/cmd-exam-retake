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
  loanPeriodSetting: {
    findMany: vi.fn().mockResolvedValue([]),
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
    prismaMock.loanPeriodSetting.findMany.mockResolvedValue([]);
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
      category: "science",
      availableCopies: 2,
    });
    prismaMock.loanPeriodSetting.findMany.mockResolvedValue([
      { category: "textbook", days: 3 },
      { category: "general", days: 7 },
      { category: "science", days: 21 },
    ]);

    const loanCreateMock = vi.fn().mockResolvedValue({
      id: "loan_1",
      loanCode: "LN-20260527-0002",
      dueDate: new Date("2026-06-17T00:00:00.000Z"),
    });

    prismaMock.$transaction.mockImplementation(async (callback) =>
      callback({
        loan: {
          create: loanCreateMock,
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
    expect(loanCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          dueDate: expect.any(Date),
        }),
      }),
    );
    expect(
      loanCreateMock.mock.calls[0]?.[0]?.data?.dueDate?.toISOString().slice(0, 10),
    ).toBe("2026-06-17");
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
