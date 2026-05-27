// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AdminLoginForm } from "./admin-login-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();
const fetchMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("AdminLoginForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("submits admin login and redirects to dashboard", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<AdminLoginForm />);
    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "admin" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "securepassword" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /admin log in/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/admin/auth/login", expect.any(Object));
      expect(pushMock).toHaveBeenCalledWith("/admin/dashboard");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
