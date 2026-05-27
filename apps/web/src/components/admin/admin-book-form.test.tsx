// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminBookForm } from "./admin-book-form";

const fetchMock = vi.fn();

describe("AdminBookForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("submits a book to the admin API", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "book_1" }),
    });

    render(<AdminBookForm />);
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Distributed Systems" },
    });
    fireEvent.change(screen.getByLabelText(/author/i), {
      target: { value: "Tanenbaum" },
    });
    fireEvent.change(screen.getByLabelText(/category/i), {
      target: { value: "textbook" },
    });
    fireEvent.change(screen.getByLabelText(/total copies/i), {
      target: { value: "4" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /add book/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/books", expect.any(Object));
    });
  });
});
