import React from "react";
import { PageShell } from "../../../../components/layout/page-shell";
import { AdminLogoutButton } from "../../../../components/admin/admin-logout-button";

export default function AdminDashboardPage() {
  return (
    <PageShell
      variant="admin"
      eyebrow="Admin dashboard"
      title="Command center"
      description="Manage the library catalog, monitor active loans, handle overdue returns, and export reports."
    >
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        }}
      >
        {[
          ["Books", "Create and review inventory"],
          ["Loans", "Inspect active borrowing"],
          ["Overdue", "Review late returns"],
          ["Reports", "Download PDF summaries"],
        ].map(([title, body]) => (
          <article
            key={title}
            style={{
              borderRadius: "20px",
              border: "1px solid rgba(148, 163, 184, 0.22)",
              background: "rgba(255, 255, 255, 0.75)",
              padding: "1rem",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.05rem" }}>{title}</h2>
            <p style={{ margin: "0.4rem 0 0", color: "#475569", lineHeight: 1.5 }}>{body}</p>
          </article>
        ))}
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        <AdminLogoutButton />
      </div>
    </PageShell>
  );
}
