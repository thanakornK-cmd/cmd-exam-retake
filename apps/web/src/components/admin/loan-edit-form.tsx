"use client";

import React, { useState, useTransition, type CSSProperties } from "react";

type Loan = {
  id: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
};

function toLocalInputValue(value: string | null) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

const formStyle: CSSProperties = {
  display: "grid",
  gap: "0.9rem",
  padding: "1rem",
  borderRadius: "20px",
  border: "1px solid rgba(148, 163, 184, 0.22)",
  background: "rgba(248, 250, 252, 0.92)",
};

const labelStyle: CSSProperties = {
  display: "grid",
  gap: "0.45rem",
  color: "#0f172a",
  fontSize: "0.95rem",
  fontWeight: 600,
};

const inputStyle: CSSProperties = {
  width: "100%",
  borderRadius: "14px",
  border: "1px solid rgba(148, 163, 184, 0.8)",
  background: "rgba(255, 255, 255, 0.95)",
  padding: "0.9rem 1rem",
  fontSize: "1rem",
};

const buttonStyle: CSSProperties = {
  marginTop: "0.15rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: "999px",
  padding: "0.85rem 1.2rem",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

export function LoanEditForm({ loan }: { loan: Loan }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      loanDate: String(formData.get("loanDate") ?? ""),
      dueDate: String(formData.get("dueDate") ?? ""),
      returnDate: String(formData.get("returnDate") ?? ""),
    };

    const response = await fetch(`/api/admin/loans/${loan.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setMessage("Unable to save loan");
      return;
    }

    startTransition(() => {
      setMessage("Loan saved");
    });
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <label style={labelStyle}>
        <span>Loan date</span>
        <input style={inputStyle} name="loanDate" type="datetime-local" defaultValue={toLocalInputValue(loan.loanDate)} />
      </label>
      <label style={labelStyle}>
        <span>Due date</span>
        <input style={inputStyle} name="dueDate" type="datetime-local" defaultValue={toLocalInputValue(loan.dueDate)} />
      </label>
      <label style={labelStyle}>
        <span>Return date</span>
        <input
          style={inputStyle}
          name="returnDate"
          type="datetime-local"
          defaultValue={toLocalInputValue(loan.returnDate)}
        />
      </label>
      {message ? (
        <p
          role="status"
          style={{
            margin: 0,
            padding: "0.8rem 0.95rem",
            borderRadius: "14px",
            background: "rgba(34, 197, 94, 0.1)",
            color: "#166534",
            border: "1px solid rgba(34, 197, 94, 0.2)",
          }}
        >
          {message}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} style={buttonStyle}>
        {isPending ? "Saving..." : "Save loan"}
      </button>
    </form>
  );
}
