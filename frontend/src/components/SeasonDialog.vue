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
import type { Season } from "@/types/season";
import { ref, watch } from "vue";

const props = defineProps<{
  season: Season | null;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "save", editingSeason: Season): void;
  (e: "update:isOpen", isOpen: boolean): void;
}>();

function emitOpenChange() {
  emit("update:isOpen", !props.isOpen);
}

const editingSeason = ref<Season | null>(null);

watch(
  () => props.season,
  (newSeason) => {
    if (newSeason) {
      editingSeason.value = { ...newSeason };
    } else {
      editingSeason.value = null;
    }
  },
  { immediate: true },
);

function handleSave() {
  if (editingSeason.value) {
    emit("save", editingSeason.value);
  }
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="emitOpenChange">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Modifica Stagione</DialogTitle>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="grid items-center grid-cols-4 gap-4">
          <Label for="name" class="text-right"> Nome </Label>
          <Input
            id="name"
            v-model="editingSeason!.name"
            class="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="handleSave"> Salva </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
