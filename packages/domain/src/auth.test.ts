import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "./auth";

describe("signup schema", () => {
  it("requires phone", () => {
    const result = signupSchema.safeParse({
      name: "Reader",
      email: "reader@example.com",
      password: "secret123",
    });

    expect(result.success).toBe(false);
  });
});

describe("login schema", () => {
  it("requires password", () => {
    const result = loginSchema.safeParse({
      email: "reader@example.com",
    });

    expect(result.success).toBe(false);
  });
});
