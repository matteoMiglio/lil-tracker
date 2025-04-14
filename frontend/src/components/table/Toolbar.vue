<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { ref, computed, watch } from "vue";
import DataTableFacetedFilter from "./FacedetFilter.vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, RotateCw, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { Transaction } from "@/types/transaction";
import { useTransactionsStore } from "@/stores/transactions";
import { formatLongDateString } from "@/lib/formatters";

const store = useTransactionsStore();

const props = defineProps<{
  table: Table<Transaction>;
  filterColumnsList?: Array<{ column: string; title: string; options: any }>;
  filterColumnSearch?: { column: string; title: string };
}>();

const isFiltered = computed(
  () => props.table.getState().columnFilters.length > 0
);

const deleteTransactions = () => {
  if (props.table.getSelectedRowModel().rows.length) {
    let error = null;
    props.table.getSelectedRowModel().rows.forEach((row) => {
      if (!row.original?.id) return;
      try {
        store.delete(row.original.id);
      } catch (err) {
        error = err;
        toast.error("Error", {
          description: "Something went wrong",
        });
      } finally {
        if (!error) {
          props.table.toggleAllRowsSelected(false);
          const now = new Date();
          toast.success("Transazioni cancellate", {
            description: formatLongDateString(now),
          });
        }
      }
    });
  } else {
    console.warn("No rows selected");
  }
};
</script>

<template>
  <div
    class="flex flex-row flex-wrap items-center justify-between gap-2 p-4 rounded-md shadow-sm bg-slate-50"
  >
    <div class="flex items-center flex-1 gap-4">
      <div v-if="props.filterColumnSearch">
        <Input
          :placeholder="`Cerca ${filterColumnSearch?.title}...`"
          :model-value="
            (table
              .getColumn(filterColumnSearch?.column ?? '')
              ?.getFilterValue() as string) ?? ''
          "
          class="h-8 w-[250px]"
          @input="
            table
              .getColumn(filterColumnSearch?.column ?? '')
              ?.setFilterValue($event.target.value)
          "
        />
      </div>
      <div class="flex flex-row gap-2" v-if="props.filterColumnsList">
        <template v-for="filter in filterColumnsList">
          <DataTableFacetedFilter
            v-if="table.getColumn(filter.column)"
            :key="filter.column"
            :column="table.getColumn(filter.column)"
            :title="filter.title"
            :options="filter.options"
          />
        </template>
      </div>

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <X class="ml-2 size-4" />
      </Button>
    </div>

    <div class="flex flex-row gap-2">
      <div v-if="table.getFilteredSelectedRowModel().rows.length">
        <Button
          variant="destructive"
          size="sm"
          class="h-8"
          @click="deleteTransactions"
        >
          Elimina righe
          <Trash2 class="size-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
