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

  it("loads current settings and saves updates", async () => {
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
      json: async () => ({
        textbook: 5,
        general: 8,
        novel: 21,
      }),
    });

    render(<LoanPeriodSettingsForm />);

    await waitFor(() => {
      expect(screen.getByLabelText(/textbook/i)).toHaveValue(3);
      expect(screen.getByLabelText(/general/i)).toHaveValue(7);
      expect(screen.getByLabelText(/novel/i)).toHaveValue(14);
    });

    fireEvent.change(screen.getByLabelText(/textbook/i), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText(/general/i), {
      target: { value: "8" },
    });
    fireEvent.change(screen.getByLabelText(/novel/i), {
      target: { value: "21" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /save loan periods/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/loan-periods", expect.any(Object));
    });
  });
});
