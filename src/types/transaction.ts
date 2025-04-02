type TransactionKind = "income" | "expense";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  kind: TransactionKind;
}

export { type Transaction, type TransactionKind };
