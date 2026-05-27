// @vitest-environment jsdom
import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SignupForm } from "./signup-form";

const pushMock = vi.fn();
const refreshMock = vi.fn();
const fetchMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("SignupForm", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    pushMock.mockReset();
    refreshMock.mockReset();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  it("renders required signup fields", () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("submits signup and redirects to login", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "member_1" }),
    });

    render(<SignupForm />);
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Reader" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "reader@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: "0123456789" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "secret123" },
    });
    fireEvent.submit(screen.getByRole("button", { name: /create account/i }).closest("form")!);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/member/auth/signup", expect.any(Object));
      expect(pushMock).toHaveBeenCalledWith("/login");
      expect(refreshMock).toHaveBeenCalled();
    });
  });
});
