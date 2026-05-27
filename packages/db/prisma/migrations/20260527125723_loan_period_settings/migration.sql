-- CreateTable
CREATE TABLE "LoanPeriodSetting" (
    "id" TEXT NOT NULL,
    "category" "BookCategory" NOT NULL,
    "days" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoanPeriodSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoanPeriodSetting_category_key" ON "LoanPeriodSetting"("category");
