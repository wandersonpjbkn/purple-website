<template>
  <article
    class="post-card"
    :class="`post-card--${variant}`"
  >
    <RouterLink
      :to="`/blog/${post.slug}`"
      class="post-card__cover"
      tabindex="-1"
      aria-hidden="true"
    >
      <img
        v-if="post.cover"
        :src="useCdnAsset(post.cover)"
        :alt="post.title"
        loading="lazy"
      />
      <div
        v-else
        class="post-card__cover-placeholder"
      >
        <span class="post-card__cover-letter">{{ post.category.charAt(0) }}</span>
      </div>
    </RouterLink>

    <div class="post-card__body">
      <div class="post-card__eyebrow">
        <RouterLink
          :to="`/blog?categoria=${encodeURIComponent(post.category)}`"
          class="post-card__category"
          @click.stop
          >{{ post.category }}</RouterLink
        >
        <span class="post-card__eyebrow-sep">—</span>
        <span class="post-card__readtime">{{ post.readTime }} min</span>
      </div>

      <h3 class="post-card__title">
        <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
      </h3>

      <p
        v-if="variant === 'featured'"
        class="post-card__excerpt"
      >
        {{ post.excerpt }}
      </p>

      <div
        v-if="variant !== 'list' && author"
        class="post-card__author"
      >
        <BaseAvatar
          v-if="author"
          :name="author.name"
          size="sm"
        />
        <RouterLink
          :to="`/blog/autor/${post.author}`"
          class="post-card__author-name"
          @click.stop
        >
          {{ author.name }}
        </RouterLink>
        <span class="post-card__author-sep">·</span>
        <time :datetime="post.date">{{ formatDate(post.date) }}</time>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import type { PostMeta } from '@/types/blog'

import { formatDate, getAuthor, useCdnAsset } from '@/composables'

import BaseAvatar from '@/components/ui/avatar/BaseAvatar.vue'

// Variants:
//   "grid"     → standard vertical card (4 columns, Remote-style)
//   "featured" → large horizontal card (featured post)
//   "list"     → compact horizontal card (sidebar)

const props = withDefaults(
  defineProps<{
    post: PostMeta
    variant?: 'grid' | 'featured' | 'list'
  }>(),
  { variant: 'grid' }
)

const author = computed(() => getAuthor(props.post.author))
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.post-card {
  background: transparent;
  border: none;

  &:hover .post-card__title a {
    color: var(--purple);
  }
  &:hover .post-card__cover img {
    transform: scale(1.03);
  }
}

.post-card__cover {
  display: block;
  overflow: hidden;
  border-radius: var(--radius-lg);
  background: var(--bg-alt);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s var(--ease);
  }
}

.post-card__cover-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--purple-100) 0%, var(--lime-light) 100%);
  display: grid;
  place-items: center;
}

.post-card__cover-letter {
  font-size: 3rem;
  font-weight: 800;
  color: var(--purple-400);
  opacity: 0.35;
  user-select: none;
}

.post-card__body {
  padding: 0.875rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.post-card__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.post-card__category {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--purple);
  transition: color 0.15s;

  &:hover {
    color: var(--purple-700);
  }
}

.post-card__eyebrow-sep {
  font-size: 0.72rem;
  color: var(--subtle);
  font-weight: 400;
}

.post-card__readtime {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--subtle);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.post-card__title {
  font-size: var(--text-base);
  font-weight: 700;
  line-height: 1.35;
  margin: 0;

  a {
    color: var(--text);
    transition: color 0.2s var(--ease);
  }
}

.post-card__excerpt {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--muted);
  margin: var(--space-1) 0 0;
  @include line-clamp(3);
}

.post-card__author {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.375rem;
  font-size: 0.78rem;
  color: var(--subtle);
}

.post-card__author-name {
  font-weight: 600;
  color: var(--muted);
  transition: color 0.15s;
  &:hover {
    color: var(--purple);
  }
}

.post-card__author-sep {
  color: var(--border);
}

.post-card--grid {
  .post-card__cover {
    aspect-ratio: 4 / 3;
  }
  .post-card__title {
    font-size: var(--text-base);
  }
}

.post-card--featured {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  align-items: start;

  .post-card__cover {
    aspect-ratio: 16 / 10;
  }

  .post-card__body {
    padding: var(--space-1) 0 0;
  }

  .post-card__title {
    font-size: var(--text-xl);
    line-height: 1.22;
    font-weight: 800;
  }

  @include respond-to(md) {
    grid-template-columns: 1fr;

    .post-card__title {
      font-size: var(--text-lg);
    }
  }
}

.post-card--list {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0.875rem;
  align-items: start;

  .post-card__cover {
    aspect-ratio: 1;
    border-radius: var(--radius);
    flex-shrink: 0;
  }

  .post-card__body {
    padding: 0;
  }

  .post-card__title {
    font-size: var(--text-sm);
    line-height: 1.3;
    @include line-clamp(2);
  }
}
</style>
