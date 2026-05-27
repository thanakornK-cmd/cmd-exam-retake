import React from "react";
import { AdminLoginForm } from "../../../../components/admin/admin-login-form";
import { PageShell } from "../../../../components/layout/page-shell";

export default function AdminLoginPage() {
  return (
    <PageShell
      variant="admin"
      eyebrow="Admin access"
      title="Librarian sign in"
      description="Use the environment-backed admin account to manage books, loans, overdue items, and reports."
      maxWidth="620px"
    >
      <AdminLoginForm />
    </PageShell>
  );
}
