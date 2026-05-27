import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { createBookSchema, initializeBookInventory } from "@library/domain";
import { requireAdminSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(books);
}

export async function POST(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const parsed = createBookSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid book data" }, { status: 400 });
  }

  const book = await prisma.book.create({
    data: initializeBookInventory(parsed.data),
  });

  return NextResponse.json(book, { status: 201 });
}
