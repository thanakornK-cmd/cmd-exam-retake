"use client";

import React, { useState, useTransition, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@library/ui";

type FormStatus = {
  error: string | null;
};

const formStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1.5rem",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.84)",
  border: "1px solid rgba(148, 163, 184, 0.24)",
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.14)",
  backdropFilter: "blur(12px)",
};

const errorStyle: CSSProperties = {
  margin: 0,
  padding: "0.9rem 1rem",
  borderRadius: "14px",
  background: "rgba(239, 68, 68, 0.08)",
  color: "#b91c1c",
  border: "1px solid rgba(239, 68, 68, 0.2)",
};

const buttonStyle: CSSProperties = {
  marginTop: "0.25rem",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  borderRadius: "999px",
  padding: "0.95rem 1.25rem",
  background: "linear-gradient(135deg, #7c2d12, #0f172a)",
  color: "white",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.22)",
};

export function AdminLoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>({ error: null });
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      username: String(formData.get("username") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    setStatus({ error: null });

    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus({ error: "Invalid credentials" });
      return;
    }

    startTransition(() => {
      router.push("/admin/dashboard");
      router.refresh();
    });
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <FormField label="Username" name="username" autoComplete="username" placeholder="admin" />
      <FormField label="Password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
      {status.error ? <p role="alert" style={errorStyle}>{status.error}</p> : null}
      <button type="submit" disabled={isPending} style={buttonStyle}>
        {isPending ? "Logging in..." : "Admin log in"}
      </button>
    </form>
  );
}
