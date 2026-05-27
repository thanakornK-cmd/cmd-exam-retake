"use client";

import React, { useEffect, useState, useTransition, type CSSProperties } from "react";
import { FormField } from "@library/ui";
import { BOOK_LOAN_PERIOD_DAYS } from "@library/domain";

type FormStatus = {
  error: string | null;
  success: string | null;
};

type AdminBook = {
  id: string;
  title: string;
  author: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1.5rem",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(148, 163, 184, 0.24)",
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.14)",
  backdropFilter: "blur(12px)",
};

const alertStyle: CSSProperties = {
  margin: 0,
  padding: "0.9rem 1rem",
  borderRadius: "14px",
};

const errorStyle: CSSProperties = {
  ...alertStyle,
  background: "rgba(239, 68, 68, 0.08)",
  color: "#b91c1c",
  border: "1px solid rgba(239, 68, 68, 0.2)",
};

const successStyle: CSSProperties = {
  ...alertStyle,
  background: "rgba(34, 197, 94, 0.1)",
  color: "#166534",
  border: "1px solid rgba(34, 197, 94, 0.2)",
};

const buttonStyle: CSSProperties = {
  marginTop: "0.25rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: "999px",
  padding: "0.95rem 1.25rem",
  background: "linear-gradient(135deg, #0f172a, #334155)",
  color: "white",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.22)",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "rgba(255, 255, 255, 0.88)",
  color: "#0f172a",
  border: "1px solid rgba(148, 163, 184, 0.24)",
};

const selectStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.8)",
  background: "rgba(255, 255, 255, 0.94)",
  padding: "0.95rem 1rem",
  fontSize: "1rem",
  color: "#0f172a",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
  outline: "none",
};

const defaultCategories = Object.keys(BOOK_LOAN_PERIOD_DAYS);

function getCategoryOptions(categories: string[], currentCategory?: string) {
  const values = new Set([...defaultCategories, ...categories]);
  if (currentCategory) {
    values.add(currentCategory);
  }

  return Array.from(values).sort((left, right) => {
    const leftIndex = defaultCategories.indexOf(left);
    const rightIndex = defaultCategories.indexOf(right);

    if (leftIndex !== -1 || rightIndex !== -1) {
      if (leftIndex === -1) return 1;
      if (rightIndex === -1) return -1;
      return leftIndex - rightIndex;
    }

    return left.localeCompare(right);
  });
}

