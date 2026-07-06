<template>
  <img
    :src="src"
    :alt="name"
    loading="lazy"
    @error="emit('error')"
  />
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    src?: string
  }>(),
  {
    src: '',
  }
)

const emit = defineEmits(['error'])
</script>
