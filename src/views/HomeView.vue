<script setup lang="ts">
import { ref, computed } from "vue";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainNav from "@/components/MainNav.vue";
import Overview from "@/components/Overview.vue";
import RecentTransactions from "@/components/RecentTransactions.vue";
import type { Transaction, TransactionKind } from "@/types/transaction";
import { generateFakeTransactions } from "@/lib/fakeData";
import { DollarSign } from "lucide-vue-next";
import { currencyFormatter } from "@/lib/formatters";

const transactions: Transaction[] = generateFakeTransactions(10);

const incomes = transactions.filter(
  (transaction) => transaction.kind === "income"
);
const expenses = transactions.filter(
  (transaction) => transaction.kind === "expense"
);

const totalRevenue = ref(
  incomes.reduce((sum, income) => sum + income.amount, 0)
);
const totalExpenses = ref(
  expenses.reduce((sum, expense) => sum + expense.amount, 0)
);

const balance = computed(() => {
  return totalRevenue.value - totalExpenses.value;
});

const formattedBalance = computed(() =>
  currencyFormatter.format(balance.value)
);
const formattedTotalRevenue = computed(() =>
  currencyFormatter.format(totalRevenue.value)
);
const formattedTotalExpenses = computed(() =>
  currencyFormatter.format(totalExpenses.value)
);
</script>

<template>
  <div class="flex-col w-full h-full">
    <div class="border-b">
      <div class="flex items-center justify-center h-16 px-4">
        <MainNav class="mx-6" />
      </div>
    </div>
    <div class="flex-1 p-8 pt-6 space-y-4">
      <div class="flex items-center justify-between space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs default-value="overview" class="space-y-4">
        <TabsList>
          <TabsTrigger value="overview"> Overview </TabsTrigger>
          <TabsTrigger value="incomes" disabled> Incomes </TabsTrigger>
          <TabsTrigger value="expenses" disabled> Expenses </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" class="space-y-4">
          <div class="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader
                class="flex flex-row items-center justify-between pb-2 space-y-0"
              >
                <CardTitle class="text-sm font-medium"> Balance </CardTitle>
                <DollarSign class="size-4" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">{{ formattedBalance }}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                class="flex flex-row items-center justify-between pb-2 space-y-0"
              >
                <CardTitle class="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign class="text-green-400 size-4" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  {{ formattedTotalRevenue }}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                class="flex flex-row items-center justify-between pb-2 space-y-0"
              >
                <CardTitle class="text-sm font-medium">
                  Total Expenses
                </CardTitle>
                <DollarSign class="text-red-400 size-4" />
              </CardHeader>
              <CardContent>
                <div class="text-2xl font-bold">
                  {{ formattedTotalExpenses }}
                </div>
              </CardContent>
            </Card>
          </div>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card class="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent class="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card class="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentTransactions />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
