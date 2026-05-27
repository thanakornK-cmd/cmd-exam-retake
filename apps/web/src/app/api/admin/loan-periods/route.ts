import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { BOOK_CATEGORIES, BOOK_LOAN_PERIOD_DAYS } from "@library/domain";
import { requireAdminSession } from "../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoanPeriodMap = {
  textbook: number;
  general: number;
  novel: number;
};

function normalizeLoanPeriods(rows: Array<{ category: string; days: number }>) {
  const periods: LoanPeriodMap = {
    textbook: BOOK_LOAN_PERIOD_DAYS.textbook,
    general: BOOK_LOAN_PERIOD_DAYS.general,
    novel: BOOK_LOAN_PERIOD_DAYS.novel,
  };

  for (const row of rows) {
    if (!BOOK_CATEGORIES.includes(row.category as (typeof BOOK_CATEGORIES)[number])) {
      continue;
    }

    if (row.category === "textbook") {
      periods.textbook = row.days;
    } else if (row.category === "general") {
      periods.general = row.days;
    } else if (row.category === "novel") {
      periods.novel = row.days;
    }
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

  const body = (await request.json()) as Partial<Record<keyof typeof BOOK_LOAN_PERIOD_DAYS, number>>;
  const updates = BOOK_CATEGORIES.map((category) => {
    const days = Number(body[category]);

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
