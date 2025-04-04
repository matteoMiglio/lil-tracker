<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Transaction } from "@/types/transaction";
import { formatDate } from "date-fns";

const props = defineProps<{
  transactions: Transaction[];
}>();

const format = (date: string) => {
  const parsedDate = new Date(date);
  return formatDate(parsedDate, "dd/MM/yyyy");
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex items-center justify-between"
      v-for="transaction in transactions"
    >
      <div>{{ format(transaction.date) }}</div>
      <div>{{ transaction.kind }}</div>
      <div class="font-medium">{{ transaction.amount }} €</div>
    </div>
  </div>
</template>
