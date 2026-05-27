import { describe, expect, it } from "vitest";
import {
  calculateDueDate,
  calculateFineAmount,
  countOverdueWeekdays,
  generateLoanCode,
} from "./loans";

describe("loan rules", () => {
  it("sets novel due date to 14 days later", () => {
    expect(calculateDueDate(new Date("2026-05-27T00:00:00Z"), "novel").toISOString()).toBe(
      "2026-06-10T00:00:00.000Z",
    );
  });

  it("counts Friday due date returned Monday as one overdue weekday", () => {
    expect(
      countOverdueWeekdays(
        new Date("2026-05-22T00:00:00Z"),
        new Date("2026-05-25T00:00:00Z"),
      ),
    ).toBe(1);
  });

  it("calculates a 20 THB fine for one overdue weekday", () => {
    expect(
      calculateFineAmount(
        new Date("2026-05-22T00:00:00Z"),
        new Date("2026-05-25T00:00:00Z"),
      ),
    ).toBe(20);
  });

  it("generates a dated loan code", () => {
    expect(generateLoanCode(new Date("2026-05-27T00:00:00Z"), 7)).toBe("LN-20260527-0007");
  });
});
