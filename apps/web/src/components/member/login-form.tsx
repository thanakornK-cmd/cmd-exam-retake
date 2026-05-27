"use client";

import React, { useState, useTransition, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@library/ui";

type FormStatus = {
  error: string | null;
};

function parseErrorMessage(status: number) {
  if (status === 401) return "Invalid credentials";
  if (status === 503) return "Database is temporarily unavailable";
  return "Unable to log in";
}

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
  background: "linear-gradient(135deg, #0f172a, #334155)",
  color: "white",
  fontWeight: 700,
  fontSize: "1rem",
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(15, 23, 42, 0.22)",
};

export function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>({ error: null });
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    setStatus({ error: null });

    const response = await fetch("/api/member/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = parseErrorMessage(response.status);

      try {
        const data = (await response.json()) as { error?: string };
        if (data.error) {
          errorMessage = data.error;
        }
      } catch {
        // Keep the fallback message when the server does not return JSON.
      }

      setStatus({ error: errorMessage });
      return;
    }

    startTransition(() => {
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="reader@example.com" />
      <FormField label="Password" name="password" type="password" autoComplete="current-password" placeholder="••••••••" />
      {status.error ? <p role="alert" style={errorStyle}>{status.error}</p> : null}
      <button type="submit" disabled={isPending} style={buttonStyle}>
        {isPending ? "Logging in..." : "Log in"}
      </button>
      <a
        href="/signup"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "999px",
          padding: "0.95rem 1.25rem",
          border: "1px solid rgba(148, 163, 184, 0.3)",
          color: "#0f172a",
          fontWeight: 700,
          textDecoration: "none",
          background: "rgba(255, 255, 255, 0.75)",
        }}
      >
        Sign up
      </a>
    </form>
  );
}
