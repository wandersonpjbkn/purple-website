<template>
  <component :is="tag" :to="to" class="button" :class="variant" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    tag?: string
    variant?: 'primary' | 'secondary' | 'ghost'
  }>(),
  {
    to: '',
    tag: 'button',
    variant: 'primary',
  },
)
</script>
