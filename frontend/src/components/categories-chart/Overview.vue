<script setup lang="ts">
import type { Transaction } from "@/types/transaction";
import { BarChart } from "@/components/ui/chart-bar";
import CustomChartTooltip from "./CustomChartTooltip.vue";

const props = defineProps<{
  transactions: Transaction[];
}>();

// Group transactions by category and calculate the total for each category
const groupedByCategory = props.transactions.reduce(
  (acc, { categoryId, category, kind, amount }) => {
    const categoryKey = categoryId || "unspecified";
    if (!acc[categoryKey]) {
      acc[categoryKey] = {
        name: category?.name || "Non specificata",
        entrate: 0,
        uscite: 0,
      };
    }

    if (kind === "income") {
      acc[categoryKey].entrate += amount ?? 0;
    } else if (kind === "expense") {
      acc[categoryKey].uscite += amount ?? 0;
    }

    return acc;
  },
  {} as Record<string, { name: string; entrate: number; uscite: number }>
);

// Convert the grouped object into an array for the chart
const data = Object.values(groupedByCategory);
</script>

<template>
  <BarChart
    :data="data"
    :categories="['entrate', 'uscite']"
    index="name"
    :rounded-corners="4"
    :y-formatter="
      (tick, _i) => {
        return typeof tick === 'number'
          ? `€ ${new Intl.NumberFormat('it').format(tick).toString()}`
          : '';
      }
    "
    :custom-tooltip="CustomChartTooltip"
  />
</template>
