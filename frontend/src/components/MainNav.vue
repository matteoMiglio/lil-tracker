<script setup lang="ts">
import { cn } from "@/lib/utils";
import { RouterLink } from "vue-router";
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')"
  >
    <RouterLink
      to="/"
      class="font-medium transition-colors text-muted-foreground"
      active-class="text-primary"
    >
      Dashboard</RouterLink
    >
    <RouterLink
      to="/form"
      class="font-medium transition-colors text-muted-foreground"
      active-class="text-primary"
    >
      Form
    </RouterLink>
    <RouterLink
      to="/categories"
      class="font-medium transition-colors text-muted-foreground"
      active-class="text-primary"
    >
      Categorie
    </RouterLink>
  </nav>
</template>
