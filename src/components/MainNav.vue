<script setup lang="ts">
import { cn } from "@/lib/utils";
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')"
  >
    <a
      href="/"
      class="text-sm font-medium transition-colors hover:text-primary"
    >
      Overview
    </a>
    <a
      href="/form"
      class="text-sm font-medium transition-colors text-muted-foreground hover:text-primary"
    >
      Form
    </a>
  </nav>
</template>
