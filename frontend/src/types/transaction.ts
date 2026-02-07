import type { Category } from "./category";
import type { Season } from "./season";
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
  seasonId?: string | null;
  season?: Season;
}

export { type Transaction, type TransactionKind };
