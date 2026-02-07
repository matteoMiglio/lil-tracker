<template>
  <div class="flex flex-col gap-4">
    <DataTableToolbar
      :table="table"
      :filter-columns-list="filterColumnsList"
      :filter-column-search="filterColumnSearch"
    />

    <!-- Desktop table view -->
    <div class="hidden border rounded-md md:block">
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead
              v-for="header in headerGroup.headers"
              :key="header.id"
              class="text-center"
            >
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <template v-if="table.getRowModel().rows?.length">
            <TableRow
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              :data-state="row.getIsSelected() && 'selected'"
              class="h-10"
            >
              <TableCell
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="text-center"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </TableCell>
            </TableRow>
          </template>
          <template v-else>
            <TableRow>
              <TableCell :colspan="columns.length" class="h-24 text-center">
                Nessuna transazione ancora
              </TableCell>
            </TableRow>
          </template>
        </TableBody>
      </Table>
    </div>

    <!-- Mobile card view -->
    <div class="flex flex-col gap-3 md:hidden">
      <template v-if="table.getRowModel().rows?.length">
        <div
          v-for="row in table.getRowModel().rows"
          :key="row.id"
          class="p-4 border rounded-lg"
          :class="{ 'bg-muted/50': row.getIsSelected() }"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <Checkbox
                  :model-value="row.getIsSelected()"
                  @update:model-value="(v) => row.toggleSelected(!!v)"
                  aria-label="Seleziona riga"
                  class="shrink-0"
                />
                <p class="text-sm font-medium truncate">
                  {{ row.original.description || "-" }}
                </p>
              </div>
              <div class="flex items-center gap-2 mt-1 ml-6 text-xs text-muted-foreground">
                <span>{{ formatDateString(row.original.date ?? "") }}</span>
                <span>&middot;</span>
                <span>{{ row.original.time || "04:00" }}</span>
                <template v-if="row.original.category?.name">
                  <span>&middot;</span>
                  <Badge variant="secondary" class="text-xs">
                    {{ row.original.category.name }}
                  </Badge>
                </template>
              </div>
            </div>
            <span class="text-sm font-semibold whitespace-nowrap">
              {{ currencyFormatter.format(row.original.amount ?? 0) }}
            </span>
          </div>
        </div>
      </template>
      <div v-else class="py-8 text-sm text-center text-muted-foreground">
        Nessuna transazione ancora
      </div>
    </div>

    <DataTablePagination :table="table" />
  </div>
</template>

<script setup lang="ts">
import type {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/vue-table";
import {
  useVueTable,
  FlexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ref, toRef } from "vue";
import { valueUpdater } from "@/lib/utils";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { currencyFormatter, formatDateString } from "@/lib/formatters";
import DataTableToolbar from "./Toolbar.vue";
import DataTablePagination from "./Pagination.vue";
import type { Transaction } from "@/types/transaction";

import { columns } from "./columns";
import { filterColumnsList, filterColumnSearch } from "./filters";

const props = defineProps<{
  data: Transaction[];
}>();

const sorting = ref<SortingState>([
  {
    id: "date",
    desc: true,
  },
]);

const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});

const rowSelection = ref({});

const table = useVueTable({
  data: toRef(props, "data"),
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onRowSelectionChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, rowSelection),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
});
</script>
