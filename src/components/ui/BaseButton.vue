<template>
  <component
    :is="tag"
    :to="to"
    class="button"
    :class="variant"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string
    tag?: string
    variant?: 'primary' | 'secondary' | 'ghost'
  }>(),
  {
    tag: 'button',
    variant: 'primary',
  },
)
</script>
