"use client";

import React, { useEffect, useState } from "react";
import { LoanList } from "../../../components/member/loan-list";
import { PageShell } from "../../../components/layout/page-shell";

export default function HistoryPage() {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLoans() {
      const response = await fetch("/api/member/me/history");
      if (!response.ok) {
        if (active) setError("Unable to load history");
        return;
      }

      const payload = await response.json();
      if (active) setLoans(payload);
    }

    loadLoans().catch(() => {
      if (active) setError("Unable to load history");
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <PageShell
      variant="member"
      eyebrow="Reading history"
      title="Past loans"
      description="Review finished loans, returned items, and the record of what you borrowed before."
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
