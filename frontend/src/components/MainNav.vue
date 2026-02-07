<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { RouterLink } from "vue-router";
import { Home, Tag, ArrowUpDown, LogOut, CalendarDays } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push({ name: "login" });
}
</script>

<template>
  <div class="flex items-center justify-between h-16 px-4">
    <RouterLink to="/" class="text-xl font-bold text-primary">Lil-tracker</RouterLink>
    <nav class="flex items-center gap-4 lg:gap-6">
      <Button
        asChild
        variant="ghost"
        :class="{ 'bg-muted text-primary': route.path === '/' }"
      >
        <RouterLink to="/">
          <div class="flex items-center gap-2">
            <Home class="size-4" />
            Dashboard
          </div>
        </RouterLink>
      </Button>
      <Button
        asChild
        variant="ghost"
        :class="{ 'bg-muted text-primary': route.path === '/form' }"
      >
        <RouterLink to="/form">
          <div class="flex items-center gap-2">
            <ArrowUpDown class="size-4" />
            Form
          </div>
        </RouterLink>
      </Button>
      <Button
        asChild
        variant="ghost"
        :class="{ 'bg-muted text-primary': route.path === '/categories' }"
      >
        <RouterLink to="/categories">
          <div class="flex items-center gap-2">
            <Tag class="size-4" />
            Categorie
          </div>
        </RouterLink>
      </Button>
      <Button
        asChild
        variant="ghost"
        :class="{ 'bg-muted text-primary': route.path === '/seasons' }"
      >
        <RouterLink to="/seasons">
          <div class="flex items-center gap-2">
            <CalendarDays class="size-4" />
            Stagioni
          </div>
        </RouterLink>
      </Button>
      <Button variant="ghost" @click="handleLogout">
        <div class="flex items-center gap-2">
          <LogOut class="size-4" />
          Esci
        </div>
      </Button>
    </nav>
  </div>
</template>
