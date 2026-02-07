<template>
  <div class="flex-col w-full h-full">
    <div class="border-b">
      <MainNav />
    </div>
    <div class="flex flex-col w-full h-full gap-4 p-8">
      <!-- Add Category Card -->
      <Card>
        <CardHeader>
          <CardTitle> Aggiungi una categoria </CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleAddCategory" class="space-y-4">
            <div class="flex gap-2">
              <div class="flex-1">
                <label for="category" class="sr-only">Category Name</label>
                <Input
                  id="category"
                  type="text"
                  placeholder="Nome"
                  v-model="newItem.name"
                />
              </div>
              <Button type="submit" :disabled="loading">
                <Loader2 v-if="loading" class="size-4 animate-spin" />
                <Plus v-else class="size-4" />
                Aggiungi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <!-- Categories Table Card -->
      <Card>
        <CardHeader>
          <CardTitle> Categories </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead class="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="categories && categories.length">
                <TableRow v-for="category in categories" :key="category.id">
                  <TableCell>{{ category.name }}</TableCell>
                  <TableCell class="flex items-center justify-end gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      :disabled="loading"
                      @click="openEditDialog(category)"
                    >
                      <Edit class="size-4" />
                      <span class="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      :disabled="loading"
                      @click="promptDeleteCategory(category.id)"
                    >
                      <Trash2 class="size-4" />
                      <span class="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow>
                  <TableCell :colspan="2" class="h-24 text-center">
                    Nessuna categoria trovata. Aggiungi una nuova categoria!
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
  <CategoryDialog
    :is-open="isDialogOpen"
    :category="editingCategory"
    @update:isOpen="isDialogOpen = $event"
    @save="handleEditCategory"
  />
  <ConfirmDialog
    :open="isConfirmOpen"
    title="Eliminare categoria?"
    description="La categoria verrà eliminata. Questa azione non può essere annullata."
    :loading="loading"
    @update:open="isConfirmOpen = $event"
    @confirm="confirmDeleteCategory"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainNav from "@/components/MainNav.vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Loader2 } from "lucide-vue-next";
import type { Category } from "@/types/category";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryDialog from "@/components/CategoryDialog.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useCategoriesStore } from "@/stores/categories";
import { storeToRefs } from "pinia";

const categoriesStore = useCategoriesStore();
const { categories, newItem, loading } = storeToRefs(categoriesStore);

const editingCategory = ref<Category | null>(null);
const isDialogOpen = ref(false);

const deleteTargetId = ref<string | null>(null);
const isConfirmOpen = ref(false);

function handleAddCategory() {
  if (newItem.value.name.trim() === "") return;

  categoriesStore.add();
  categoriesStore.resetNewItem();
}

function promptDeleteCategory(id: string) {
  deleteTargetId.value = id;
  isConfirmOpen.value = true;
}

async function confirmDeleteCategory() {
  if (!deleteTargetId.value) return;
  await categoriesStore.delete(deleteTargetId.value);
  isConfirmOpen.value = false;
  deleteTargetId.value = null;
}

function handleEditCategory(updatedCategory: Category) {
  if (!updatedCategory || updatedCategory.name.trim() === "") return;

  categoriesStore.update(updatedCategory);

  isDialogOpen.value = false;
}

const openEditDialog = (category: Category) => {
  editingCategory.value = { ...category };
  isDialogOpen.value = true;
};
</script>
