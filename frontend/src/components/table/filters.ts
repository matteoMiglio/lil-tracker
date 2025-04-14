import { computed } from "vue";
import type { Category } from "@/types/category";
import { useCategoriesStore } from "@/stores/categories";

const categories = computed(() => {
  const store = useCategoriesStore();
  return store.categories.map((category: Category) => ({
    value: category.id,
    label: category.name,
  }));
});

export const filterColumnsList = computed(() => [
  { column: "category", title: "Categorie", options: categories.value },
]);

export const filterColumnSearch = {
  column: "description",
  title: "descrizione",
};
