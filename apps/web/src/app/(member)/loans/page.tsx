"use client";

import React, { useEffect, useState } from "react";
import { LoanList } from "../../../components/member/loan-list";
import { PageShell } from "../../../components/layout/page-shell";

export default function LoansPage() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLoans() {
      const response = await fetch("/api/member/me/loans");
      if (!response.ok) {
        if (active) setError("Unable to load loans");
        return;
      }

      const payload = await response.json();
      if (active) setLoans(payload);
    }

    loadLoans().catch(() => {
      if (active) setError("Unable to load loans");
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell
      variant="member"
      eyebrow="Active loans"
      title="Your current borrows"
      description="Track what you have borrowed right now, when it is due, and whether any fine has been applied."
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
