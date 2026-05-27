import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { createBookSchema, initializeBookInventory } from "@library/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const parsed = createBookSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid book data" }, { status: 400 });
  }

  const book = await prisma.book.create({
    data: initializeBookInventory(parsed.data),
  });

  return NextResponse.json(book, { status: 201 });
}
