import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

describe("middleware", () => {
  it("allows public auth routes", () => {
    const response = middleware(
      new NextRequest("http://localhost/api/member/auth/signup", {
        method: "POST",
      }),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("allows public admin auth routes", () => {
    const response = middleware(
      new NextRequest("http://localhost/api/admin/auth/login", {
        method: "POST",
      }),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });

  it("blocks protected member api routes without a session", () => {
    const response = middleware(
      new NextRequest("http://localhost/api/member/books", {
        method: "GET",
      }),
    );

    expect(response.status).toBe(401);
  });

  it("redirects protected admin pages without a session", () => {
    const response = middleware(
      new NextRequest("http://localhost/admin/books", {
        method: "GET",
      }),
    );

    expect(response.headers.get("location")).toContain("/admin/login");
  });

  it("allows admin api requests when both admin and member cookies are present", () => {
    const response = middleware(
      new NextRequest("http://localhost/api/admin/books", {
        method: "POST",
        headers: {
          cookie: "admin_session=admin.jwt; member_session=member.jwt",
        },
      }),
    );

    expect(response.headers.get("x-middleware-next")).toBe("1");
  });
});
