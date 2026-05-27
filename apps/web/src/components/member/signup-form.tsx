"use client";

import React, { useState, useTransition, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@library/ui";

type FormStatus = {
  error: string | null;
};

function parseErrorMessage(status: number) {
  if (status === 409) return "Email already in use";
  if (status === 400) return "Password must be at least 8 characters";
  return "Unable to create account";
}

const formStyle: CSSProperties = {
  display: "grid",
  gap: "1rem",
  padding: "1.5rem",
  borderRadius: "24px",
  background: "rgba(255, 255, 255, 0.82)",
  border: "1px solid rgba(148, 163, 184, 0.24)",
  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.16)",
  backdropFilter: "blur(12px)",
};

const headerStyle: CSSProperties = {
  display: "grid",
  gap: "0.35rem",
  marginBottom: "0.25rem",
};

const eyebrowStyle: CSSProperties = {
  margin: 0,
  fontSize: "0.78rem",
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#475569",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
  lineHeight: 1.05,
  color: "#0f172a",
};

const leadStyle: CSSProperties = {
  margin: 0,
  maxWidth: "32rem",
  color: "#475569",
  lineHeight: 1.6,
};

const errorStyle: CSSProperties = {
  margin: 0,
  padding: "0.9rem 1rem",
  borderRadius: "14px",
  background: "rgba(239, 68, 68, 0.08)",
  color: "#b91c1c",
  border: "1px solid rgba(239, 68, 68, 0.2)",
  fontSize: "0.95rem",
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
  transition:
    "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
};

export function SignupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<FormStatus>({ error: null });
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      password: String(formData.get("password") ?? ""),
    };

    if (payload.password.length < 8) {
      setStatus({ error: "Password must be at least 8 characters" });
      return;
    }

    setStatus({ error: null });

    const response = await fetch("/api/member/auth/signup", {
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
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <form className="signup-form" style={formStyle} onSubmit={handleSubmit}>
      <div style={headerStyle}>
        <p style={eyebrowStyle}>Member access</p>
        <h2 style={titleStyle}>Create your account</h2>
        <p style={leadStyle}>
          Join the library, borrow books, and track your loans in one place.
        </p>
      </div>

      <FormField label="Name" name="name" autoComplete="name" placeholder="Your name" />
      <FormField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />
      <FormField
        label="Phone"
        name="phone"
        autoComplete="tel"
        placeholder="0900000000"
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        hint="Use at least 8 characters."
        placeholder="••••••••"
      />
      {status.error ? (
        <p role="alert" style={errorStyle}>
          {status.error}
        </p>
      ) : null}
      <button type="submit" disabled={isPending} style={buttonStyle}>
        {isPending ? "Creating account..." : "Create account"}
      </button>
      <style>{`
        .signup-form button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 16px 28px rgba(15, 23, 42, 0.26);
        }

        .signup-form button:disabled {
          opacity: 0.7;
          cursor: progress;
        }
      `}</style>
    </form>
  );
}
