import React from "react";
import { AdminBookForm } from "../../../../components/admin/admin-book-form";
import { PageShell } from "../../../../components/layout/page-shell";

export default function AdminBooksPage() {
  return (
    <PageShell
      variant="admin"
      eyebrow="Inventory"
      title="Book management"
      description="Add new titles, set copy counts, and keep the catalog ready for members."
    >
      <AdminBookForm />
    </PageShell>
  );
}
