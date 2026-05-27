import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { getLoanStatus } from "@library/domain";
import { requireMemberSession } from "../../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireMemberSession(request);
  if (auth.response) return auth.response;

  const memberId = typeof auth.session?.sub === "string" ? auth.session.sub : null;
  if (!memberId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loans = await prisma.loan.findMany({
    where: { memberId },
    include: { book: true },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();

  return NextResponse.json(
    loans.map((loan) => ({
      ...loan,
      status: getLoanStatus(loan, now),
    })),
  );
}
