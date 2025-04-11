<template>
  <div class="flex-col w-full h-full">
    <div class="border-b">
      <div class="flex items-center justify-center h-16 px-4">
        <MainNav class="mx-6" />
      </div>
    </div>
    <div class="flex flex-col w-full h-full gap-4 p-8">
      <!-- Add Category Card -->
      <Card>
        <CardHeader>
          <CardTitle> Add Category </CardTitle>
          <CardDescription> Create a new category </CardDescription>
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
              <Button type="submit">
                <Plus class="size-4" />
                Add
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
              <TableRow v-for="category in categories" :key="category.id">
                <TableCell>{{ category.name }}</TableCell>
                <TableCell class="flex items-center justify-end gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    @click="openEditDialog(category)"
                  >
                    <Edit class="size-4" />
                    <span class="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    @click="handleDeleteCategory(category.id)"
                  >
                    <Trash2 class="size-4" />
                    <span class="sr-only">Delete</span>
                  </Button>
                </TableCell>
              </TableRow>
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import MainNav from "@/components/MainNav.vue";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-vue-next";
import type { Category } from "@/types/category";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CategoryDialog from "@/components/CategoryDialog.vue";
import { useCategoriesStore } from "@/stores/categories";
import { storeToRefs } from "pinia";

const categoriesStore = useCategoriesStore();
const { categories, newItem } = storeToRefs(categoriesStore);

const editingCategory = ref<Category | null>(null);
const isDialogOpen = ref(false);

function handleAddCategory() {
  if (newItem.value.name.trim() === "") return;

  categoriesStore.add();
  categoriesStore.resetNewItem();
}

const handleDeleteCategory = (id: string) => {
  categoriesStore.delete(id);
};

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
