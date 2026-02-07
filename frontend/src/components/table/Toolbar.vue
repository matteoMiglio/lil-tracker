<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { computed, ref } from "vue";
import DataTableFacetedFilter from "./FacedetFilter.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Trash2 } from "lucide-vue-next";
import { toast } from "vue-sonner";
import type { Transaction } from "@/types/transaction";
import { useTransactionsStore } from "@/stores/transactions";
import { storeToRefs } from "pinia";
import { formatLongDateString } from "@/lib/formatters";

const store = useTransactionsStore();
const { loading } = storeToRefs(store);

const isConfirmOpen = ref(false);

const props = defineProps<{
  table: Table<Transaction>;
  filterColumnsList?: Array<{ column: string; title: string; options: { value: string; label: string }[] }>;
  filterColumnSearch?: { column: string; title: string };
}>();

const isFiltered = computed(
  () => props.table.getState().columnFilters.length > 0
);

const selectedCount = computed(
  () => props.table.getFilteredSelectedRowModel().rows.length,
);

function promptDeleteTransactions() {
  isConfirmOpen.value = true;
}

const deleteTransactions = async () => {
  const rows = props.table.getSelectedRowModel().rows;
  if (!rows.length) return;

  try {
    for (const row of rows) {
      if (!row.original?.id) continue;
      await store.delete(row.original.id);
    }
    props.table.toggleAllRowsSelected(false);
    toast.success("Transazioni cancellate", {
      description: formatLongDateString(new Date().toISOString()),
    });
  } catch {
    toast.error("Errore", {
      description: "Qualcosa è andato storto",
    });
  } finally {
    isConfirmOpen.value = false;
  }
};
</script>

<template>
  <div
    class="flex flex-row flex-wrap items-center justify-between gap-2 p-4 rounded-md shadow-sm bg-muted"
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
          class="h-8 w-full md:w-[250px]"
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
      <div v-if="selectedCount">
        <Button
          variant="destructive"
          size="sm"
          class="h-8"
          :disabled="loading"
          @click="promptDeleteTransactions"
        >
          Elimina righe ({{ selectedCount }})
          <Trash2 class="size-4" />
        </Button>
      </div>
    </div>
  </div>
  <ConfirmDialog
    :open="isConfirmOpen"
    title="Eliminare transazioni?"
    :description="`Verranno eliminate ${selectedCount} transazioni. Questa azione non può essere annullata.`"
    :loading="loading"
    @update:open="isConfirmOpen = $event"
    @confirm="deleteTransactions"
  />
</template>
