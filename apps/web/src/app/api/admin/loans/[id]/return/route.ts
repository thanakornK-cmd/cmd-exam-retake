import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { calculateFineAmount } from "@library/domain";
import { requireAdminSession } from "../../../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const { id } = await context.params;
  const body = await request.json();
  const returnedAt = new Date(body.returnDate ?? new Date().toISOString());

  const loan = await prisma.loan.findUnique({ where: { id } });
  if (!loan) {
    return NextResponse.json({ error: "Loan not found" }, { status: 404 });
  }

  const fineAmount = calculateFineAmount(loan.dueDate, returnedAt);

  const updated = await prisma.$transaction(async (tx) => {
    const nextLoan = await tx.loan.update({
      where: { id },
      data: {
        returnDate: returnedAt,
        fineAmount,
        status: "RETURNED",
      },
    });

    await tx.book.update({
      where: { id: loan.bookId },
      data: { availableCopies: { increment: 1 } },
    });

    return nextLoan;
  });

  return NextResponse.json(updated);
}
