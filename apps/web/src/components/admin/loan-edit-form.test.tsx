// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoanEditForm } from "./loan-edit-form";

const fetchMock = vi.fn();

describe("LoanEditForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("submits loan updates to the admin api", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "loan_1" }),
    });

    render(
      <LoanEditForm
        loan={{
          id: "loan_1",
          loanDate: "2026-05-20T00:00:00.000Z",
          dueDate: "2026-05-23T00:00:00.000Z",
          returnDate: null,
        }}
      />,
    );

    fireEvent.submit(screen.getByRole("button", { name: /save loan/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/loans/loan_1", expect.any(Object));
    });
  });
});
