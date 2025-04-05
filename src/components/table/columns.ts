import { h } from "vue";
import { ArrowUpDown } from "lucide-vue-next";
import type { ColumnDef, Row } from "@tanstack/vue-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { currencyFormatter, formatDateString } from "@/lib/formatters";
import type { Transaction } from "@/types/transaction";

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value) =>
          table.toggleAllPageRowsSelected(!!value),
        ariaLabel: "Select all",
        class: "translate-y-0.5",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value) => row.toggleSelected(!!value),
        ariaLabel: "Select row",
        class: "translate-y-0.5",
      }),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "date",
    accessorFn: (row) => row.date,
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Data", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      return h("div", formatDateString(row.getValue("date")));
    },
  },
  {
    accessorKey: "id",
    header: () => h("div", "ID"),
    cell: ({ row }) => {
      return h("div", row.getValue("id"));
    },
  },
  {
    accessorKey: "description",
    header: () => h("div", "Descrizione"),
    cell: ({ row }) => {
      return h("div", row.getValue("description"));
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Ammontare", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
      );
    },
    cell: ({ row }) => {
      return h("div", currencyFormatter.format(row.original.amount));
    },
  },
];
