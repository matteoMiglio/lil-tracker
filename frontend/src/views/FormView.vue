<template>
  <div class="flex-col w-full h-full">
    <div class="border-b">
      <MainNav />
    </div>
  </div>
  <div class="flex items-center justify-center p-8">
    <Card class="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Aggiungi nuova transazione</CardTitle>
        <p v-if="activeSeason" class="text-sm text-muted-foreground">
          Stagione: {{ activeSeason.name }}
        </p>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <Label for="kind">Tipo</Label>
            <RadioGroup
              id="kind"
              class="flex gap-4"
              :defaultValue="'expense'"
              v-model="newItem.kind"
            >
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label
                  for="expense"
                  :class="[
                    'cursor-pointer rounded-md px-3 py-1',
                    newItem.kind === 'expense'
                      ? 'bg-destructive/10 text-destructive font-medium'
                      : '',
                  ]"
                >
                  Uscita
                </Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label
                  for="income"
                  :class="[
                    'cursor-pointer rounded-md px-3 py-1',
                    newItem.kind === 'income'
                      ? 'bg-green-500/10 text-green-600 font-medium'
                      : '',
                  ]"
                >
                  Entrata
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="amount">Ammontare</Label>
            <div class="relative">
              <span
                class="absolute -translate-y-1/2 left-3 top-1/2 text-muted-foreground"
                >€</span
              >
              <Input
                id="amount"
                type="number"
                step="0.1"
                min="0"
                placeholder="0,00"
                :class="['pl-8', errors.amount && 'border-destructive focus-visible:ring-destructive']"
                :model-value="newItem.amount ?? undefined"
                @update:model-value="(v) => { newItem.amount = v ? Number(v) : null; if (submitted) validate(); }"
              />
            </div>
            <p v-if="errors.amount" class="text-sm text-destructive">{{ errors.amount }}</p>
          </div>

          <div class="flex flex-col gap-2">
            <Label for="description">Descrizione</Label>
            <Input
              id="description"
              type="text"
              placeholder="Aggiungi una breve descrizione"
              :model-value="newItem.description ?? undefined"
              @update:model-value="(v) => (newItem.description = v ? String(v) : null)"
            />
          </div>

          <div class="flex flex-col gap-2">
            <Label for="category">Categoria</Label>
            <Select v-model="newItem.categoryId" id="category" :disabled="categories.length === 0">
              <SelectTrigger>
                <SelectValue :placeholder="categories.length === 0 ? 'Nessuna categoria disponibile' : 'Seleziona una categoria'" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="flex gap-2">
            <div class="flex flex-col w-full gap-2">
              <Label for="date">Data</Label>
              <Popover>
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    :class="[
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                      errors.date && 'border-destructive',
                    ]"
                  >
                    <CalendarIcon class="w-4 h-4 mr-2" />
                    {{ date ? formatDateValue(date as DateValue) : "Seleziona data" }}
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    mode="single"
                    :model-value="(date as DateValue)"
                    initialFocus
                    :locale="it.code"
                    :week-starts-on="0"
                    @update:model-value="
                      (v: DateValue | undefined) => {
                        if (v) {
                          date = v;
                          newItem.date = v.toString();
                        } else {
                          newItem.date = null;
                        }
                        if (submitted) validate();
                      }
                    "
                  />
                </PopoverContent>
              </Popover>
              <p v-if="errors.date" class="text-sm text-destructive">{{ errors.date }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <Label for="time">Ora</Label>
              <Input
                id="time"
                type="time"
                :class="[errors.time && 'border-destructive focus-visible:ring-destructive']"
                :model-value="newItem.time ?? undefined"
                @update:model-value="(v) => { newItem.time = v ? String(v) : null; if (submitted) validate(); }"
              />
              <p v-if="errors.time" class="text-sm text-destructive">{{ errors.time }}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" class="w-full" :disabled="loading">
            <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
            <PlusCircleIcon v-else class="w-4 h-4 mr-2" />
            Aggiungi
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { it } from "date-fns/locale";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircleIcon, Loader2 } from "lucide-vue-next";
import MainNav from "@/components/MainNav.vue";
import { formatLongDateString, formatDateValue } from "@/lib/formatters";
import { type DateValue, parseDate } from "@internationalized/date";
import { format } from "date-fns";
import { useTransactionsStore } from "@/stores/transactions";
import { useCategoriesStore } from "@/stores/categories";
import { useSeasonsStore } from "@/stores/seasons";
import { storeToRefs } from "pinia";

const store = useTransactionsStore();
const categoriesStore = useCategoriesStore();
const seasonsStore = useSeasonsStore();
const { categories } = storeToRefs(categoriesStore);

const { newItem, loading } = storeToRefs(store);

const activeSeason = computed(() => seasonsStore.activeSeason);

watchEffect(() => {
  newItem.value.seasonId = activeSeason.value?.id ?? null;
});

const today = new Date();

const date = ref<DateValue>(parseDate(format(today, "yyyy-MM-dd")));
const time = ref(format(today, "HH:mm"));

newItem.value.date = date.value.toString();
newItem.value.time = time.value;

const errors = ref<{ amount?: string; date?: string; time?: string }>({});
const submitted = ref(false);

function validate(): boolean {
  const e: typeof errors.value = {};
  if (!newItem.value.amount || newItem.value.amount <= 0) {
    e.amount = "Inserisci un importo valido";
  }
  if (!newItem.value.date) {
    e.date = "Seleziona una data";
  }
  if (!newItem.value.time) {
    e.time = "Inserisci un orario";
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

const handleSubmit = async () => {
  submitted.value = true;
  if (!validate()) return;

  const now = new Date();

  try {
    await store.add();

    toast.success("Transazione registrata", {
      description: formatLongDateString(now.toISOString()),
    });

    store.resetNewItem();
    submitted.value = false;
    errors.value = {};

    date.value = parseDate(format(today, "yyyy-MM-dd"));
    time.value = format(now, "HH:mm");

    newItem.value.date = date.value.toString();
    newItem.value.time = time.value;
  } catch {
    toast.error("Errore", {
      description: "Qualcosa è andato storto",
    });
  }
};
</script>
