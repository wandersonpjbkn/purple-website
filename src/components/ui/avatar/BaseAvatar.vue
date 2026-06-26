<template>
  <span class="avatar" :class="`avatar--${size}`">
    <AvImage
      v-if="src && !hasError"
      :name="name"
      :src="src"
      @error="hasError = true"
    />
    <AvInitials v-else :name="name" />
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import AvInitials from './AvInitials.vue'
import AvImage from './AvImage.vue'

withDefaults(
  defineProps<{
    name: string
    src?: string
    alt?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    src: '',
    alt: '',
    size: 'md',
  },
)

const hasError = ref(false)
</script>
