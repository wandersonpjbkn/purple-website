<template>
  <span
    class="avatar"
    :class="`avatar--${size}`"
  >
    <AvImage
      v-if="src && !hasError"
      :name="name"
      :src="src"
      @error="hasError = true"
    />
    <AvInitials
      v-else
      :name="name"
    />
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
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  {
    src: '',
    size: 'md',
  }
)

const hasError = ref(false)
</script>

<style scoped lang="scss">
// The avatar's style lives here (not in a loose global), so it's authoritative
// and isn't overridden by a page's scoped styles. `:deep()` reaches the <img>
// (AvImage) and .avatar__initial (AvInitials), which live in other scopes.
.avatar {
  display: grid;
  place-items: center;

  overflow: hidden;
  flex-shrink: 0;

  border-radius: 50%;
  border: 2px solid var(--border);

  background: linear-gradient(135deg, var(--purple-100), var(--lime-light));
  color: var(--purple-700);

  font-weight: 800;
  line-height: 1;

  :deep(img) {
    width: 100%;
    height: 100%;

    display: block;

    object-fit: cover;
    object-position: center;
  }

  :deep(.avatar__initial) {
    user-select: none;
  }

  $sizes: (
    sm: (
      size: 24px,
      font: 0.6rem,
    ),
    md: (
      size: 40px,
      font: 1rem,
    ),
    lg: (
      size: 72px,
      font: 1.6rem,
    ),
    xl: (
      size: 96px,
      font: 2.2rem,
      border: 3px,
    ),
  );

  @each $name, $config in $sizes {
    &--#{$name} {
      width: map.get($config, size);
      height: map.get($config, size);

      font-size: map.get($config, font);

      @if map.has-key($config, border) {
        border-width: map.get($config, border);
      }
    }
  }
}
</style>
