import { defineStore } from "pinia";
import type { Transaction } from "@/types/transaction";
import { generateFakeTransactions } from "@/lib/fakeData";

const API_BASE_URL = "/api";

export const useTransactionsStore = defineStore("transactions", {
  state: () => ({
    transactions: [] as Transaction[],
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
    async fetchData() {
      this.loading = true;
      console.debug("Fetching transactions...");
      try {
        const transactions: Transaction[] = generateFakeTransactions(1000);
        // const response = await fetch(`${API_BASE_URL}/transactions`);
        // const transactions: Transaction[] = await response.json();

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
  },
});
