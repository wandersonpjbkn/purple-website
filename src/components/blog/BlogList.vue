<template>
  <div class="blog-grid">
    <BlogCard v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script setup lang="ts">
import BlogCard from './BlogCard.vue'
import type { Post } from '@/types/post'

defineProps<{
  posts: Post[]
}>()
</script>
