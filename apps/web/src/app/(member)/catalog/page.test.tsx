// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CatalogPage from "./page";

const fetchMock = vi.fn();

vi.mock("../../../components/member/member-logout-button", () => ({
  MemberLogoutButton: () => <div>logout</div>,
}));

vi.mock("../../../components/layout/page-shell", () => ({
  PageShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe("CatalogPage search", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    fetchMock.mockReset();
    fetchMock
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "book_1",
            title: "Distributed Systems",
            author: "Tanenbaum",
            category: "textbook",
            totalCopies: 4,
            availableCopies: 4,
          },
          {
            id: "book_2",
            title: "Clean Code",
            author: "Robert C. Martin",
            category: "general",
            totalCopies: 2,
            availableCopies: 2,
          },
        ],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "loan_1",
            status: "ACTIVE",
            book: { id: "book_2" },
          },
        ],
      });
    vi.stubGlobal("fetch", fetchMock);
  });

  it("filters catalog rows by search keyword", async () => {
    render(<CatalogPage />);

    await waitFor(() => {
      expect(screen.getByText("Distributed Systems")).toBeInTheDocument();
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/search by title/i), {
      target: { value: "clean" },
    });

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.queryByText("Distributed Systems")).toBeNull();
  });
});
