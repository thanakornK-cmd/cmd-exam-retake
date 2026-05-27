import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { calculateFineAmount } from "@library/domain";
import { requireAdminSession } from "../../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseDate(value: unknown) {
  if (typeof value !== "string" || value.length === 0) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function deriveStatus(dueDate: Date, returnDate: Date | null) {
  if (returnDate) return "RETURNED";
  return dueDate < new Date() ? "OVERDUE" : "ACTIVE";
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const { id } = await context.params;
  const body = await request.json();
  const loanDate = parseDate(body.loanDate);
  const dueDate = parseDate(body.dueDate);
  const hasReturnDate = Object.prototype.hasOwnProperty.call(body, "returnDate");
  const returnDate = hasReturnDate
    ? body.returnDate === null
      ? null
      : parseDate(body.returnDate)
    : undefined;

  if (
    (body.loanDate !== undefined && !loanDate) ||
    (body.dueDate !== undefined && !dueDate) ||
    (hasReturnDate && body.returnDate !== null && !returnDate)
  ) {
    return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
  }

  const existing = await prisma.loan.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Loan not found" }, { status: 404 });
  }

  const finalDueDate = dueDate ?? existing.dueDate;
  const finalReturnDate = hasReturnDate ? returnDate : existing.returnDate;

  const fineAmount =
    finalReturnDate === null || finalReturnDate === undefined
      ? existing.fineAmount
      : calculateFineAmount(finalDueDate, finalReturnDate);

  const loan = await prisma.loan.update({
    where: { id },
    data: {
      loanDate: loanDate ?? undefined,
      dueDate: dueDate ?? undefined,
      returnDate: returnDate === undefined ? undefined : returnDate,
      fineAmount,
      status: deriveStatus(finalDueDate, finalReturnDate ?? null),
    },
  });

  return NextResponse.json(loan);
}
