// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LoginForm } from "./login-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();
const fetchMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("LoginForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("submits login and redirects to catalog", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    render(<LoginForm />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "reader@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /log in/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/member/auth/login", expect.any(Object));
      expect(pushMock).toHaveBeenCalledWith("/catalog");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
