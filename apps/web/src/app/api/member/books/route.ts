import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { requireMemberSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireMemberSession(request);
  if (auth.response) return auth.response;

  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(books);
}
