import React from "react";
import { AdminBookForm } from "../../../../components/admin/admin-book-form";

export default function AdminBooksPage() {
  return (
    <main className="grid gap-4">
      <h1 className="text-2xl font-semibold">Books</h1>
      <AdminBookForm />
    </main>
  );
}
