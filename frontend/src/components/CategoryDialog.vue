<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/category";
import { ref, watch } from "vue";

const props = defineProps<{
  category: Category | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "save", editingCategory: Category): void;
  (e: "update:isOpen", isOpen: boolean): void;
}>();

function emitOpenChange() {
  emit("update:isOpen", !props.isOpen);
}

const editingCategory = ref<Category | null>(null);

watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      editingCategory.value = { ...newCategory };
    } else {
      editingCategory.value = null;
    }
  },
  { immediate: true }
);

function handleSave() {
  if (editingCategory.value) {
    emit("save", editingCategory.value);
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="emitOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit Category</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid items-center grid-cols-4 gap-4">
          <Label for="name" class="text-right"> Name </Label>
          <Input id="name" v-model="editingCategory!.name" class="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="handleSave"> Save </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
