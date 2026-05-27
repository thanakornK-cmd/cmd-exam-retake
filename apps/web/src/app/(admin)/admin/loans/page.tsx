"use client";

import React, { useEffect, useState } from "react";
import { LoanEditForm } from "../../../../components/admin/loan-edit-form";
import { PageShell } from "../../../../components/layout/page-shell";

type AdminLoanRow = {
  id: string;
  loanCode: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "ACTIVE" | "OVERDUE" | "RETURNED";
  fineAmount: number;
  book: { title: string };
  member: { name: string };
};

export default function AdminLoansPage() {
  const [loans, setLoans] = useState<AdminLoanRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  async function loadLoans(filter = statusFilter) {
    const query = filter === "all" ? "" : `?status=${filter}`;
    const response = await fetch(`/api/admin/loans${query}`);
    if (!response.ok) {
      setError("Unable to load loans");
      return;
    }

    setLoans(await response.json());
  }

  useEffect(() => {
    loadLoans().catch(() => setError("Unable to load loans"));
  }, [statusFilter]);

  async function handleReturn(loanId: string) {
    setMessage(null);
    const response = await fetch(`/api/admin/loans/${loanId}/return`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ returnDate: new Date().toISOString() }),
    });

    if (!response.ok) {
      setError("Unable to return loan");
      return;
    }

    setMessage("Loan returned");
    await loadLoans();
  }

  return (
    <PageShell
      variant="admin"
      eyebrow="Loan operations"
      title="Active loan control"
      description="Inspect current loans, edit dates, and confirm returns without leaving the admin workspace."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <label style={{ display: "grid", gap: "0.35rem", maxWidth: "220px" }}>
          <span style={{ fontSize: "0.9rem", color: "#475569" }}>Filter</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            style={{
              borderRadius: "12px",
              border: "1px solid rgba(148, 163, 184, 0.28)",
              padding: "0.7rem 0.8rem",
              background: "white",
            }}
          >
            <option value="all">All</option>
            <option value="ACTIVE">Active</option>
            <option value="OVERDUE">Overdue</option>
            <option value="RETURNED">Returned</option>
          </select>
        </label>
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
        {loans.map((loan) => (
          <section
            key={loan.id}
            style={{
              borderRadius: "22px",
              border: "1px solid rgba(148, 163, 184, 0.18)",
              background: "rgba(255, 255, 255, 0.84)",
              padding: "1.1rem",
              boxShadow: "0 12px 32px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div style={{ display: "grid", gap: "0.25rem", marginBottom: "0.85rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>{loan.book.title}</h2>
              <p style={{ margin: 0, color: "#475569" }}>Member: {loan.member.name}</p>
              <p style={{ margin: 0, color: "#475569" }}>Status: {loan.status}</p>
            </div>
            <LoanEditForm loan={loan} />
            {loan.status !== "RETURNED" ? (
              <button type="button" onClick={() => handleReturn(loan.id)}>
                Return
              </button>
            ) : null}
          </section>
        ))}
      </div>
    </PageShell>
  );
}
