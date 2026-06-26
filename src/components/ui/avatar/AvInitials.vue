<template>
  <span class="avatar__initial">
    {{ name.charAt(0).toUpperCase() }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>
