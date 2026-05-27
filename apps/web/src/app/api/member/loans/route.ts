import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import {
  MAX_ACTIVE_LOANS,
  calculateDueDate,
  generateLoanCode,
} from "@library/domain";
import { requireMemberSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const auth = await requireMemberSession(request);
  if (auth.response) return auth.response;

  const memberId = typeof auth.session?.sub === "string" ? auth.session.sub : null;
  if (!memberId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = await request.json();
  const bookId = String(parsed.bookId ?? "");
  if (!bookId) {
    return NextResponse.json({ error: "Invalid loan request" }, { status: 400 });
  }

  const now = new Date();

  const [activeCount, overdueCount, book, sequence] = await Promise.all([
    prisma.loan.count({ where: { memberId, returnDate: null, dueDate: { gte: now } } }),
    prisma.loan.count({ where: { memberId, returnDate: null, dueDate: { lt: now } } }),
    prisma.book.findUnique({ where: { id: bookId } }),
    prisma.loan.count(),
  ]);

  if (overdueCount > 0) {
    return NextResponse.json({ error: "Member has overdue loans" }, { status: 409 });
  }

  if (activeCount >= MAX_ACTIVE_LOANS) {
    return NextResponse.json({ error: "Maximum active loans reached" }, { status: 409 });
  }

  if (!book || book.availableCopies <= 0) {
    return NextResponse.json({ error: "Book is unavailable" }, { status: 409 });
  }

  const loan = await prisma.$transaction(async (tx) => {
    const created = await tx.loan.create({
      data: {
        loanCode: generateLoanCode(now, sequence + 1),
        memberId,
        bookId,
        loanDate: now,
        dueDate: calculateDueDate(now, book.category),
        status: "ACTIVE",
      },
    });

    await tx.book.update({
      where: { id: bookId },
      data: { availableCopies: { decrement: 1 } },
    });

    return created;
  });

  return NextResponse.json(
    { loanCode: loan.loanCode, dueDate: loan.dueDate },
    { status: 201 },
  );
}
