type TransactionKind = "income" | "expense";

interface Transaction {
  id: string;
  amount: number | null;
  date: string | null;
  description: string | null;
  kind: TransactionKind;
}

export { type Transaction, type TransactionKind };
