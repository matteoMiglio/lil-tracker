import { h } from "vue";
import { ArrowUpDown } from "lucide-vue-next";
import type { ColumnDef } from "@tanstack/vue-table";
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
    accessorKey: "date",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Data", h(ArrowUpDown, { class: "size-4" })]
      );
    },
    cell: ({ row }) => {
      return h("div", formatDateString(row.getValue("date")));
    },
  },
  {
    accessorKey: "time",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Orario", h(ArrowUpDown, { class: "size-4" })]
      );
    },
    cell: ({ row }) => {
      const time = row.getValue("time");
      if (!time) {
        return h("div", "04:00");
      } else {
        return h("div", time);
      }
    },
  },
  {
    accessorKey: "id",
    filterFn: "includesString",
    header: () => h("div", "ID"),
    cell: ({ row }) => {
      return h("div", row.getValue("id"));
    },
  },
  {
    accessorKey: "description",
    filterFn: "includesString",
    header: () => h("div", "Descrizione"),
    cell: ({ row }) => {
      const description = row.original.description;
      if (!description) {
        return h("div", "-");
      }
      if (description.length > 50) {
        return h("div", description.slice(0, 50) + "...");
      }
      return h("div", description);
    },
  },
  {
    accessorKey: "category",
    filterFn: (row, _id, value) => {
      return value.includes(row.original.category?.id);
    },
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Categoria", h(ArrowUpDown, { class: "size-4" })]
      );
    },
    cell: ({ row }) => {
      const category = row.original.category?.name;

      if (!category) {
        return h("div", "-");
      }

      return h("div", category);
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
        () => ["Ammontare", h(ArrowUpDown, { class: "size-4" })]
      );
    },
    cell: ({ row }) => {
      return h("div", currencyFormatter.format(row.original.amount ?? 0));
    },
  },
];
