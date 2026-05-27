"use client";

import React, { useEffect, useState, useTransition, type CSSProperties } from "react";
import { BOOK_LOAN_PERIOD_DAYS } from "@library/domain";
import { FormField } from "@library/ui";

type LoanPeriods = Record<keyof typeof BOOK_LOAN_PERIOD_DAYS, number>;

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
  background: "linear-gradient(135deg, #7c2d12, #0f172a)",
  color: "white",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.22)",
};

const defaultPeriods: LoanPeriods = {
  ...BOOK_LOAN_PERIOD_DAYS,
};

export function LoanPeriodSettingsForm() {
  const [periods, setPeriods] = useState<LoanPeriods>(defaultPeriods);
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

      const payload = (await response.json()) as LoanPeriods;
      if (active) {
        setPeriods({
          textbook: Number(payload.textbook ?? BOOK_LOAN_PERIOD_DAYS.textbook),
          general: Number(payload.general ?? BOOK_LOAN_PERIOD_DAYS.general),
          novel: Number(payload.novel ?? BOOK_LOAN_PERIOD_DAYS.novel),
        });
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

    const response = await fetch("/api/admin/loan-periods", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(periods),
    });

    if (!response.ok) {
      setStatus({ error: "Unable to save loan periods", success: null });
      return;
    }

    startTransition(() => {
      setStatus({ error: null, success: "Loan periods saved" });
    });
  }

  return (
    <form style={baseStyles} onSubmit={handleSubmit}>
      <div style={{ display: "grid", gap: "0.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#0f172a" }}>Loan period settings</h3>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>
          Adjust the default borrowing window for each category.
        </p>
      </div>

      <div style={{ display: "grid", gap: "0.9rem" }}>
        <FormField
          label="Textbook days"
          name="textbook"
          type="number"
          min="1"
          step="1"
          value={String(periods.textbook)}
          onChange={(event) =>
            setPeriods((current) => ({ ...current, textbook: Number(event.target.value) }))
          }
        />
        <FormField
          label="General days"
          name="general"
          type="number"
          min="1"
          step="1"
          value={String(periods.general)}
          onChange={(event) =>
            setPeriods((current) => ({ ...current, general: Number(event.target.value) }))
          }
        />
        <FormField
          label="Novel days"
          name="novel"
          type="number"
          min="1"
          step="1"
          value={String(periods.novel)}
          onChange={(event) =>
            setPeriods((current) => ({ ...current, novel: Number(event.target.value) }))
          }
        />
      </div>

      {status.error ? <p role="alert" style={errorStyle}>{status.error}</p> : null}
      {status.success ? <p role="status" style={successStyle}>{status.success}</p> : null}

      <button type="submit" disabled={isPending} style={buttonStyle}>
        {isPending ? "Saving..." : "Save loan periods"}
      </button>
    </form>
  );
}
