<template>
  <div>
    <section class="page-hero page-hero--simple">
      <BaseContainer>
        <p class="section-eyebrow">Blog</p>
        <div class="blog-search-row">
          <div>
            <h1>Conteúdos sobre employer branding, comunicação interna e mercado</h1>
            <p class="lead narrow">Uma base simples com listagem de posts em JSON, pronta para evoluir depois para Markdown ou CMS.</p>
          </div>
          <input v-model="query" class="search-input" type="search" placeholder="O que deseja procurar..." />
        </div>
      </BaseContainer>
    </section>

    <section class="section-block">
      <BaseContainer>
        <div class="section-heading">
          <p class="section-eyebrow">Recentes</p>
          <h2>Posts publicados</h2>
        </div>
        <BlogList :posts="filteredPosts" />
      </BaseContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BlogList from '@/components/blog/BlogList.vue'
import posts from '@/data/posts.json'

const query = ref('')

const filteredPosts = computed(() => {
  const term = query.value.trim().toLowerCase()

  if (!term) return posts

  return posts.filter((post) =>
    [post.title, post.excerpt, post.category, post.author].some((value) =>
      value.toLowerCase().includes(term),
    ),
  )
})
</script>
