"use client";

import React, { useEffect, useState } from "react";
import { LoanList } from "../../../../components/member/loan-list";
import { PageShell } from "../../../../components/layout/page-shell";

export default function AdminOverduePage() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/overdue")
      .then((response) => {
        if (!response.ok) throw new Error("load");
        return response.json();
      })
      .then(setLoans)
      .catch(() => setError("Unable to load overdue loans"));
  }, []);

  return (
    <PageShell
      variant="admin"
      eyebrow="Overdue tracking"
      title="Late loans"
      description="See the overdue queue and keep fines visible while you work through returns."
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
        <LoanList loans={loans as never[]} />
      </div>
    </PageShell>
  );
}
