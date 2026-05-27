"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@library/ui";

type FormStatus = {
  error: string | null;
};

function parseErrorMessage(status: number) {
  if (status === 401) return "Invalid credentials";
  return "Unable to log in";
}

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
      setStatus({ error: parseErrorMessage(response.status) });
      return;
    }

    startTransition(() => {
      router.push("/catalog");
      router.refresh();
    });
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <FormField label="Email" name="email" type="email" />
      <FormField label="Password" name="password" type="password" />
      {status.error ? <p role="alert">{status.error}</p> : null}
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
