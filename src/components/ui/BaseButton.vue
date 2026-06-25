<template>
  <component :is="tag" :to="tag === 'RouterLink' ? to : undefined" class="button" :class="variant" v-bind="$attrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    to?: string
    tag?: string
    variant?: 'primary' | 'secondary' | 'ghost' | 'lime'
  }>(),
  {
    to: '',
    tag: 'button',
    variant: 'primary',
  },
)
</script>
