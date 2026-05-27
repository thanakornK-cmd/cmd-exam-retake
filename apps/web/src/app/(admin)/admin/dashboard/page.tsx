import React from "react";
import Link from "next/link";
import { PageShell } from "../../../../components/layout/page-shell";
import { AdminLogoutButton } from "../../../../components/admin/admin-logout-button";

export default function AdminDashboardPage() {
  const quickLinks = [
    {
      href: "/admin/books",
      title: "Books",
      body: "Create and review inventory",
    },
    {
      href: "/admin/loans",
      title: "Loans",
      body: "Inspect active borrowing",
    },
    {
      href: "/admin/overdue",
      title: "Overdue",
      body: "Review late returns",
    },
    {
      href: "/admin/reports",
      title: "Reports",
      body: "Download PDF summaries",
    },
  ];

  return (
    <PageShell
      variant="admin"
      eyebrow="Admin dashboard"
      title="Command center"
      description="Manage the library catalog, monitor active loans, handle overdue returns, and export reports."
    >
      <div style={{ display: "grid", gap: "1rem" }}>
        <div
          style={{
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "grid",
                gap: "0.4rem",
                borderRadius: "20px",
                border: "1px solid rgba(148, 163, 184, 0.22)",
                background: "rgba(255, 255, 255, 0.85)",
                padding: "1rem",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                color: "#0f172a",
                textDecoration: "none",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              <h2 style={{ margin: 0, fontSize: "1.05rem" }}>{item.title}</h2>
              <p style={{ margin: 0, color: "#475569", lineHeight: 1.5 }}>{item.body}</p>
              <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#7c2d12" }}>
                Open section
              </span>
            </Link>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <Link
            href="/admin/books"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              padding: "0.85rem 1.15rem",
              background: "linear-gradient(135deg, #7c2d12, #0f172a)",
              color: "white",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Manage books
          </Link>
          <Link
            href="/admin/loans"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "999px",
              padding: "0.85rem 1.15rem",
              background: "rgba(255, 255, 255, 0.86)",
              color: "#0f172a",
              fontWeight: 700,
              textDecoration: "none",
              border: "1px solid rgba(148, 163, 184, 0.24)",
            }}
          >
            Review loans
          </Link>
        </div>
      </div>
      <div style={{ marginTop: "0.5rem" }}>
        <AdminLogoutButton />
      </div>
    </PageShell>
  );
}
