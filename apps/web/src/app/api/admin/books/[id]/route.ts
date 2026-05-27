import { NextResponse } from "next/server";
import { prisma } from "@library/db";
import { createBookSchema } from "@library/domain";
import { requireAdminSession } from "../../../../../lib/auth/guards";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminSession(request);
  if (auth.response) return auth.response;

  const { id } = await context.params;
  const parsed = createBookSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid book data" }, { status: 400 });
  }

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const borrowedCopies = book.totalCopies - book.availableCopies;
  if (parsed.data.totalCopies < borrowedCopies) {
    return NextResponse.json(
      { error: "Total copies cannot be less than borrowed copies" },
      { status: 409 },
    );
  }

  const updated = await prisma.book.update({
    where: { id },
    data: {
      ...parsed.data,
      availableCopies: parsed.data.totalCopies - borrowedCopies,
    },
  });

  return NextResponse.json(updated);
}
