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
import { Toaster } from "@/components/ui/sonner";
import MainNav from "@/components/MainNav.vue";
import OverviewChart from "@/components/overview-chart/Overview.vue";
import CategoriesChart from "@/components/categories-chart/Overview.vue";
import DataTable from "@/components/table/DataTable.vue";
import { DollarSign } from "lucide-vue-next";
import { currencyFormatter } from "@/lib/formatters";
import type { Transaction, TransactionKind } from "@/types/transaction";
import { useTransactionsStore } from "@/stores/transactions";
import { storeToRefs } from "pinia";

const store = useTransactionsStore();

const transactions = computed(() => store.transactions);

const incomes = computed(() => store.getIncomes);
const expenses = computed(() => store.getExpenses);

const totalRevenue = computed(() =>
  incomes.value.reduce((sum, income) => sum + income.amount, 0)
);

const totalExpenses = computed(() =>
  expenses.value.reduce((sum, expense) => sum + expense.amount, 0)
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
      <MainNav />
    </div>
    <div class="flex flex-col gap-4 px-6 py-4">
      <div class="flex items-center justify-between">
        <h2 class="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs default-value="overview" class="flex flex-col gap-4">
        <TabsList class="grid w-full grid-cols-3 md:w-72">
          <TabsTrigger value="overview"> Overview </TabsTrigger>
          <TabsTrigger value="incomes"> Entrate </TabsTrigger>
          <TabsTrigger value="expenses"> Uscite </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" class="mt-0">
          <div class="flex flex-col gap-4">
            <div class="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader
                  class="flex flex-row items-center justify-between pb-2 space-y-0"
                >
                  <CardTitle class="text-sm font-medium"> Bilancio </CardTitle>
                  <DollarSign class="size-4" />
                </CardHeader>
                <CardContent>
                  <div
                    class="text-2xl font-bold"
                    :class="{
                      'text-red-600': balance < 0,
                      'text-green-600': balance >= 0,
                    }"
                  >
                    {{ formattedBalance }}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader
                  class="flex flex-row items-center justify-between pb-2 space-y-0"
                >
                  <CardTitle class="text-sm font-medium">
                    Totale Entrate
                  </CardTitle>
                  <DollarSign class="text-green-600 size-4" />
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
                    Totale Uscite
                  </CardTitle>
                  <DollarSign class="text-red-600 size-4" />
                </CardHeader>
                <CardContent>
                  <div class="text-2xl font-bold">
                    {{ formattedTotalExpenses }}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card class="md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent class="pl-2">
                  <OverviewChart :incomes="incomes" :expenses="expenses" />
                </CardContent>
              </Card>
              <Card class="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Categorie</CardTitle>
                </CardHeader>
                <CardContent>
                  <CategoriesChart :transactions="transactions" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="incomes" class="mt-0">
          <DataTable :data="incomes" :title="'Entrate'" />
        </TabsContent>
        <TabsContent value="expenses" class="mt-0">
          <DataTable :data="expenses" :title="'Uscite'" />
        </TabsContent>
      </Tabs>
    </div>
  </div>
  <Toaster />
</template>
