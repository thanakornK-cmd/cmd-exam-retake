import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  loan: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  book: {
    update: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../../../../../../lib/auth/guards", () => ({
  requireAdminSession: vi.fn(),
}));

import { POST } from "./route";

describe("POST /api/admin/loans/:id/return", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("charges 20 THB when Friday due date is returned Monday", async () => {
    const { requireAdminSession } = await import("../../../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.loan.findUnique.mockResolvedValue({
      id: "loan_1",
      bookId: "book_1",
      dueDate: new Date("2026-05-22T00:00:00.000Z"),
    });
    prismaMock.$transaction.mockImplementation(async (callback) =>
      callback({
        loan: {
          update: vi.fn().mockResolvedValue({
            id: "loan_1",
            fineAmount: 20,
          }),
        },
        book: {
          update: vi.fn().mockResolvedValue({}),
        },
      }),
    );

    const response = await POST(
      new Request("http://localhost/api/admin/loans/loan_1/return", {
        method: "POST",
        body: JSON.stringify({ returnDate: "2026-05-25T00:00:00.000Z" }),
      }),
      { params: Promise.resolve({ id: "loan_1" }) },
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.fineAmount).toBe(20);
  });
});
