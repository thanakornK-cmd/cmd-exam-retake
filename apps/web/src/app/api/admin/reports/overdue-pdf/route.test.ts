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
});
