<template>
  <div class="flex-col w-full h-full">
    <div class="border-b">
      <div class="flex items-center justify-center h-16 px-4">
        <MainNav class="mx-6" />
      </div>
    </div>
  </div>
  <div class="flex-1 p-8">
    <Card>
      <CardHeader>
        <CardTitle>Add new transaction</CardTitle>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="kind">Type</Label>
            <RadioGroup
              id="kind"
              class="flex gap-4"
              :defaultValue="'expense'"
              v-model="transactionKind"
            >
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label
                  for="expense"
                  :class="[
                    'cursor-pointer rounded-md px-3 py-1',
                    transactionKind === 'expense'
                      ? 'bg-destructive/10 text-destructive font-medium'
                      : '',
                  ]"
                >
                  Expense
                </Label>
              </div>
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label
                  for="income"
                  :class="[
                    'cursor-pointer rounded-md px-3 py-1',
                    transactionKind === 'income'
                      ? 'bg-green-500/10 text-green-600 font-medium'
                      : '',
                  ]"
                >
                  Income
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div class="space-y-2">
            <Label for="amount">Amount</Label>
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
                class="pl-8"
                v-model="amount"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="date">Date</Label>
            <Popover>
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  :class="[
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground',
                  ]"
                >
                  <CalendarIcon class="w-4 h-4 mr-2" />
                  {{ date ? formatDateValue(date) : "Seleziona data" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar
                  mode="single"
                  v-model="date"
                  initialFocus
                  :locale="it.code"
                  :week-starts-on="0"
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" class="w-full">
            <PlusCircleIcon class="w-4 h-4 mr-2" />
            Add {{ transactionKind }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
  <Toaster />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { it } from "date-fns/locale";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "vue-sonner";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, PlusCircleIcon } from "lucide-vue-next";
import MainNav from "@/components/MainNav.vue";
import { formatLongDateString, formatDateValue } from "@/lib/formatters";
import {
  type DateValue,
  today,
  getLocalTimeZone,
} from "@internationalized/date";

const transactionKind = ref("expense");
const date = ref<DateValue>(today(getLocalTimeZone()));
const amount = ref(null);

const handleSubmit = () => {
  console.log({
    amount: amount.value,
    kind: transactionKind.value,
    date: date.value.toString(),
  });

  if (!amount.value || !date.value) {
    console.debug("Please fill all fields");
    return;
  }

  const now = new Date();

  try {
    toast.success("Transazione registrata", {
      description: formatLongDateString(now),
    });

    amount.value = null;
    transactionKind.value = "expense";
    date.value = today(getLocalTimeZone());
    // Reset the form
  } catch (error) {
    toast.error("Error", {
      description: "Something went wrong",
    });
  }
};
</script>
