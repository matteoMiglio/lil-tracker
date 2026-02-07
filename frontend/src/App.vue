<script setup lang="ts">
import { RouterView } from "vue-router";
import { watch } from "vue";

import { useTransactionsStore } from "@/stores/transactions";
import { useCategoriesStore } from "@/stores/categories";
import { useSeasonsStore } from "@/stores/seasons";
import { useAuthStore } from "@/stores/auth";

const store = useTransactionsStore();
const categoriesStore = useCategoriesStore();
const seasonsStore = useSeasonsStore();
const authStore = useAuthStore();

watch(
  () => authStore.isLoggedIn,
  async (isLoggedIn) => {
    if (isLoggedIn) {
      await Promise.all([seasonsStore.fetchData(), categoriesStore.fetchData()]);
      const activeSeason = seasonsStore.activeSeason;
      await store.fetchData(activeSeason?.id);
    }
  },
  { immediate: true },
);
</script>

<template>
  <RouterView />
</template>
