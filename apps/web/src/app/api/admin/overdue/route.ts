import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { requireAdminSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const loans = await prisma.loan.findMany({
    where: { status: "OVERDUE" },
    include: { book: true, member: true },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(loans);
}
