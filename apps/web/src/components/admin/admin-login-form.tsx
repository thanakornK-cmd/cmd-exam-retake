"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@library/ui";

type FormStatus = {
  error: string | null;
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
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <FormField label="Username" name="username" />
      <FormField label="Password" name="password" type="password" />
      {status.error ? <p role="alert">{status.error}</p> : null}
      <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Admin log in"}
      </button>
    </form>
  );
}
