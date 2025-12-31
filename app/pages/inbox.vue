<script setup lang="ts">
definePageMeta({
  layout: 'dashboard',
  middleware: 'require-auth'
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold">Inbox</h1>
    <p class="text-neutral-500 mt-2">Your inbox (coming in Phase 3)</p>
  </div>
</template>
