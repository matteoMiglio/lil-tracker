import { faker } from "@faker-js/faker";
import type { Transaction, TransactionKind } from "@/types/transaction";

export function generateFakeTransaction(): Transaction {
  return {
    id: faker.string.uuid(),
    amount: parseFloat(faker.finance.amount({ min: 5, max: 500, dec: 2 })),
    date: faker.date.recent({ days: 90 }).toISOString(),
    description: faker.lorem.sentence(),
    kind: faker.helpers.arrayElement<TransactionKind>(["income", "expense"]),
  };
}

export function generateFakeTransactions(count = 10): Transaction[] {
  return Array.from({ length: count }, generateFakeTransaction);
}
