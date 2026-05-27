import React from "react";
import { PageShell } from "../../../components/layout/page-shell";
import { MemberLogoutButton } from "../../../components/member/member-logout-button";

export default function MemberDashboardPage() {
  return (
    <PageShell
      variant="member"
      eyebrow="Member dashboard"
      title="Reading dashboard"
      description="Jump to catalog, active loans, or history and manage your current session."
    >
      <div
        style={{
          display: "grid",
          gap: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gap: "0.65rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          <a href="/catalog">Browse catalog</a>
          <a href="/loans">View active loans</a>
          <a href="/history">View loan history</a>
        </div>
        <MemberLogoutButton />
      </div>
    </PageShell>
  );
}
