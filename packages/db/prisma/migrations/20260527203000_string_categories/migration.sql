-- Convert book categories from enum to text
ALTER TABLE "Book"
  ALTER COLUMN "category" TYPE TEXT USING "category"::text;

-- Convert loan period categories from enum to text
ALTER TABLE "LoanPeriodSetting"
  ALTER COLUMN "category" TYPE TEXT USING "category"::text;

-- Drop the old enum now that nothing depends on it
DROP TYPE IF EXISTS "BookCategory";
