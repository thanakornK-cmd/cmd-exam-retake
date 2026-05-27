import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  loan: {
    findMany: vi.fn(),
  },
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../../../../../lib/auth/guards", () => ({
  requireAdminSession: vi.fn(),
}));

import { GET } from "./route";

describe("GET /api/admin/reports/overdue-pdf", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns a downloadable pdf", async () => {
    const { requireAdminSession } = await import("../../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.loan.findMany.mockResolvedValue([]);

    const response = await GET(new Request("http://localhost/api/admin/reports/overdue-pdf"));

    expect(response.headers.get("content-type")).toBe("application/pdf");
  });

  it("includes active overdue and returned-late loans in the report", async () => {
    const { requireAdminSession } = await import("../../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.loan.findMany.mockResolvedValue([
      {
        dueDate: new Date("2026-05-01T00:00:00.000Z"),
        returnDate: null,
        fineAmount: null,
        member: { name: "Alice" },
        book: { title: "Book A" },
      },
      {
        dueDate: new Date("2026-05-01T00:00:00.000Z"),
        returnDate: new Date("2026-05-06T00:00:00.000Z"),
        fineAmount: 60,
        member: { name: "Bob" },
        book: { title: "Book B" },
      },
      {
        dueDate: new Date("2026-05-10T00:00:00.000Z"),
        returnDate: new Date("2026-05-09T00:00:00.000Z"),
        fineAmount: 0,
        member: { name: "Carol" },
        book: { title: "Book C" },
      },
    ]);

    const response = await GET(new Request("http://localhost/api/admin/reports/overdue-pdf"));
    const body = await response.arrayBuffer();

    expect(prismaMock.loan.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ returnDate: null }, { returnDate: { not: null } }],
        },
      }),
    );
    expect(response.headers.get("content-type")).toBe("application/pdf");
    expect(body.byteLength).toBeGreaterThan(0);
  });
});
