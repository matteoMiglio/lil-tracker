<script setup lang="ts">
import { BarChart } from "@/components/ui/chart-bar";
import type { Transaction } from "@/types/transaction";
import { computed } from "vue";
import CustomChartTooltip from "./CustomChartTooltip.vue";

const props = defineProps<{
  incomes: Transaction[];
  expenses: Transaction[];
}>();

function groupByMonth(transactions: Transaction[]) {
  const months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ];

  const monthlyTotals = Array(12).fill(0);

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date ?? "");
    if (!isNaN(date.getTime())) {
      const monthIndex = date.getMonth();
      monthlyTotals[monthIndex] += Number(transaction.amount);
    }
  });

  return months.map((name, index) => ({
    name,
    total: monthlyTotals[index],
  }));
}

const data = computed(() => {
  const incomesByMonth = groupByMonth(props.incomes);
  const expensesByMonth = groupByMonth(props.expenses);

  return incomesByMonth
    .map((income, index) => ({
      name: income.name,
      entrate: income.total,
      uscite: expensesByMonth[index]?.total || 0,
    }))
    .filter((item) => item.entrate > 0 || item.uscite > 0);
});
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
