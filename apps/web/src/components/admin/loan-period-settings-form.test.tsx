// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoanPeriodSettingsForm } from "./loan-period-settings-form";

const fetchMock = vi.fn();

describe("LoanPeriodSettingsForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("loads existing categories and saves a new one", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        textbook: 3,
        general: 7,
        novel: 14,
      }),
    });
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<LoanPeriodSettingsForm />);

    await waitFor(() => {
      expect(screen.getAllByLabelText(/category name/i)).toHaveLength(3);
      expect(screen.getAllByLabelText(/loan days/i)).toHaveLength(3);
    });

    fireEvent.click(screen.getByRole("button", { name: /add category/i }));

    await waitFor(() => {
      expect(screen.getAllByLabelText(/category name/i)).toHaveLength(4);
    });

    const categoryInputs = screen.getAllByLabelText(/category name/i);
    const daysInputs = screen.getAllByLabelText(/loan days/i);

    fireEvent.change(categoryInputs[3], {
      target: { value: "science" },
    });
    fireEvent.change(daysInputs[3], {
      target: { value: "21" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /save categories/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        "/api/admin/loan-periods",
        expect.objectContaining({
          method: "PATCH",
        }),
      );
    });
  });
});
