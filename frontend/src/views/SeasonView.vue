<template>
  <div class="flex-col w-full h-full">
    <div class="border-b">
      <MainNav />
    </div>
    <div class="flex flex-col w-full h-full gap-4 p-8">
      <!-- Add Season Card -->
      <Card>
        <CardHeader>
          <CardTitle> Aggiungi una stagione </CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleAddSeason" class="space-y-4">
            <div class="flex gap-2">
              <div class="flex-1">
                <label for="season" class="sr-only">Nome Stagione</label>
                <Input
                  id="season"
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

      <!-- Seasons Table Card -->
      <Card>
        <CardHeader>
          <CardTitle> Stagioni </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead class="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <template v-if="seasons && seasons.length">
                <TableRow v-for="season in seasons" :key="season.id">
                  <TableCell>{{ season.name }}</TableCell>
                  <TableCell>
                    <span
                      v-if="season.active"
                      class="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600"
                    >
                      Attiva
                    </span>
                  </TableCell>
                  <TableCell class="flex items-center justify-end gap-2">
                    <Button
                      v-if="!season.active"
                      variant="outline"
                      size="icon"
                      :disabled="loading"
                      @click="handleActivate(season.id)"
                    >
                      <Play class="size-4" />
                      <span class="sr-only">Attiva</span>
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      :disabled="loading"
                      @click="openEditDialog(season)"
                    >
                      <Edit class="size-4" />
                      <span class="sr-only">Modifica</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      :disabled="loading"
                      @click="promptDeleteSeason(season.id)"
                    >
                      <Trash2 class="size-4" />
                      <span class="sr-only">Elimina</span>
                    </Button>
                  </TableCell>
                </TableRow>
              </template>
              <template v-else>
                <TableRow>
                  <TableCell :colspan="3" class="h-24 text-center">
                    Nessuna stagione trovata. Aggiungi una nuova stagione!
                  </TableCell>
                </TableRow>
              </template>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </div>
  <SeasonDialog
    :is-open="isDialogOpen"
    :season="editingSeason"
    @update:isOpen="isDialogOpen = $event"
    @save="handleEditSeason"
  />
  <ConfirmDialog
    :open="isConfirmOpen"
    title="Eliminare stagione?"
    description="La stagione verrà eliminata. Questa azione non può essere annullata."
    :loading="loading"
    @update:open="isConfirmOpen = $event"
    @confirm="confirmDeleteSeason"
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
import { Plus, Trash2, Edit, Loader2, Play } from "lucide-vue-next";
import type { Season } from "@/types/season";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SeasonDialog from "@/components/SeasonDialog.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { useSeasonsStore } from "@/stores/seasons";
import { useTransactionsStore } from "@/stores/transactions";
import { storeToRefs } from "pinia";

const seasonsStore = useSeasonsStore();
const transactionsStore = useTransactionsStore();
const { seasons, newItem, loading } = storeToRefs(seasonsStore);

const editingSeason = ref<Season | null>(null);
const isDialogOpen = ref(false);

const deleteTargetId = ref<string | null>(null);
const isConfirmOpen = ref(false);

function handleAddSeason() {
  if (newItem.value.name.trim() === "") return;

  seasonsStore.add();
  seasonsStore.resetNewItem();
}

function promptDeleteSeason(id: string) {
  deleteTargetId.value = id;
  isConfirmOpen.value = true;
}

async function confirmDeleteSeason() {
  if (!deleteTargetId.value) return;
  await seasonsStore.delete(deleteTargetId.value);
  isConfirmOpen.value = false;
  deleteTargetId.value = null;
}

function handleEditSeason(updatedSeason: Season) {
  if (!updatedSeason || updatedSeason.name.trim() === "") return;

  seasonsStore.update(updatedSeason);

  isDialogOpen.value = false;
}

async function handleActivate(id: string) {
  await seasonsStore.activate(id);
  const active = seasonsStore.activeSeason;
  await transactionsStore.fetchData(active?.id);
}

const openEditDialog = (season: Season) => {
  editingSeason.value = { ...season };
  isDialogOpen.value = true;
};
</script>
