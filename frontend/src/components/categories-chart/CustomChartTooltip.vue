<script setup lang="ts">
import { Card, CardContent } from "@/components/ui/card";
import { currencyFormatter } from "@/lib/formatters";

defineProps<{
  title?: string;
  data: {
    name: string;
    color: string;
    value: number;
  }[];
}>();
</script>

<template>
  <Card class="text-sm">
    <CardContent class="p-3 min-w-[180px] flex flex-col gap-2">
      <template v-if="title">
        <div class="text-xl font-medium">
          {{ title }}
        </div>
      </template>
      <div
        v-for="(item, key) in data"
        :key="key"
        class="flex items-center justify-between"
      >
        <div class="flex items-center">
          <span
            class="w-1 mr-4 rounded-full h-7"
            :style="{ background: item.color }"
          />
          <span>{{ item.name }}</span>
        </div>
        <span class="ml-4 font-semibold">{{
          currencyFormatter.format(item.value ?? 0)
        }}</span>
      </div>
    </CardContent>
  </Card>
</template>
