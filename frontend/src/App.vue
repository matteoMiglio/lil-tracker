<script setup lang="ts">
import { RouterView } from "vue-router";
import { watch } from "vue";

import { useTransactionsStore } from "@/stores/transactions";
import { useCategoriesStore } from "@/stores/categories";
import { useAuthStore } from "@/stores/auth"; // Make sure this path is correct

const store = useTransactionsStore();
const categoriesStore = useCategoriesStore();
const authStore = useAuthStore();

// Watch for login status and fetch data when logged in
watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn) {
      const promises = [store.fetchData(), categoriesStore.fetchData()];
      await Promise.all(promises);
    }
  },
  { immediate: true }
);
</script>

<template>
  <RouterView />
</template>
