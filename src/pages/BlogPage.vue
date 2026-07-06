<template>
  <div class="blog-page">
    <!-- ── Hero: title + search ─────────────────────────── -->
    <section class="blog-hero">
      <BaseContainer>
        <div class="blog-hero__inner">
          <div>
            <p class="section-eyebrow">Blog</p>
            <h1>Conteúdos sobre pessoas,<br />cultura e comunicação</h1>
          </div>
          <div class="blog-search-field">
            <span class="blog-search-field__icon"><BaseIcon name="search" /></span>
            <input
              v-model="query"
              type="search"
              placeholder="O que deseja procurar..."
              aria-label="Buscar posts"
              @input="watchReset"
            />
            <button
              v-if="query"
              class="blog-search-field__clear"
              aria-label="Limpar"
              @click="((query = ''), watchReset())"
            >
              ✕
            </button>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Categories (sticky) ──────────────────────────── -->
    <div class="blog-categories-bar">
      <BaseContainer>
        <nav
          class="blog-filter-pills"
          aria-label="Filtrar por categoria"
        >
          <button
            class="filter-pill"
            :class="{ active: !activeCategory }"
            :aria-pressed="!activeCategory"
            @click="((activeCategory = ''), watchReset())"
          >
            Todos
          </button>
          <button
            v-for="{ category } in categories"
            :key="category"
            class="filter-pill"
            :class="{ active: activeCategory === category }"
            :aria-pressed="activeCategory === category"
            @click="((activeCategory = category), watchReset())"
          >
            {{ category }}
          </button>
        </nav>
      </BaseContainer>
    </div>

    <section
      v-if="query"
      class="blog-section"
    >
      <BaseContainer>
        <div class="blog-section__header">
          <h2 class="blog-section__title">
            {{ total }} {{ total === 1 ? 'resultado' : 'resultados' }} para "<em>{{ query }}</em
            >"
          </h2>
          <button
            class="filter-clear"
            @click="((query = ''), watchReset())"
          >
            Limpar
          </button>
        </div>

        <div
          v-if="paginated.length"
          class="blog-grid blog-grid--4"
        >
          <PostCard
            v-for="post in paginated"
            :key="post.slug"
            :post="post"
            variant="grid"
          />
        </div>

        <div
          v-else
          class="blog-empty"
        >
          <p>Nenhum post encontrado.</p>
          <BaseButton
            variant="secondary"
            @click="query = ''"
            >Ver todos</BaseButton
          >
        </div>

        <BlogPagination
          v-if="totalPages > 1"
          :page="page"
          :total-pages="totalPages"
          @change="setPage"
        />
      </BaseContainer>
    </section>

    <template v-else>
      <!-- ── Section filtered by category ─────────────────── -->
      <section
        v-if="activeCategory"
        class="blog-section"
      >
        <BaseContainer>
          <div class="blog-section__header">
            <h2 class="blog-section__title">{{ activeCategory }}</h2>
            <button
              class="filter-clear"
              @click="((activeCategory = ''), watchReset())"
            >
              ← Todas as categorias
            </button>
          </div>
          <div
            v-if="filteredByCat.length"
            class="blog-grid blog-grid--4"
          >
            <PostCard
              v-for="post in filteredByCat"
              :key="post.slug"
              :post="post"
              variant="grid"
            />
          </div>
          <div
            v-else
            class="blog-empty"
          >
            <p>Nenhum post nessa categoria ainda.</p>
          </div>
        </BaseContainer>
      </section>

      <!-- ── Section: Recent ───────────────────────────────── -->
      <section
        v-else
        class="blog-section"
      >
        <BaseContainer>
          <div class="blog-section__header">
            <h2 class="blog-section__title">Recentes</h2>
          </div>

          <!-- Layout: side highlight + grid -->
          <div
            v-if="recentPosts.length"
            class="blog-recent"
          >
            <!-- Featured post (first) -->
            <PostCard
              v-if="recentPosts[0]"
              :post="recentPosts[0]"
              variant="featured"
              class="blog-recent__featured"
            />

            <!-- 4-column grid with the rest -->
            <div
              v-if="recentPosts.length > 1"
              class="blog-grid blog-grid--4 blog-recent__grid"
            >
              <PostCard
                v-for="post in recentPosts.slice(1, visibleLimit)"
                :key="post.slug"
                :post="post"
                variant="grid"
              />
            </div>

            <div
              v-if="hasMore"
              class="blog-load-more"
            >
              <BaseButton
                variant="secondary"
                @click="loadMore"
                >Carregar mais</BaseButton
              >
            </div>
          </div>
        </BaseContainer>
      </section>

      <!-- ── Sections by category ─────────────────────────── -->
      <template v-if="!activeCategory">
        <section
          v-for="{ category, posts: catPosts } in categoryGroups"
          :key="category"
          class="blog-section blog-section--category"
        >
          <BaseContainer>
            <div class="blog-section__header">
              <h2 class="blog-section__title">{{ category }}</h2>
              <button
                class="filter-clear"
                @click="((activeCategory = category), watchReset())"
              >
                Ver todos →
              </button>
            </div>

            <div class="blog-grid blog-grid--4">
              <PostCard
                v-for="post in catPosts"
                :key="post.slug"
                :post="post"
                variant="grid"
              />
            </div>
          </BaseContainer>
        </section>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import { posts as allPosts } from 'virtual:blog-posts'
