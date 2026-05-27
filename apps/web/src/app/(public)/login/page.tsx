import React from "react";
import { LoginForm } from "../../../components/member/login-form";
import { PageShell } from "../../../components/layout/page-shell";

export default function LoginPage() {
  return (
    <PageShell
      variant="public"
      eyebrow="Member access"
      title="Welcome back"
      description="Log in to browse the catalog, manage your active loans, and review your reading history."
      maxWidth="620px"
    >
      <LoginForm />
    </PageShell>
  );
}
