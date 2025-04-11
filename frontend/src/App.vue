<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";

import { useTransactionsStore } from "@/stores/transactions";
import { useCategoriesStore } from "@/stores/categories";

const store = useTransactionsStore();
const categoriesStore = useCategoriesStore();

onMounted(async () => {
  await store.fetchData();
  await categoriesStore.fetchData();
});
</script>

<template>
  <RouterView />
</template>
