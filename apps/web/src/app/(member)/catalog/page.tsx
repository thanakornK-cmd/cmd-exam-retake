"use client";

import React, { useEffect, useState } from "react";
import { CatalogTable } from "../../../components/member/catalog-table";
import { PageShell } from "../../../components/layout/page-shell";
import { MemberLogoutButton } from "../../../components/member/member-logout-button";

type BookRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  memberLoanStatus?: "ACTIVE" | "OVERDUE" | "RETURNED" | null;
};

type MemberLoan = {
  id: string;
  status: "ACTIVE" | "OVERDUE" | "RETURNED";
  createdAt?: string;
  book: { id: string };
};

export default function CatalogPage() {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      const [booksResponse, historyResponse] = await Promise.all([
        fetch("/api/member/books"),
        fetch("/api/member/me/history"),
      ]);

      if (!booksResponse.ok) {
        if (active) setError("Unable to load catalog");
        return;
      }

      const booksPayload = (await booksResponse.json()) as BookRow[];
      const historyPayload = historyResponse.ok
        ? ((await historyResponse.json()) as MemberLoan[])
        : [];

      const latestStatusByBook = new Map<string, MemberLoan["status"]>();
      for (const loan of historyPayload) {
        if (!latestStatusByBook.has(loan.book.id)) {
          latestStatusByBook.set(loan.book.id, loan.status);
        }
      }

      const enrichedBooks = booksPayload.map((book) => ({
        ...book,
        memberLoanStatus: latestStatusByBook.get(book.id) ?? null,
      }));

      if (active) setBooks(enrichedBooks);
    }

    loadBooks().catch(() => {
      if (active) setError("Unable to load catalog");
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleBorrow(bookId: string) {
    setError(null);
    setMessage(null);

    const response = await fetch("/api/member/loans", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bookId }),
    });

    if (!response.ok) {
      setError("Unable to borrow book");
      return;
    }

    const payload = (await response.json()) as { loanCode: string; dueDate: string };
    setMessage(`Loan ${payload.loanCode} due ${new Date(payload.dueDate).toLocaleDateString()}`);
  }

  const normalizedSearch = search.trim().toLowerCase();
  const filteredBooks =
    normalizedSearch.length === 0
      ? books
      : books.filter((book) => {
          const haystack = `${book.title} ${book.author} ${book.category}`.toLowerCase();
          return haystack.includes(normalizedSearch);
        });

  return (
    <PageShell
      variant="member"
      eyebrow="Member catalog"
      title="Browse the shelves"
      description="Search the available collection and borrow a book when copies are ready."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        {error ? (
          <p
            role="alert"
            style={{
              margin: 0,
              padding: "0.9rem 1rem",
              borderRadius: "14px",
              background: "rgba(239, 68, 68, 0.08)",
              color: "#b91c1c",
              border: "1px solid rgba(239, 68, 68, 0.2)",
            }}
          >
            {error}
          </p>
        ) : null}
        {message ? (
          <p
            role="status"
            style={{
              margin: 0,
              padding: "0.9rem 1rem",
              borderRadius: "14px",
              background: "rgba(34, 197, 94, 0.1)",
              color: "#166534",
              border: "1px solid rgba(34, 197, 94, 0.2)",
            }}
          >
            {message}
          </p>
        ) : null}
        <label style={{ display: "grid", gap: "0.4rem" }}>
          <span style={{ fontWeight: 600, color: "#334155" }}>Search books</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, author, or category"
            style={{
              borderRadius: "14px",
              border: "1px solid rgba(148, 163, 184, 0.35)",
              padding: "0.85rem 1rem",
              background: "rgba(255,255,255,0.84)",
            }}
          />
        </label>
        <CatalogTable books={filteredBooks} onBorrow={handleBorrow} />
        <div>
          <MemberLogoutButton />
        </div>
      </div>
    </PageShell>
  );
}
