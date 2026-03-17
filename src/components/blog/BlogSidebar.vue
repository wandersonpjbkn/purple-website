<template>
  <aside class="blog-sidebar">
    <div class="sidebar-box">
      <h3>Neste artigo</h3>
      <ul>
        <li v-for="section in sections" :key="section.id">
          <a :href="`#${section.id}`">{{ section.title }}</a>
        </li>
      </ul>
    </div>

    <div class="sidebar-box">
      <h3>Tags populares</h3>
      <ul>
        <li v-for="tag in tags" :key="tag">{{ tag }}</li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { PostSection } from '@/types/post'

defineProps<{
  sections: PostSection[]
  tags: string[]
}>()
</script>
