// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoanList } from "./loan-list";

describe("LoanList", () => {
  it("shows loan date, due date, and overdue state", () => {
    render(
      <LoanList
        loans={[
          {
            id: "loan_1",
            loanCode: "LN-20260527-0001",
            loanDate: "2026-05-27T00:00:00.000Z",
            dueDate: "2026-06-10T00:00:00.000Z",
            returnDate: null,
            status: "OVERDUE",
            fineAmount: 20,
            book: { title: "Clean Code" },
          },
        ]}
      />,
    );

    expect(screen.getByText(/loan date/i)).toBeInTheDocument();
    expect(screen.getByText(/due date/i)).toBeInTheDocument();
    expect(screen.getByText(/overdue/i)).toBeInTheDocument();
  });
});
