import { defineStore } from "pinia";
import type { Transaction } from "@/types/transaction";
import { generateFakeTransactions } from "@/lib/fakeData";

const API_BASE_URL = "/api";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as Transaction[],
    newItem: {
      amount: null,
      date: null,
      description: null,
      kind: "expense",
    } as Omit<Transaction, "id">,
    errors: {} as { [key: string]: string },
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getIncomes(state) {
      return state.transactions.filter(
        (transaction) => transaction.kind === "income"
      );
    },
    getExpenses(state) {
      return state.transactions.filter(
        (transaction) => transaction.kind === "expense"
      );
    },
  },
  actions: {
    async add() {
      try {
        console.debug("Adding new transaction");

        const response = await fetch(`${API_BASE_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newItem),
        });

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante la creazione di una nuova transazione"
          );
        }

        const rawTransaction = (await response.json()) as Transaction;

        this.transactions.push(rawTransaction);

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error.message);
        throw error.message;
      }
    },
    async delete(id: string) {
      console.debug("Deleting transaction:", id);
      try {
        const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
          method: "DELETE",
        });

        console.debug("Response Status:", response.status);

        if (response.status !== 204) {
          throw new Error("Failed to delete transaction");
        }

        this.transactions = this.transactions.filter((item) => item.id !== id);

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error);
      }
    },
    async fetchData() {
      this.loading = true;
      console.debug("Fetching transactions...");

      try {
        // const transactions: Transaction[] = generateFakeTransactions(2);
        const response = await fetch(`${API_BASE_URL}/transactions`);
        const transactions: Transaction[] = await response.json();

        console.info("Fetched", transactions.length, "transactions");

        this.transactions = transactions;

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error);
        throw new Error("Errore nel caricamento delle prenotazioni");
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    },
    resetNewItem() {
      this.newItem = {
        amount: null,
        date: null,
        description: null,
        kind: "expense",
      } as Omit<Transaction, "id">;
    },
  },
});
