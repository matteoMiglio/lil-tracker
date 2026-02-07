import { defineStore } from "pinia";
import type { Category } from "@/types/category";
import { apiFetch } from "@/lib/api";

export const useCategoriesStore = defineStore("categories", {
  state: () => ({
    categories: [] as Category[],
    newItem: {
      name: "",
    } as Omit<Category, "id">,
    errors: {} as { [key: string]: string },
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async add() {
      this.loading = true;
      try {
        console.debug("Adding new category");

        const response = await apiFetch("/categories", {
          method: "POST",
          body: JSON.stringify(this.newItem),
        });

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante la creazione di una nuova categoria",
          );
        }

        const rawCategory = (await response.json()) as Category;

        this.categories.push(rawCategory);

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error.message);
        throw error.message;
      } finally {
        this.loading = false;
      }
    },
    async delete(id: string) {
      this.loading = true;
      console.debug("Deleting category:", id);
      try {
        const response = await apiFetch(`/categories/${id}`, {
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
      } finally {
        this.loading = false;
      }
    },
    async update(updatedCategory: Category) {
      this.loading = true;
      console.debug("Updating category:", updatedCategory.id);
      try {
        const response = await apiFetch(
          `/categories/${updatedCategory.id}`,
          {
            method: "PUT",
            body: JSON.stringify(updatedCategory),
          },
        );

        console.debug("Response Status:", response.status);

        if (!response.ok) {
          throw new Error(
            "Si è verificato un errore durante l'aggiornamento della categoria",
          );
        }

        const updatedCategoryResponse = (await response.json()) as Category;

        const index = this.categories.findIndex(
          (item) => item.id === updatedCategory.id,
        );
        if (index !== -1) {
          this.categories[index] = updatedCategoryResponse;
        }

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      this.loading = true;
      console.debug("Fetching categories...");

      try {
        const response = await apiFetch("/categories");
        const categories: Category[] = await response.json();

        console.info("Fetched", categories.length, "categories");

        this.categories = categories;

        this.error = null;
      } catch (error: any) {
        this.error = error;
        console.error(error);
        throw new Error("Errore nel caricamento delle categorie");
      } finally {
        this.loading = false;
      }
    },
    resetNewItem() {
      this.newItem = {
        name: "",
      } as Omit<Category, "id">;
    },
  },
});
