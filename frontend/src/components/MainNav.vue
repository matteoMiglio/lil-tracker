<script setup lang="ts">
import { useRoute } from "vue-router"; // Import useRoute to get the current route
import { RouterLink } from "vue-router";
import { Home, Tag, ArrowUpDown } from "lucide-vue-next";
import { Button } from "@/components/ui/button"; // Import the Button component

const route = useRoute(); // Get the current route
</script>

<template>
  <div class="flex items-center justify-between h-16 px-4">
    <h1 class="text-xl font-bold text-primary">Lil-tracker</h1>
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
    </nav>
  </div>
</template>
