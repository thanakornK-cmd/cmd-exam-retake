import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { getLoanStatus } from "@library/domain";
import { requireAdminSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const status = new URL(request.url).searchParams.get("status");
  const loans = await prisma.loan.findMany({
    include: { book: true, member: true },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();
  const filtered =
    status && ["ACTIVE", "OVERDUE", "RETURNED"].includes(status)
      ? loans.filter((loan) => getLoanStatus(loan, now) === status)
      : loans;

  return NextResponse.json(
    filtered.map((loan) => ({
      ...loan,
      status: getLoanStatus(loan, now),
    })),
  );
}
