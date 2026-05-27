import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { signupSchema } from "@library/domain";

export async function POST(request: Request) {
  const parsed = signupSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid signup data" }, { status: 400 });
  }

  const existing = await prisma.member.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return NextResponse.json({ error: "Email already in use" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const member = await prisma.member.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash,
    },
  });

  return NextResponse.json({ id: member.id }, { status: 201 });
}
