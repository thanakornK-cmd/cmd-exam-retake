import { NextRequest, NextResponse } from "next/server";
import { getCookieValue } from "./src/lib/auth/guards";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/login" || pathname === "/signup") {
    return NextResponse.next();
  }

  const memberArea = pathname === "/catalog" || pathname === "/loans" || pathname === "/history";
  const memberApi = pathname.startsWith("/api/member/");

  if (!memberArea && !memberApi) {
    return NextResponse.next();
  }

  const token = getCookieValue(request.headers.get("cookie"), "member_session");
  if (!token) {
    if (memberApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redirectUrl = new URL("/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/catalog/:path*", "/loans/:path*", "/history/:path*", "/api/member/:path*"],
};
