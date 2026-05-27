"use client";

import React, { useEffect, useState } from "react";
import { CatalogTable } from "../../../components/member/catalog-table";

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

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      const response = await fetch("/api/member/books");

      if (!response.ok) {
        if (active) {
          setError("Unable to load catalog");
        }
        return;
      }

      const payload = (await response.json()) as BookRow[];
      if (active) {
        setBooks(payload);
      }
    }

    loadBooks().catch(() => {
      if (active) {
        setError("Unable to load catalog");
      }
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="grid gap-4">
      <h1 className="text-2xl font-semibold">Catalog</h1>
      {error ? <p role="alert">{error}</p> : <CatalogTable books={books} />}
    </main>
  );
}