export function AdminBookForm() {
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState(defaultCategories[0] ?? "textbook");
  const [totalCopies, setTotalCopies] = useState("1");
  const [status, setStatus] = useState<FormStatus>({ error: null, success: null });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadBooks() {
      const response = await fetch("/api/admin/books");
      if (!response.ok) {
        if (active) {
          setStatus({ error: "Unable to load books", success: null });
        }
        return;
      }

      const payload = (await response.json()) as AdminBook[];
      if (active) {
        setBooks(payload);
      }
    }

    async function loadCategories() {
      const response = await fetch("/api/admin/loan-periods");
      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as Record<string, number>;
      if (active) {
        const loadedCategories = Object.keys(payload);
        const nextCategories = getCategoryOptions(loadedCategories);
        setCategories(nextCategories);
        setCategory((current) =>
          loadedCategories.includes(current) ? current : nextCategories[0] ?? defaultCategories[0] ?? "textbook",
        );
      }
    }

    loadBooks().catch(() => {
      if (active) {
        setStatus({ error: "Unable to load books", success: null });
      }
    });

    loadCategories().catch(() => {
      if (active) {
        setStatus({ error: "Unable to load categories", success: null });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  function resetForm() {
    setEditingBookId(null);
    setTitle("");
    setAuthor("");
    setCategory(categories[0] ?? defaultCategories[0] ?? "textbook");
    setTotalCopies("1");
  }

  function beginEdit(book: AdminBook) {
    setEditingBookId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setCategory(book.category);
    setTotalCopies(String(book.totalCopies));
    setStatus({ error: null, success: null });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),
      totalCopies: Number(totalCopies),
    };

    setStatus({ error: null, success: null });

    const response = await fetch(
      editingBookId ? `/api/admin/books/${editingBookId}` : "/api/admin/books",
      {
        method: editingBookId ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      setStatus({
        error: editingBookId ? "Unable to update book" : "Unable to add book",
        success: null,
      });
      return;
    }

    const savedBook = (await response.json()) as AdminBook;
    startTransition(() => {
      setStatus({
        error: null,
        success: editingBookId ? "Book updated" : "Book added",
      });
    });

    setBooks((current) =>
      editingBookId
        ? current.map((book) => (book.id === savedBook.id ? savedBook : book))
        : [savedBook, ...current],
    );
    resetForm();
  }

  const categoryOptions = getCategoryOptions(categories, category);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>
            {editingBookId ? "Edit book" : "Add book"}
          </h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
            Manage titles here and pick a category from the current loan-period rules.
          </p>
        </div>

        <FormField label="Title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} />
        <FormField label="Author" name="author" value={author} onChange={(event) => setAuthor(event.target.value)} />

        <label style={{ display: "grid", gap: "0.45rem", fontSize: "0.95rem", fontWeight: 600, color: "#0f172a" }}>
          <span>Category</span>
          <select
            name="category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            style={selectStyle}
          >
            {categoryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span style={{ fontSize: "0.82rem", color: "#64748b", fontWeight: 400 }}>
            Categories come from the loan-period settings panel.
          </span>
        </label>

        <FormField
          label="Total copies"
          name="totalCopies"
          type="number"
          min="1"
          step="1"
          value={totalCopies}
          onChange={(event) => setTotalCopies(event.target.value)}
        />

        {status.error ? <p role="alert" style={errorStyle}>{status.error}</p> : null}
        {status.success ? <p role="status" style={successStyle}>{status.success}</p> : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <button type="submit" disabled={isPending} style={buttonStyle}>
            {isPending
              ? editingBookId
                ? "Updating..."
                : "Adding book..."
              : editingBookId
                ? "Update book"
                : "Add book"}
          </button>
          {editingBookId ? (
            <button type="button" onClick={resetForm} style={secondaryButtonStyle}>
              Cancel edit
            </button>
          ) : null}
        </div>

        <section
          style={{
            display: "grid",
            gap: "0.75rem",
            padding: "1rem",
            borderRadius: "18px",
            background: "rgba(248, 250, 252, 0.9)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
          }}
        >
          <div style={{ display: "grid", gap: "0.25rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem", color: "#0f172a" }}>
              Loan period reference
            </h3>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
              Category loan durations are driven by the shared domain rules.
            </p>
          </div>
          <div style={{ display: "grid", gap: "0.6rem" }}>
            {defaultCategories.map((row) => (
              <div
                key={row}
                style={{
                  display: "grid",
                  gap: "0.2rem",
                  padding: "0.75rem 0.9rem",
                  borderRadius: "14px",
                  background: "white",
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                    alignItems: "baseline",
                  }}
                >
                  <strong style={{ color: "#0f172a" }}>{row}</strong>
                  <span style={{ color: "#7c2d12", fontWeight: 700 }}>
                    {`${BOOK_LOAN_PERIOD_DAYS[row as keyof typeof BOOK_LOAN_PERIOD_DAYS]} days`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </form>

      <section
        style={{
          display: "grid",
          gap: "0.75rem",
          padding: "1.5rem",
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.84)",
          border: "1px solid rgba(148, 163, 184, 0.24)",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.14)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ display: "grid", gap: "0.25rem" }}>
          <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>Existing books</h3>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
            Select a book to edit its title, category, or copy count.
          </p>
        </div>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {books.map((book) => (
            <article
              key={book.id}
              style={{
                display: "grid",
                gap: "0.5rem",
                padding: "0.9rem 1rem",
                borderRadius: "18px",
                background: "rgba(248, 250, 252, 0.96)",
                border: "1px solid rgba(148, 163, 184, 0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "grid", gap: "0.2rem" }}>
                  <strong style={{ color: "#0f172a" }}>{book.title}</strong>
                  <span style={{ color: "#475569" }}>
                    {book.author} · {book.category}
                  </span>
                </div>
                <span style={{ color: "#7c2d12", fontWeight: 700 }}>
                  {book.availableCopies}/{book.totalCopies} copies
                </span>
              </div>
              <button type="button" onClick={() => beginEdit(book)} style={secondaryButtonStyle}>
                Edit
              </button>
            </article>
          ))}
          {books.length === 0 ? <p style={{ margin: 0, color: "#475569" }}>No books yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
