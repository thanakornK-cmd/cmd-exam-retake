import React from "react";
import { SignupForm } from "../../../components/member/signup-form";
import { PageShell } from "../../../components/layout/page-shell";

export default function SignupPage() {
  return (
    <PageShell
      variant="public"
      eyebrow="Private library access"
      title="Join the lending system"
      description="Sign up once, borrow books, and keep track of active loans and history in a clean member dashboard."
      maxWidth="620px"
    >
      <section aria-label="Signup form">
        <SignupForm />
      </section>
    </PageShell>
  );
}
