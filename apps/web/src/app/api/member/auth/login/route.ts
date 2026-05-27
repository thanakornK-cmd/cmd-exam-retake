import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { loginSchema } from "@library/domain";
import { createMemberSession } from "../../../../../lib/auth/member-session";

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid login data" }, { status: 400 });
  }

  const member = await prisma.member.findUnique({
    where: { email: parsed.data.email },
  });

  if (!member) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await bcrypt.compare(parsed.data.password, member.passwordHash);
  if (!isValid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createMemberSession(member.id);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("member_session", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
