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
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record a new income or expense</CardDescription>
      </CardHeader>
      <form @submit.prevent="handleSubmit">
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <Label for="type">Transaction Type</Label>
            <RadioGroup
              id="type"
              class="flex gap-4"
              :defaultValue="'expense'"
              v-model="transactionType"
            >
              <div class="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label
                  for="expense"
                  :class="[
                    'cursor-pointer rounded-md px-3 py-1',
                    transactionType === 'expense'
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
                    transactionType === 'income'
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
                >$</span
              >
              <Input
                id="amount"
                type="number"
                step="0.1"
                min="0"
                placeholder="0.00"
                class="pl-8"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="description">Description</Label>
            <Input id="description" placeholder="What was this for?" />
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
                  {{ date ? formatDate(date) : "Select date" }}
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0">
                <Calendar mode="single" v-model="date" initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" class="w-full">
            <PlusCircleIcon class="w-4 h-4 mr-2" />
            Add {{ transactionType }}
          </Button>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { format } from "date-fns";
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

// Reactive state
const transactionType = ref("expense");
const date = ref(null);
const selectedCategory = ref("");

// Format date for display
const formatDate = (dateValue) => {
  return format(dateValue, "PPP");
};

// Form submission handler
const handleSubmit = () => {
  // Implement your form submission logic here
  console.log({
    type: transactionType.value,
    // Add other form values here
    category: selectedCategory.value,
    date: date.value,
  });
};
</script>
