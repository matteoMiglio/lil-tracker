-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL,
    "date" TEXT,
    "description" TEXT,
    "kind" TEXT NOT NULL
);
