import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  member: {
    findUnique: vi.fn(),
    create: vi.fn(),
  },
}));

const bcryptMock = vi.hoisted(() => ({
  hash: vi.fn(),
}));

vi.mock("@library/db", () => ({
  prisma: prismaMock,
}));

vi.mock("bcryptjs", () => ({
  default: bcryptMock,
}));

import { POST } from "./route";

describe("POST /api/member/auth/signup", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("creates a member and hashes the password", async () => {
    prismaMock.member.findUnique.mockResolvedValue(null);
    bcryptMock.hash.mockResolvedValue("hashed-password");
    prismaMock.member.create.mockResolvedValue({
      id: "member_1",
    });

    const response = await POST(
      new Request("http://localhost/api/member/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: "Reader",
          email: "reader@example.com",
          phone: "0123456789",
          password: "secret123",
        }),
      }),
    );

    expect(response.status).toBe(201);
    expect(bcryptMock.hash).toHaveBeenCalledWith("secret123", 10);
    expect(prismaMock.member.create).toHaveBeenCalledWith({
      data: {
        name: "Reader",
        email: "reader@example.com",
        phone: "0123456789",
        passwordHash: "hashed-password",
      },
    });
  });

  it("returns a temporary-unavailable error when the database cannot connect", async () => {
    prismaMock.member.findUnique.mockRejectedValue(
      Object.assign(new Error("connect failed"), {
        name: "PrismaClientInitializationError",
      }),
    );

    const response = await POST(
      new Request("http://localhost/api/member/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: "Reader",
          email: "reader@example.com",
          phone: "0123456789",
          password: "secret123",
        }),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      error: "Database is temporarily unavailable",
    });
  });
});
