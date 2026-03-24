<template>
  <div class="author-avatar" :class="`author-avatar--${size}`" aria-hidden="true">
    {{ name.charAt(0) }}
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { size: 'md' },
)
</script>

<style scoped lang="scss">
.author-avatar {
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple-100), var(--lime-light));
  display: grid;
  place-items: center;
  font-weight: 800;
  color: var(--purple-700);
  border: 2px solid var(--border);
  flex-shrink: 0;
  line-height: 1;

  // ── Tamanhos ────────────────────────────────────────────
  $sizes: (
    'sm': (
      'size': 24px,
      'font': 0.6rem,
    ),
    'md': (
      'size': 40px,
      'font': 1rem,
    ),
    'lg': (
      'size': 72px,
      'font': 1.6rem,
    ),
    'xl': (
      'size': 96px,
      'font': 2.2rem,
      'border': 3px,
    ),
  );

  @each $name, $config in $sizes {
    &--#{$name} {
      width: map.get($config, 'size');
      height: map.get($config, 'size');
      font-size: map.get($config, 'font');

      @if map.has-key($config, 'border') {
        border-width: map.get($config, 'border');
      }
    }
  }
}
</style>
