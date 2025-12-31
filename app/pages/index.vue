<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'require-auth'
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold">
      Dashboard Home
    </h1>
    <p>
      Welcome to your admin dashboard. Charts and analytics coming in Phase 3.
    </p>
  </div>
</template>
