import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  loan: {
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

import { PATCH } from "./route";

describe("PATCH /api/admin/loans/:id", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("allows admin to update loan date, due date, and return date", async () => {
    const { requireAdminSession } = await import("../../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.loan.findUnique.mockResolvedValue({
      id: "loan_1",
      dueDate: new Date("2026-05-23T00:00:00.000Z"),
      returnDate: null,
      fineAmount: 0,
    });
    prismaMock.loan.update.mockResolvedValue({
      id: "loan_1",
      loanDate: new Date("2026-05-20T00:00:00.000Z"),
      dueDate: new Date("2026-05-23T00:00:00.000Z"),
      returnDate: new Date("2026-05-26T00:00:00.000Z"),
    });

    const response = await PATCH(
      new Request("http://localhost/api/admin/loans/loan_1", {
        method: "PATCH",
        body: JSON.stringify({
          loanDate: "2026-05-20T00:00:00.000Z",
          dueDate: "2026-05-23T00:00:00.000Z",
          returnDate: "2026-05-26T00:00:00.000Z",
        }),
      }),
      { params: Promise.resolve({ id: "loan_1" }) },
    );

    expect(response.status).toBe(200);
  });
});
