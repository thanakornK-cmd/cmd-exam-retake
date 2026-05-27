"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    setError(null);

    const response = await fetch("/api/admin/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      setError("Unable to log out");
      return;
    }

    startTransition(() => {
      router.push("/admin/login");
      router.refresh();
    });
  }

  return (
    <div style={{ display: "grid", gap: "0.65rem" }}>
      <button type="button" onClick={handleLogout} disabled={isPending}>
        {isPending ? "Logging out..." : "Log out"}
      </button>
      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
