import { BOOK_LOAN_PERIOD_DAYS, FINE_PER_OVERDUE_WEEKDAY } from "./contracts";

type LoanCategory = keyof typeof BOOK_LOAN_PERIOD_DAYS;

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatUtcDate(date: Date) {
  return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}`;
}

export function calculateDueDate(loanDate: Date, category: LoanCategory) {
  return addDays(loanDate, BOOK_LOAN_PERIOD_DAYS[category]);
}

export function countOverdueWeekdays(dueDate: Date, returnDate: Date) {
  if (returnDate <= dueDate) {
    return 0;
  }

  let count = 0;
  const cursor = addDays(dueDate, 1);

  while (cursor <= returnDate) {
    const day = cursor.getUTCDay();
    if (day !== 0 && day !== 6) {
      count += 1;
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return count;
}

export function calculateFineAmount(dueDate: Date, returnDate: Date) {
  return countOverdueWeekdays(dueDate, returnDate) * FINE_PER_OVERDUE_WEEKDAY;
}

export function generateLoanCode(now: Date, sequence: number) {
  return `LN-${formatUtcDate(now)}-${String(sequence).padStart(4, "0")}`;
}
