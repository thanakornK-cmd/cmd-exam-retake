import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { BOOK_LOAN_PERIOD_DAYS } from "@library/domain";
import { requireAdminSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoanPeriodMap = Record<string, number>;

function normalizeLoanPeriods(rows: Array<{ category: string; days: number }>) {
  const periods: LoanPeriodMap = {
    textbook: BOOK_LOAN_PERIOD_DAYS.textbook,
    general: BOOK_LOAN_PERIOD_DAYS.general,
    novel: BOOK_LOAN_PERIOD_DAYS.novel,
  };

  for (const row of rows) {
    periods[row.category] = row.days;
  }

  return periods;
}

export async function GET(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const rows = await prisma.loanPeriodSetting.findMany({
    orderBy: { category: "asc" },
  });

  return NextResponse.json(normalizeLoanPeriods(rows));
}

export async function PATCH(request: Request) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const body = (await request.json()) as Record<string, number>;
  const updates = Object.entries(body).map(([category, value]) => {
    const days = Number(value);

    if (!Number.isInteger(days) || days <= 0) {
      return null;
    }

    return prisma.loanPeriodSetting.upsert({
      where: { category },
      update: { days },
      create: { category, days },
    });
  });

  if (updates.some((update) => update === null)) {
    return NextResponse.json({ error: "Invalid loan period data" }, { status: 400 });
  }

  await Promise.all(updates);

  return NextResponse.json({ ok: true });
}
