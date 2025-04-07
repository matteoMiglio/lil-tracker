<script setup lang="ts">
import { RouterView } from "vue-router";
import { onMounted } from "vue";

import { useTransactionsStore } from "@/stores/transactions";

const store = useTransactionsStore();

onMounted(async () => {
  await store.fetchData();
});
</script>

<template>
  <RouterView />
</template>
