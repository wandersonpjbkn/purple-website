<template>
  <div v-if="author">
    <!-- ── Hero do autor ─────────────────────────────── -->
    <section class="page-hero">
      <BaseContainer>
        <nav class="post-breadcrumb" aria-label="Navegação">
          <RouterLink to="/blog">Blog</RouterLink>
          <span aria-hidden="true">›</span>
          <span>Autores</span>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{{ author.name }}</span>
        </nav>

        <div class="author-hero">
          <AuthorAvatar :name="author.name" size="xl" />
          <div>
            <p class="section-eyebrow">Autor</p>
            <h1>{{ author.name }}</h1>
            <p class="author-hero__role">{{ author.role }}</p>
            <p class="lead lead--narrow">{{ author.bio }}</p>
            <a
              v-if="author.linkedin"
              :href="author.linkedin"
              target="_blank"
              rel="noopener noreferrer"
              class="text-link"
              style="margin-top: 1rem; display: inline-flex"
              >LinkedIn →</a
            >
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Posts do autor ────────────────────────────── -->
    <section class="section-block section-block--sm">
      <BaseContainer>
        <div class="author-posts-header">
          <p class="section-eyebrow">Publicações</p>
          <h2>
            {{ authorPosts.length }}
            {{ authorPosts.length === 1 ? 'post publicado' : 'posts publicados' }}
          </h2>
        </div>

        <div v-if="authorPosts.length" class="author-posts-grid">
          <PostCard v-for="post in authorPosts" :key="post.slug" :post="post" variant="grid" />
        </div>

        <div v-else class="author-empty">
          <p>Nenhum post publicado ainda.</p>
          <BaseButton tag="RouterLink" to="/blog" variant="secondary">← Voltar ao blog</BaseButton>
        </div>
      </BaseContainer>
    </section>
  </div>

  <!-- Autor não encontrado -->
  <section v-else class="section-block">
    <BaseContainer>
      <h1>Autor não encontrado</h1>
      <div style="margin-top: 1.5rem">
        <BaseButton tag="RouterLink" to="/blog">← Voltar para o blog</BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

import { getPostsByAuthor } from 'virtual:blog-posts'

import { getAuthor, usePageMeta } from '@/composables'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AuthorAvatar from '@/components/ui/AuthorAvatar.vue'
import PostCard from '@/components/blog/PostCard.vue'

const route = useRoute()
const author = computed(() => getAuthor(route.params.slug as string))
const authorPosts = computed(() => getPostsByAuthor(route.params.slug as string))

usePageMeta(
  computed(() => ({
    title: author.value ? `Posts de ${author.value.name}` : 'Autor',
    description: author.value?.bio ?? '',
  })),
)
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.post-breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--subtle);
  margin-bottom: 2rem;
  flex-wrap: wrap;

  a {
    color: var(--muted);
    transition: color 0.15s;
    &:hover {
      color: var(--purple);
    }
  }
}

.author-hero {
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;

  @include respond-to(sm) {
    flex-direction: column;
    gap: 1.5rem;
  }
}

.author-hero__role {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.75rem;
}

.author-posts-header {
  margin-bottom: 2rem;
  h2 {
    margin-bottom: 0;
  }
}

.author-posts-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.75rem 1.5rem;

  @include respond-to(lg) {
    grid-template-columns: repeat(3, 1fr);
  }
  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond-to(sm) {
    grid-template-columns: 1fr;
  }
}

.author-empty {
  text-align: center;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;

  p {
    color: var(--muted);
  }
}
</style>
