import { defineStore } from "pinia";
import type { Category } from "@/types/category";

const API_BASE_URL = "/api";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [] as Category[],
    newItem: {
      name: null,
    } as Omit<Category, "id">,
    errors: {} as { [key: string]: string },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async add() {
      try {
        console.debug("Adding new category");

        const response = await fetch(`${API_BASE_URL}/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.newItem),
        });

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante la creazione di una nuova categoria"
          );
        }

        const rawCategory = (await response.json()) as Category;

        this.categories.push(rawCategory);

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error.message);
        throw error.message;
      }
    },
    async delete(id: string) {
      console.debug("Deleting category:", id);
      try {
        const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
          method: "DELETE",
        });

        console.debug("Response Status:", response.status);

        if (response.status !== 204) {
          throw new Error("Failed to delete category");
        }

        this.categories = this.categories.filter((item) => item.id !== id);

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error);
      }
    },
    async update(updatedCategory: Category) {
      console.debug("Updating category:", updatedCategory.id);
      try {
        const response = await fetch(
          `${API_BASE_URL}/categories/${updatedCategory.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCategory),
          }
        );

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante l'aggiornamento della categoria"
          );
        }

        const updatedCategoryResponse = (await response.json()) as Category;

        const index = this.categories.findIndex(
          (item) => item.id === updatedCategory.id
        );
        if (index !== -1) {
          this.categories[index] = updatedCategoryResponse;
        }

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error);
      }
    },
    async fetchData() {
      this.loading = true;
      console.debug("Fetching categories...");

      try {
        // const categories: Category[] = generateFakeCategorys(20);
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories: Category[] = await response.json();

        console.info("Fetched", categories.length, "categories");

        this.categories = categories;

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error);
        throw new Error("Errore nel caricamento delle categorie");
      } finally {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    },
    resetNewItem() {
      this.newItem = {
        name: null,
      } as Omit<Category, "id">;
    },
  },
});
