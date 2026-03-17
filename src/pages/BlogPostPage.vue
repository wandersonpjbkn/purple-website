<template>
  <div v-if="post">
    <section class="page-hero page-hero--simple">
      <BaseContainer>
        <p class="section-eyebrow">{{ post.category }} · {{ post.readTime }}</p>
        <h1>{{ post.title }}</h1>
        <p class="lead narrow">{{ post.excerpt }}</p>
        <div class="post-meta">Por {{ post.author }} · {{ formattedDate }}</div>
      </BaseContainer>
    </section>

    <section class="section-block">
      <BaseContainer>
        <div class="post-layout">
          <BlogSidebar :sections="post.content" :tags="popularTags" />

          <article class="post-content">
            <div class="post-cover">Imagem de capa</div>

            <section v-for="section in post.content" :id="section.id" :key="section.id" class="post-section">
              <h2>{{ section.title }}</h2>
              <p v-for="paragraph in section.body" :key="paragraph">{{ paragraph }}</p>
            </section>
          </article>
        </div>
      </BaseContainer>
    </section>

    <section class="section-block">
      <BaseContainer>
        <div class="section-heading">
          <p class="section-eyebrow">Recentes</p>
          <h2>Você também pode gostar</h2>
        </div>
        <BlogList :posts="relatedPosts" />
      </BaseContainer>
    </section>
  </div>

  <section v-else class="section-block">
    <BaseContainer>
      <h1>Post não encontrado</h1>
      <p>Verifique o slug no arquivo <code>posts.json</code>.</p>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BlogSidebar from '@/components/blog/BlogSidebar.vue'
import BlogList from '@/components/blog/BlogList.vue'
import posts from '@/data/posts.json'

const route = useRoute()
const popularTags = ['Liderança', 'Employer Branding', 'Comunicação Interna']

const post = computed(() => posts.find((item) => item.slug === route.params.slug))

const relatedPosts = computed(() => {
  if (!post.value) return posts.slice(0, 3)
  return posts.filter((item) => item.slug !== post.value?.slug).slice(0, 3)
})

const formattedDate = computed(() => {
  if (!post.value) return ''

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(post.value.date))
})
</script>
