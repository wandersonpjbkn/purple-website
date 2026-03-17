<template>
  <article class="blog-card">
    <div class="blog-card__image">Imagem</div>
    <div class="blog-card__content">
      <p class="blog-card__meta">{{ post.category }} · {{ post.readTime }}</p>
      <h3>
        <RouterLink :to="`/blog/${post.slug}`">{{ post.title }}</RouterLink>
      </h3>
      <p>{{ post.excerpt }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Post } from '@/types/post'

defineProps<{
  post: Post
}>()
</script>
