<template>
  <a
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="label"
    class="social-link"
    :class="`social-link--${size}`"
  >
    <BaseIcon :name="icon" />
  </a>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon.vue'

withDefaults(
  defineProps<{
    href: string
    icon: string
    label: string
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' }
)
</script>

<style scoped lang="scss">
.social-link {
  display: grid;
  place-items: center;
  color: var(--purple);
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition:
    color 0.15s,
    background 0.15s,
    transform 0.15s;

  &:hover {
    color: var(--surface);
    background: var(--purple);
    transform: translateY(-2px);
  }

  &--md {
    width: var(--tap-target-min);
    height: var(--tap-target-min);
    font-size: 1.05rem;
  }

  &--sm {
    width: 28px;
    height: 28px;
    font-size: 0.85rem;
    border-radius: var(--radius-pill);
  }
}
</style>
