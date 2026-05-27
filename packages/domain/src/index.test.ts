import { describe, expect, it } from "vitest";
import { MAX_ACTIVE_LOANS } from "./contracts";

describe("workspace wiring", () => {
  it("loads the domain package", () => {
    expect(MAX_ACTIVE_LOANS).toBe(3);
  });
});
