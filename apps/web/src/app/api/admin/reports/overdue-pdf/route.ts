import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { calculateFineAmount, countOverdueWeekdays, isLoanOverdue } from "@library/domain";
import { buildOverdueReportPdf } from "../../../../../lib/pdf/overdue-report";
import { requireAdminSession } from "../../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const loans = await prisma.loan.findMany({
    where: {
      OR: [
        { returnDate: null },
        { returnDate: { not: null } },
      ],
    },
    include: { book: true, member: true },
    orderBy: { dueDate: "asc" },
  });

  const now = new Date();
  const overdueLoans = loans.filter(
    (loan) =>
      isLoanOverdue(loan, now) ||
      (loan.returnDate !== null && loan.returnDate.getTime() > loan.dueDate.getTime()),
  );
  const pdf = await buildOverdueReportPdf(
    overdueLoans.map((loan) => {
      const referenceDate = loan.returnDate ?? now;
      const overdueDays = countOverdueWeekdays(loan.dueDate, referenceDate);
      return {
        member: loan.member.name,
        book: loan.book.title,
        dueDate: loan.dueDate.toISOString().slice(0, 10),
        overdueDays,
        fine: loan.fineAmount || calculateFineAmount(loan.dueDate, referenceDate),
      };
    }),
  );

  return new NextResponse(pdf, {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'attachment; filename="overdue-loans-report.pdf"',
    },
  });
}
