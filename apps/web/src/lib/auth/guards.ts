import { NextResponse } from "next/server";
import { verifyAdminSession } from "./admin-session";
import { verifyMemberSession } from "./member-session";

export function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null;

  const parts = cookieHeader.split(";").map((part) => part.trim());
  const match = parts.find((part) => part.startsWith(`${name}=`));
  if (!match) return null;

  return decodeURIComponent(match.slice(name.length + 1));
}

export async function requireMemberSession(request: Request) {
  const token = getCookieValue(request.headers.get("cookie"), "member_session");
  if (!token) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const session = await verifyMemberSession(token);
    if (session.role !== "member") {
      return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    return { session, response: null };
  } catch {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}

export async function requireAdminSession(request: Request) {
  const token = getCookieValue(request.headers.get("cookie"), "admin_session");
  if (!token) {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  try {
    const session = await verifyAdminSession(token);
    if (session.role !== "admin") {
      return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }

    return { session, response: null };
  } catch {
    return { session: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}
