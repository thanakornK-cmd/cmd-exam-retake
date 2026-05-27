"use client";

import React, { useState, useTransition } from "react";
import { FormField } from "@library/ui";

type FormStatus = {
  error: string | null;
  success: string | null;
};

export function AdminBookForm() {
  const [status, setStatus] = useState<FormStatus>({ error: null, success: null });
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const formData = new FormData(event.currentTarget);
    const payload = {
      title: String(formData.get("title") ?? ""),
      author: String(formData.get("author") ?? ""),
      category: String(formData.get("category") ?? ""),
      totalCopies: Number(formData.get("totalCopies") ?? 0),
    };

    setStatus({ error: null, success: null });

    const response = await fetch("/api/admin/books", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus({ error: "Unable to add book", success: null });
      return;
    }

    startTransition(() => {
      setStatus({ error: null, success: "Book added" });
    });

    form.reset();
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <FormField label="Title" name="title" />
      <FormField label="Author" name="author" />
      <label className="grid gap-2 text-sm font-medium">
        <span>Category</span>
        <select name="category" className="rounded border border-slate-300 px-3 py-2" defaultValue="textbook">
          <option value="textbook">textbook</option>
          <option value="general">general</option>
          <option value="novel">novel</option>
        </select>
      </label>
      <FormField label="Total copies" name="totalCopies" type="number" min="1" step="1" />
      {status.error ? <p role="alert">{status.error}</p> : null}
      {status.success ? <p role="status">{status.success}</p> : null}
      <button type="submit" disabled={isPending}>
        {isPending ? "Adding book..." : "Add book"}
      </button>
    </form>
  );
}
