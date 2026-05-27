import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { requireAdminSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoanStatus = "ACTIVE" | "OVERDUE" | "RETURNED";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const status = new URL(request.url).searchParams.get("status");
  const where =
    status && ["ACTIVE", "OVERDUE", "RETURNED"].includes(status)
      ? { status: status as LoanStatus }
      : undefined;

  const loans = await prisma.loan.findMany({
    where,
    include: { book: true, member: true },
    orderBy: { dueDate: "asc" },
  });

  return NextResponse.json(loans);
}
