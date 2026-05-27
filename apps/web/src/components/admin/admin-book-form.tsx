"use client";

import React, { useState, useTransition, type CSSProperties } from "react";
import { FormField } from "@library/ui";
import { BOOK_LOAN_PERIOD_DAYS } from "@library/domain";

type FormStatus = {
  error: string | null;
  success: string | null;
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

const selectStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.8)",
  background: "rgba(255, 255, 255, 0.94)",
  padding: "0.95rem 1rem",
  fontSize: "1rem",
  color: "#0f172a",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
};

const categoryLabelStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  color: "#0f172a",
  fontSize: "0.95rem",
  fontWeight: 600,
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

const periodRows = [
  {
    category: "textbook",
    description: "ตำราเรียน, หนังสือสอบ",
    period: `${BOOK_LOAN_PERIOD_DAYS.textbook} days`,
  },
  {
    category: "general",
    description: "หนังสือทั่วไป (how-to, สารคดี, ธุรกิจ)",
    period: `${BOOK_LOAN_PERIOD_DAYS.general} days`,
  },
  {
    category: "novel",
    description: "นิยาย, การ์ตูน",
    period: `${BOOK_LOAN_PERIOD_DAYS.novel} days`,
  },
] as const;

export function AdminBookForm() {
  const [status, setStatus] = useState<FormStatus>({ error: null, success: null });
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      author: String(formData.get("author") ?? ""),
      category: String(formData.get("category") ?? ""),
      totalCopies: Number(formData.get("totalCopies") ?? 0),
    };

    setStatus({ error: null, success: null });

    const response = await fetch("/api/admin/books", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus({ error: "Unable to add book", success: null });
      return;
    }

    startTransition(() => {
      setStatus({ error: null, success: "Book added" });
    });

    form.reset();
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <FormField label="Title" name="title" />
      <FormField label="Author" name="author" />
      <label style={categoryLabelStyle}>
        <span>Category</span>
        <select name="category" style={selectStyle} defaultValue="textbook">
          <option value="textbook">textbook</option>
          <option value="general">general</option>
          <option value="novel">novel</option>
        </select>
      </label>
      <FormField label="Total copies" name="totalCopies" type="number" min="1" step="1" />
      {status.error ? <p role="alert" style={errorStyle}>{status.error}</p> : null}
      {status.success ? <p role="status" style={successStyle}>{status.success}</p> : null}
      <button type="submit" disabled={isPending} style={buttonStyle}>
        {isPending ? "Adding book..." : "Add book"}
      </button>

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
          {periodRows.map((row) => (
            <div
              key={row.category}
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
                <strong style={{ color: "#0f172a" }}>{row.category}</strong>
                <span style={{ color: "#7c2d12", fontWeight: 700 }}>{row.period}</span>
              </div>
              <span style={{ color: "#475569" }}>{row.description}</span>
            </div>
          ))}
        </div>
      </section>
    </form>
  );
}
