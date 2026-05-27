import { NextResponse } from "next/server";
import { prisma } from "@library/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(books);
}
