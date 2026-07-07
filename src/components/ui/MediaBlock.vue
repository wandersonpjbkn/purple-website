<template>
  <div
    class="media-block"
    :class="{ 'media-block--loaded': loaded }"
  >
    <img
      v-if="src && !failed"
      class="media-block__img"
      :src="src"
      :alt="alt"
      loading="lazy"
      @load="loaded = true"
      @error="failed = true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    src?: string
    alt?: string
  }>(),
  { src: '', alt: '' }
)

const loaded = ref(false)
const failed = ref(false)
</script>

<style scoped lang="scss">
.media-block {
  border-radius: var(--radius-xl);
  background: var(--bg-alt);
  border: 1px solid var(--border);
  min-height: 690px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(var(--lime-rgb), 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(var(--purple-rgb), 0.12) 0%, transparent 50%);
  }
}

.media-block__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s var(--ease);
}

.media-block--loaded .media-block__img {
  opacity: 1;
}
</style>
