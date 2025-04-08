import { defineStore } from "pinia";
import type { Transaction } from "@/types/transaction";
import { generateFakeTransactions } from "@/lib/fakeData";

const API_BASE_URL = "/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
  }),
  actions: {
    async login(username: string, password: string): Promise<void> {
      try {
        console.debug("Logging in user");

        if (!username || !password) {
          throw new Error("Username and password are required");
        }

        // TODO: Remove this mock login logic
        if (username === "admin" && password === "admin") {
          this.isLoggedIn = true;
          return;
        }

        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error("Si è verificato un errore durante il login");
        }

        this.isLoggedIn = true;
      } catch (error: any) {
        console.error(error.message);
      }
    },
  },
});
