import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  loanPeriodSetting: {
    findMany: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("../../../../lib/auth/guards", () => ({
  requireAdminSession: vi.fn(),
}));

import { GET, PATCH } from "./route";

describe("GET /api/admin/loan-periods", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("returns saved loan periods", async () => {
    const { requireAdminSession } = await import("../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.loanPeriodSetting.findMany.mockResolvedValue([
      { category: "textbook", days: 5 },
      { category: "general", days: 8 },
      { category: "novel", days: 14 },
    ]);

    const response = await GET(new Request("http://localhost/api/admin/loan-periods"));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      textbook: 5,
      general: 8,
      novel: 14,
    });
  });
});

describe("PATCH /api/admin/loan-periods", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("saves the updated loan periods", async () => {
    const { requireAdminSession } = await import("../../../../lib/auth/guards");
    requireAdminSession.mockResolvedValue({
      session: { sub: "admin", role: "admin" },
      response: null,
    });
    prismaMock.loanPeriodSetting.upsert.mockResolvedValue({ category: "textbook", days: 5 });

    const response = await PATCH(
      new Request("http://localhost/api/admin/loan-periods", {
        method: "PATCH",
        body: JSON.stringify({
          textbook: 5,
          general: 8,
          novel: 14,
        }),
      }),
    );

    expect(response.status).toBe(200);
    expect(prismaMock.loanPeriodSetting.upsert).toHaveBeenCalledTimes(3);
  });
});
