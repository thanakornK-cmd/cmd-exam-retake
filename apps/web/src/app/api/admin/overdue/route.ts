import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { isLoanOverdue, getLoanStatus } from "@library/domain";
import { requireAdminSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const loans = await prisma.loan.findMany({
    where: { returnDate: null },
    include: { book: true, member: true },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();
  const overdueLoans = loans.filter((loan) => isLoanOverdue(loan, now));

  return NextResponse.json(
    overdueLoans.map((loan) => ({
      ...loan,
      status: getLoanStatus(loan, now),
    })),
  );
}
