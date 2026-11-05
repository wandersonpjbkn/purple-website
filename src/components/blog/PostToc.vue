<template>
  <ul class="post-toc-list">
    <li
      v-for="heading in headings"
      :key="heading.id"
    >
      <a
        :href="`#${heading.id}`"
        class="post-toc-list__link"
        :class="{ 'post-toc-list__link--sub': heading.level === 3 }"
        @click="emit('navigate')"
        >{{ heading.text }}</a
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { PostHeading } from '@/types/blog'

defineProps<{ headings: PostHeading[] }>()

const emit = defineEmits<{ navigate: [] }>()
</script>

<style scoped lang="scss">
.post-toc-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.post-toc-list__link {
  display: block;
  padding-block: var(--space-1);
  font-size: 0.82rem;
  line-height: 1.4;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s;

  &:hover {
    color: var(--purple);
  }

  &--sub {
    padding-left: 0.875rem;
  }
}
</style>
