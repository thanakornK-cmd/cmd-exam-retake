import React from "react";
import { PageShell } from "../../../../components/layout/page-shell";

export default function AdminReportsPage() {
  return (
    <PageShell
      variant="admin"
      eyebrow="Reporting"
      title="Overdue report export"
      description="Generate a PDF summary of overdue loans and fine totals for offline review."
    >
      <a
        href="/api/admin/reports/overdue-pdf"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "999px",
          padding: "0.9rem 1.2rem",
          background: "linear-gradient(135deg, #0f172a, #334155)",
          color: "white",
          fontWeight: 700,
          textDecoration: "none",
          width: "fit-content",
        }}
      >
        Download overdue report
      </a>
    </PageShell>
  );
}
