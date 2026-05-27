// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CatalogTable } from "./catalog-table";

describe("CatalogTable", () => {
  it("renders book catalog columns", () => {
    render(
      <CatalogTable
        books={[
          {
            id: "book_1",
            title: "Distributed Systems",
            author: "Tanenbaum",
            category: "textbook",
            totalCopies: 4,
            availableCopies: 4,
          },
        ]}
      />,
    );

    expect(screen.getByText("Distributed Systems")).toBeInTheDocument();
    expect(screen.getByText("Tanenbaum")).toBeInTheDocument();
    expect(screen.getByText("textbook")).toBeInTheDocument();
    expect(screen.getAllByText("4")).toHaveLength(2);
  });
});
