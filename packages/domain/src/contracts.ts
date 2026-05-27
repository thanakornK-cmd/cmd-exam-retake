export const MAX_ACTIVE_LOANS = 3;
export const FINE_PER_OVERDUE_WEEKDAY = 20;

export const BOOK_CATEGORIES = ["textbook", "general", "novel"] as const;

export const BOOK_LOAN_PERIOD_DAYS = {
  textbook: 3,
  general: 7,
  novel: 14,
} as const;

export type BookLoanPeriodDays = typeof BOOK_LOAN_PERIOD_DAYS;

export type LoanPeriodMap = Record<string, number>;
