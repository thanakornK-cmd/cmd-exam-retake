import { NextRequest, NextResponse } from "next/server";
import { getCookieValue } from "./src/lib/auth/guards";

const PUBLIC_AUTH_PATHS = new Set([
  "/login",
  "/signup",
  "/admin/login",
  "/api/member/auth/signup",
  "/api/member/auth/login",
  "/api/admin/auth/login",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_AUTH_PATHS.has(pathname)) {
    return NextResponse.next();
  }

  const memberArea = pathname === "/catalog" || pathname === "/loans" || pathname === "/history";
  const memberApi = pathname.startsWith("/api/member/");
  const adminArea = pathname === "/admin/dashboard" || pathname === "/admin/books";
  const adminApi = pathname.startsWith("/api/admin/");

  if (!memberArea && !memberApi && !adminArea && !adminApi) {
    return NextResponse.next();
  }

  if (memberArea || memberApi) {
    const memberToken = getCookieValue(request.headers.get("cookie"), "member_session");
    if (!memberToken) {
      if (memberApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const redirectUrl = new URL("/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (adminArea || adminApi) {
    const adminToken = getCookieValue(request.headers.get("cookie"), "admin_session");
    if (!adminToken) {
      if (adminApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const redirectUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (adminApi) {
    const memberToken = getCookieValue(request.headers.get("cookie"), "member_session");
    if (memberToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/catalog/:path*",
    "/loans/:path*",
    "/history/:path*",
    "/admin/dashboard/:path*",
    "/admin/books/:path*",
    "/api/member/:path*",
    "/api/admin/:path*",
  ],
};
