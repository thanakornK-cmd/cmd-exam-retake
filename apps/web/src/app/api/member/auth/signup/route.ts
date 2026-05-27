import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { signupSchema } from "@library/domain";
import { isPrismaInitializationError } from "../../../../../lib/db-errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const parsed = signupSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            parsed.error.issues[0]?.message ?? "Invalid signup data",
        },
        { status: 400 },
      );
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
  } catch (error) {
    if (isPrismaInitializationError(error)) {
      return NextResponse.json(
        { error: "Database is temporarily unavailable" },
        { status: 503 },
      );
    }

    throw error;
  }
}
