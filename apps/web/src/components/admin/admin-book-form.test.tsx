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

  it("submits a new book to the admin API with a category select", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "book_1",
            title: "Existing",
            author: "Someone",
            category: "textbook",
            totalCopies: 2,
            availableCopies: 2,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          textbook: 3,
          general: 7,
          novel: 14,
          science: 21,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "book_2" }),
      });

    render(<AdminBookForm />);

    await waitFor(() => {
      expect(screen.getByRole("combobox", { name: /category/i })).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Distributed Systems" },
    });
    fireEvent.change(screen.getByLabelText(/author/i), {
      target: { value: "Tanenbaum" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /category/i }), {
      target: { value: "science" },
    });
    fireEvent.change(screen.getByLabelText(/total copies/i), {
      target: { value: "4" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /add book/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        "/api/admin/books",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  it("loads a book into the edit form and updates it", async () => {
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "book_1",
            title: "Old Title",
            author: "Old Author",
            category: "textbook",
            totalCopies: 3,
            availableCopies: 2,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          textbook: 3,
          general: 7,
          novel: 14,
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "book_1",
          title: "Updated Title",
          author: "Old Author",
          category: "general",
          totalCopies: 4,
          availableCopies: 3,
        }),
      });

    render(<AdminBookForm />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Title" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: /category/i }), {
      target: { value: "general" },
    });
    fireEvent.change(screen.getByLabelText(/total copies/i), {
      target: { value: "4" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /update book/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        3,
        "/api/admin/books/book_1",
        expect.objectContaining({
          method: "PUT",
        }),
      );
    });
  });

  it("shows the loan period reference", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        textbook: 3,
        general: 7,
        novel: 14,
      }),
    });

    render(<AdminBookForm />);

    expect(screen.getByText(/loan period reference/i)).toBeInTheDocument();
    expect(screen.getAllByText("textbook").length).toBeGreaterThan(0);
    expect(screen.getByText("3 days")).toBeInTheDocument();
    expect(screen.getAllByText("general").length).toBeGreaterThan(0);
    expect(screen.getByText("7 days")).toBeInTheDocument();
    expect(screen.getAllByText("novel").length).toBeGreaterThan(0);
    expect(screen.getByText("14 days")).toBeInTheDocument();
  });
});