import type { Post, CategoryCount } from 'virtual:blog-posts'

import { usePageMeta, useBlog } from '@/composables'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import PostCard from '@/components/blog/PostCard.vue'
import BlogPagination from '@/components/blog/BlogPagination.vue'

usePageMeta({
  title: 'Blog',
  description: 'Insights sobre Employer Branding, Endomarketing e Comunicação Interna.',
})

const route = useRoute()
const { query, activeCategory, page, paginated, total, totalPages, categories, setPage, watchReset } = useBlog({
  perPage: 12,
})

// Applies the URL filter
if (route.query.categoria) {
  activeCategory.value = decodeURIComponent(route.query.categoria as string)
}

// ── Recent posts with "load more" ─────────────────────────
const INITIAL_LIMIT = 8
const visibleLimit = ref(INITIAL_LIMIT)
const recentPosts = computed(() => allPosts.slice(0, visibleLimit.value + 1))
const hasMore = computed(() => allPosts.length > visibleLimit.value + 1)
const loadMore = () => {
  visibleLimit.value += 8
}

// ── Posts filtered when a category is active ──────────────
const filteredByCat = computed(() =>
  allPosts.filter((p: Post) => p.category.toLowerCase() === activeCategory.value.toLowerCase())
)

// ── Groups by category (max 4 per group) ───────────────────
const categoryGroups = computed(() =>
  categories
    .map(({ category }: CategoryCount) => ({
      category,
      posts: allPosts.filter((p: Post) => p.category === category).slice(0, 4),
    }))
    .filter((g: { category: string; posts: Post[] }) => g.posts.length > 0)
)
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Hero ───────────────────────────────────────────────────
.blog-hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 3.5rem 0 2.5rem;
}

.blog-hero__inner {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;

  h1 {
    margin-bottom: 0;
    font-size: clamp(1.8rem, 3vw, 3rem);
  }

  @include respond-to(md) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.blog-search-field {
  position: relative;
  width: 320px;
  flex-shrink: 0;

  &__icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.875rem;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 2.75rem;
    border: 1.5px solid var(--border);
    border-radius: var(--radius-pill);
    background: var(--bg);
    font-size: 0.875rem;
    color: var(--text);
    outline: none;
    transition:
      border-color 0.15s,
      box-shadow 0.15s;

    &:focus {
      border-color: var(--purple-400);
      box-shadow: 0 0 0 3px rgba(var(--purple-rgb), 0.1);
    }
    &::placeholder {
      color: var(--subtle);
    }
  }

  &__clear {
    position: absolute;
    right: 0.875rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--subtle);
    font-size: 0.85rem;
    line-height: 1;
    &:hover {
      color: var(--text);
    }
  }

  @include respond-to(md) {
    width: 100%;
  }
}

// ── Categories bar ─────────────────────────────────────────
.blog-categories-bar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0.75rem 0;
  position: sticky;
  top: 76px;
  z-index: 10;
}

.blog-filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.filter-pill {
  padding: 0.35rem 0.875rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid transparent;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: var(--text);
    background: var(--bg-alt);
  }

  &.active {
    background: var(--purple-100);
    color: var(--purple-700);
    border-color: var(--purple-100);
  }
}

// ── Sections ───────────────────────────────────────────────
.blog-section {
  padding: 3rem 0;

  & + & {
    border-top: 1px solid var(--border-subtle);
  }

  &--category {
    padding: 2.5rem 0;
  }
}

.blog-section__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.75rem;
}

.blog-section__title {
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text);
  margin: 0;
  letter-spacing: -0.02em;

  em {
    font-style: normal;
    color: var(--purple);
  }
}

.filter-clear {
  background: none;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--purple);
  cursor: pointer;
  padding: 0;
  &:hover {
    text-decoration: underline;
  }
}

// ── Grids ──────────────────────────────────────────────────
.blog-grid--4 {
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

// ── Recent: featured on top + grid below ───────────────────
.blog-recent {
}

.blog-recent__featured {
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-subtle);
}

.blog-recent__grid {
}

// ── Load more ──────────────────────────────────────────────
.blog-load-more {
  margin-top: 2.5rem;
  text-align: center;
}

// ── Empty state ────────────────────────────────────────────
.blog-empty {
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
