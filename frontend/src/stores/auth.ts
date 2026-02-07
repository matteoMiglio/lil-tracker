import { defineStore } from "pinia";
import { apiFetch } from "@/lib/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: !!localStorage.getItem("auth_token"),
  }),
  actions: {
    async login(username: string, password: string): Promise<void> {
      console.debug("Logging in user");

      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      const response = await apiFetch("/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      console.debug("Response Status:", response.status);

      if (!response.ok) {
        throw new Error("Si è verificato un errore durante il login");
      }

      const data = (await response.json()) as { token: string };
      localStorage.setItem("auth_token", data.token);
      this.isLoggedIn = true;
    },
    logout() {
      localStorage.removeItem("auth_token");
      this.isLoggedIn = false;
    },
  },
});
