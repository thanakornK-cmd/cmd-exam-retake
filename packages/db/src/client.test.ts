import { describe, expect, it } from "vitest";
import { prisma } from "./client";

describe("db client", () => {
  it("exports a prisma client", () => {
    expect(prisma).toBeDefined();
  });
});
