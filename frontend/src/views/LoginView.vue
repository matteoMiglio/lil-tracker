<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const username = ref("admin");
const password = ref("");

const authStore = useAuthStore();

const error = ref<string | null>(null);

const handleSubmit = async () => {
  try {
    await authStore.login(username.value, password.value);
  } catch {
    error.value = "Login fallito, prova di nuovo";
  }

  if (authStore.isLoggedIn) {
    router.push({ name: "home" });
  } else {
    password.value = "";
  }
};
</script>

<template>
  <Card class="max-w-sm mx-auto mt-32">
    <CardHeader>
      <CardTitle class="text-2xl"> Login </CardTitle>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="username">Email</Label>
            <Input id="username" type="username" v-model="username" required />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input id="password" type="password" v-model="password" required />
          </div>
          <div v-if="error && !password.length" class="text-sm text-red-500">
            {{ error }}
          </div>
          <Button type="submit" class="w-full"> Login </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>
