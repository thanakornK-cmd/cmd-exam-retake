import { NextResponse } from "next/server";
import { createAdminSession } from "../../../../../lib/auth/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (
    username !== process.env.LIBRARIAN_USERNAME ||
    password !== process.env.LIBRARIAN_PASSWORD
  ) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createAdminSession(username);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
