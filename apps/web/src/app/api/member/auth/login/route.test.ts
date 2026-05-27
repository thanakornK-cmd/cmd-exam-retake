import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  member: {
    findUnique: vi.fn(),
  },
}));

const bcryptMock = vi.hoisted(() => ({
  compare: vi.fn(),
}));

const sessionMock = vi.hoisted(() => ({
  createMemberSession: vi.fn(),
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("bcryptjs", () => ({
  default: bcryptMock,
}));

vi.mock("../../../../../lib/auth/member-session", () => sessionMock);

import { POST } from "./route";

describe("POST /api/member/auth/login", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("rejects wrong password", async () => {
    prismaMock.member.findUnique.mockResolvedValue({
      id: "member_1",
      passwordHash: "hashed-password",
    });
    bcryptMock.compare.mockResolvedValue(false);

    const response = await POST(
      new Request("http://localhost/api/member/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "reader@example.com", password: "wrong" }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("sets a member session cookie on success", async () => {
    prismaMock.member.findUnique.mockResolvedValue({
      id: "member_1",
      passwordHash: "hashed-password",
    });
    bcryptMock.compare.mockResolvedValue(true);
    sessionMock.createMemberSession.mockResolvedValue("member.jwt.token");

    const response = await POST(
      new Request("http://localhost/api/member/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "reader@example.com", password: "secret123" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie") ?? "").toContain("member_session=member.jwt.token");
  });

  it("returns a temporary-unavailable error when the database cannot connect", async () => {
    prismaMock.member.findUnique.mockRejectedValue(
      Object.assign(new Error("connect failed"), {
        name: "PrismaClientInitializationError",
      }),
    );

    const response = await POST(
      new Request("http://localhost/api/member/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "reader@example.com", password: "secret123" }),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Database is temporarily unavailable",
    });
  });
});
