import type { Category } from "./category";
type TransactionKind = "income" | "expense";

interface Transaction {
  id: string;
  amount: number | null;
  date: string | null;
  time: string | null;
  description: string | null;
  kind: TransactionKind;
  categoryId?: string | null;
  category?: Category;
}

export { type Transaction, type TransactionKind };
