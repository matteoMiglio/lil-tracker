<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Transaction } from "@/types/transaction";
import { currencyFormatter, formatDateString } from "@/lib/formatters";

const props = defineProps<{
  transactions: Transaction[];
}>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex items-center justify-between"
      v-for="transaction in transactions"
    >
      <div>{{ formatDateString(transaction.date) }}</div>
      <div>{{ transaction.kind }}</div>
      <div class="font-medium">
        {{ currencyFormatter.format(transaction.amount) }}
      </div>
    </div>
  </div>
</template>
