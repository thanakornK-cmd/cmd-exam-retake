import { beforeAll, describe, expect, it } from "vitest";
import { createAdminSession } from "./admin-session";

describe("admin session", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "405311474ad981484b0832b26499f947ec7ac6c3d6ff682404ae514279714460";
  });

  it("creates an admin token", async () => {
    await expect(createAdminSession("admin")).resolves.toBeTypeOf("string");
  });
});
