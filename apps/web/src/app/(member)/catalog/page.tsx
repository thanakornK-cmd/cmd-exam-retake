"use client";

import React, { useEffect, useState } from "react";
import { CatalogTable } from "../../../components/member/catalog-table";
import { PageShell } from "../../../components/layout/page-shell";

type BookRow = {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
};

export default function CatalogPage() {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      const response = await fetch("/api/member/books");

      if (!response.ok) {
        if (active) setError("Unable to load catalog");
        return;
      }

      const payload = (await response.json()) as BookRow[];
      if (active) setBooks(payload);
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
        <CatalogTable books={books} onBorrow={handleBorrow} />
      </div>
    </PageShell>
  );
}
