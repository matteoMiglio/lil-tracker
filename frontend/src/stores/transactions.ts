import { defineStore } from "pinia";
import type { Transaction } from "@/types/transaction";
import { apiFetch } from "@/lib/api";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as Transaction[],
    newItem: {
      amount: null,
      date: null,
      time: null,
      description: null,
      kind: "expense",
      categoryId: null,
    } as Omit<Transaction, "id">,
    errors: {} as { [key: string]: string },
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getIncomes(state) {
      return state.transactions.filter(
        (transaction) => transaction.kind === "income",
      );
    },
    getExpenses(state) {
      return state.transactions.filter(
        (transaction) => transaction.kind === "expense",
      );
    },
  },
  actions: {
    async add() {
      this.loading = true;
      try {
        console.debug("Adding new transaction");

        const response = await apiFetch("/transactions", {
          method: "POST",
          body: JSON.stringify(this.newItem),
        });

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante la creazione di una nuova transazione",
          );
        }

        const rawTransaction = (await response.json()) as Transaction;

        this.transactions.push(rawTransaction);

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
        throw message;
      } finally {
        this.loading = false;
      }
    },
    async delete(id: string) {
      this.loading = true;
      console.debug("Deleting transaction:", id);
      try {
        const response = await apiFetch(`/transactions/${id}`, {
          method: "DELETE",
        });

        console.debug("Response Status:", response.status);

        if (response.status !== 204) {
          throw new Error("Failed to delete transaction");
        }

        this.transactions = this.transactions.filter((item) => item.id !== id);

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      this.loading = true;
      console.debug("Fetching transactions...");

      try {
        const response = await apiFetch("/transactions");
        const transactions: Transaction[] = await response.json();

        console.info("Fetched", transactions.length, "transactions");

        this.transactions = transactions;

        this.error = null;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.error = message;
        console.error(message);
        throw new Error("Errore nel caricamento delle prenotazioni");
      } finally {
        this.loading = false;
      }
    },
    resetNewItem() {
      this.newItem = {
        amount: null,
        date: null,
        time: null,
        description: null,
        kind: "expense",
        categoryId: null,
      } as Omit<Transaction, "id">;
    },
  },
});
