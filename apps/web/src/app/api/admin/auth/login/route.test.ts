import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const sessionMock = vi.hoisted(() => ({
  createAdminSession: vi.fn(),
}));

vi.mock("../../../../../lib/auth/admin-session", () => sessionMock);

import { POST } from "./route";

describe("POST /api/admin/auth/login", () => {
  const envSnapshot = {
    username: process.env.LIBRARIAN_USERNAME,
    password: process.env.LIBRARIAN_PASSWORD,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    process.env.LIBRARIAN_USERNAME = "admin";
    process.env.LIBRARIAN_PASSWORD = "securepassword";
  });

  afterAll(() => {
    process.env.LIBRARIAN_USERNAME = envSnapshot.username;
    process.env.LIBRARIAN_PASSWORD = envSnapshot.password;
  });

  it("rejects wrong credentials", async () => {
    const response = await POST(
      new Request("http://localhost/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "wrong" }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("sets an admin session cookie on success", async () => {
    sessionMock.createAdminSession.mockResolvedValue("admin.jwt.token");

    const response = await POST(
      new Request("http://localhost/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ username: "admin", password: "securepassword" }),
      }),
    );

    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie") ?? "").toContain("admin_session=admin.jwt.token");
  });
});
