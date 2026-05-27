"use client";

import React, { useEffect, useState, useTransition, type CSSProperties } from "react";
import { BOOK_LOAN_PERIOD_DAYS } from "@library/domain";

type LoanPeriodRow = {
  name: string;
  days: number;
};

const baseStyles: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1.5rem",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(148, 163, 184, 0.24)",
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.14)",
  backdropFilter: "blur(12px)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.8)",
  background: "rgba(255, 255, 255, 0.94)",
  padding: "0.95rem 1rem",
  fontSize: "1rem",
  color: "#0f172a",
  boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
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
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: "999px",
  padding: "0.9rem 1.1rem",
  background: "linear-gradient(135deg, #0f172a, #334155)",
  color: "white",
  fontWeight: 700,
  fontSize: "0.98rem",
  cursor: "pointer",
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  background: "rgba(255, 255, 255, 0.88)",
  color: "#0f172a",
  border: "1px solid rgba(148, 163, 184, 0.24)",
};

const defaultRows: LoanPeriodRow[] = [
  { name: "textbook", days: BOOK_LOAN_PERIOD_DAYS.textbook },
  { name: "general", days: BOOK_LOAN_PERIOD_DAYS.general },
  { name: "novel", days: BOOK_LOAN_PERIOD_DAYS.novel },
];

export function LoanPeriodSettingsForm() {
  const [rows, setRows] = useState<LoanPeriodRow[]>(defaultRows);
  const [status, setStatus] = useState<{ error: string | null; success: string | null }>({
    error: null,
    success: null,
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;

    async function loadPeriods() {
      const response = await fetch("/api/admin/loan-periods");
      if (!response.ok) {
        if (active) {
          setStatus({ error: "Unable to load loan periods", success: null });
        }
        return;
      }

      const payload = (await response.json()) as Record<string, number>;
      if (active) {
        setRows(
          Object.entries(payload).map(([name, days]) => ({
            name,
            days: Number(days),
          })),
        );
      }
    }

    loadPeriods().catch(() => {
      if (active) {
        setStatus({ error: "Unable to load loan periods", success: null });
      }
    });

    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ error: null, success: null });

    const payload = rows.reduce<Record<string, number>>((acc, row) => {
      const name = row.name.trim();
      if (name) {
        acc[name] = row.days;
      }
      return acc;
    }, {});

    const response = await fetch("/api/admin/loan-periods", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus({ error: "Unable to save loan periods", success: null });
      return;
    }

    startTransition(() => {
      setStatus({ error: null, success: "Loan periods saved" });
    });
  }

  function updateRow(index: number, next: Partial<LoanPeriodRow>) {
    setRows((current) =>
      current.map((row, currentIndex) => (currentIndex === index ? { ...row, ...next } : row)),
    );
  }

  return (
    <form style={baseStyles} onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: "0.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>Category settings</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
          Add a new category by giving it a name and a loan period in days.
        </p>
      </div>

      <div style={{ display: "grid", gap: "0.85rem" }}>
        {rows.map((row, index) => (
          <div
            key={`${row.name}-${index}`}
            style={{
              display: "grid",
              gap: "0.6rem",
              padding: "0.9rem",
              borderRadius: "18px",
              background: "rgba(248, 250, 252, 0.96)",
              border: "1px solid rgba(148, 163, 184, 0.2)",
            }}
          >
            <div style={{ display: "grid", gap: "0.4rem" }}>
              <label style={{ display: "grid", gap: "0.35rem", fontWeight: 600, color: "#0f172a" }}>
                <span>Category name</span>
                <input
                  value={row.name}
                  onChange={(event) => updateRow(index, { name: event.target.value })}
                  placeholder="science"
                  style={inputStyle}
                />
              </label>
              <label style={{ display: "grid", gap: "0.35rem", fontWeight: 600, color: "#0f172a" }}>
                <span>Loan days</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={row.days}
                  onChange={(event) => updateRow(index, { days: Number(event.target.value) })}
                  style={inputStyle}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <button
          type="button"
          onClick={() => setRows((current) => [...current, { name: "", days: 7 }])}
          style={secondaryButtonStyle}
        >
          Add category
        </button>
        <button type="submit" disabled={isPending} style={buttonStyle}>
          {isPending ? "Saving..." : "Save categories"}
        </button>
      </div>

      {status.error ? <p role="alert" style={errorStyle}>{status.error}</p> : null}
      {status.success ? <p role="status" style={successStyle}>{status.success}</p> : null}
    </form>
  );
}
