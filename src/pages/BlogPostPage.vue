<template>
  <div v-if="post">
    <!-- ── Hero ──────────────────────────────────────── -->
    <section class="post-hero">
      <BaseContainer>
        <nav
          class="post-breadcrumb"
          aria-label="Navegação"
        >
          <RouterLink to="/blog">Blog</RouterLink>
          <span aria-hidden="true">›</span>
          <RouterLink :to="`/blog?categoria=${encodeURIComponent(post.category)}`">
            {{ post.category }}
          </RouterLink>
          <span aria-hidden="true">›</span>
          <span aria-current="page">{{ post.title }}</span>
        </nav>

        <div class="post-hero__inner">
          <div class="post-hero__meta">
            <RouterLink
              :to="`/blog?categoria=${encodeURIComponent(post.category)}`"
              class="post-category-badge"
              >{{ post.category }}</RouterLink
            >
            <span
              class="post-hero__sep"
              aria-hidden="true"
              >·</span
            >
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <span
              class="post-hero__sep"
              aria-hidden="true"
              >·</span
            >
            <span>{{ post.readTime }} min de leitura</span>
          </div>

          <h1>{{ post.title }}</h1>
          <p class="post-hero__excerpt">{{ post.excerpt }}</p>

          <RouterLink
            v-if="author"
            :to="`/blog/autor/${post.author}`"
            class="post-hero__author"
          >
            <BaseAvatar
              :name="author.name"
              size="md"
            />
            <div>
              <strong>{{ author.name }}</strong>
              <span>{{ author.role }}</span>
            </div>
          </RouterLink>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Conteúdo ───────────────────────────────────── -->
    <section class="section-block section-block--sm">
      <BaseContainer>
        <div class="post-layout-grid">
          <!-- Sumário lateral -->
          <aside
            class="post-toc"
            aria-label="Sumário do artigo"
          >
            <div
              v-if="headings.length"
              class="sidebar-box"
            >
              <h3>Neste artigo</h3>
              <ul>
                <li
                  v-for="h in headings"
                  :key="h.id"
                >
                  <a
                    :href="`#${h.id}`"
                    :class="{ 'toc-h3': h.level === 3 }"
                    >{{ h.text }}</a
                  >
                </li>
              </ul>
            </div>

            <div class="sidebar-box">
              <h3>Categoria</h3>
              <RouterLink
                :to="`/blog?categoria=${encodeURIComponent(post.category)}`"
                class="sidebar-category-link"
                >{{ post.category }}</RouterLink
              >
            </div>
          </aside>

          <!-- Corpo do post -->
          <div class="post-body">
            <article
              class="prose"
              v-html="post.html"
            />

            <!-- Convite contextual ao serviço relacionado ao tema -->
            <aside
              v-if="relatedService"
              class="post-service-cta"
            >
              <span class="post-service-cta__icon"><BaseIcon :name="relatedService.icon" /></span>
              <div class="post-service-cta__body">
                <p class="post-service-cta__eyebrow">Como a Purple ajuda</p>
                <h3>{{ relatedService.title }}</h3>
                <p class="post-service-cta__text">{{ relatedService.summary }}</p>
                <RouterLink
                  class="text-link"
                  :to="`/servicos#${relatedService.id}`"
                >
                  Ver esse serviço
                </RouterLink>
              </div>
            </aside>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── CTA de conversão ao fim do artigo ──────────── -->
    <CtaBanner
      eyebrow="Do conteúdo à prática"
      title="Quer aplicar isso na sua empresa?"
      description="A gente assume a execução da comunicação com o seu time — dos comunicados internos ao employer branding."
      :whatsapp-message="whatsappMessage"
      content-to="/servicos"
      content-label="Conhecer os serviços"
    />

    <!-- ── Card do autor ──────────────────────────────── -->
    <section
      v-if="author"
      class="section-block section-block--sm post-author-section"
    >
      <BaseContainer>
        <h2 class="sr-only">Sobre o autor</h2>
        <div class="post-author-card">
          <BaseAvatar
            :name="author.name"
            size="lg"
          />
          <div class="post-author-card__info">
            <p class="section-eyebrow">Escrito por</p>
            <h3>{{ author.name }}</h3>
            <p class="post-author-card__role">{{ author.role }}</p>
            <p>{{ author.bio }}</p>
            <RouterLink
              :to="`/blog/autor/${post.author}`"
              class="text-link"
            >
              Ver todos os posts
            </RouterLink>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Posts relacionados ────────────────────────── -->
    <section
      v-if="related.length"
      class="section-block section-block--surface"
    >
      <BaseContainer>
        <div class="post-related-header">
          <div>
            <p class="section-eyebrow">Continue lendo</p>
            <h2>Você também pode gostar</h2>
          </div>
          <RouterLink
            class="text-link"
            to="/blog"
            >Ver todos</RouterLink
          >
        </div>
        <div class="post-related-grid">
          <PostCard
            v-for="p in related"
            :key="p.slug"
            :post="p"
            variant="grid"
          />
        </div>
      </BaseContainer>
    </section>
  </div>

  <!-- 404 — só depois da carga terminar, nunca durante o loading -->
  <section
    v-else-if="state === 'not-found'"
    class="section-block"
  >
    <BaseContainer>
      <h1>Post não encontrado</h1>
      <p>O post que você está procurando não existe ou foi removido.</p>
      <div class="button-row">
        <BaseButton
          tag="RouterLink"
          to="/blog"
          >← Voltar para o blog</BaseButton
        >
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'

import { formatDate, getAuthor, usePageMeta, useBlogData } from '@/composables'
import services from '@/data/services.json'

import type { Post, PostMeta } from '@/types/blog'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseAvatar from '@/components/ui/avatar/BaseAvatar.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import PostCard from '@/components/blog/PostCard.vue'

const route = useRoute()
const router = useRouter()

const { posts, getPost } = useBlogData()

onMounted(() => {
  if (!route.params.slug) return router.push({ name: 'blog' })
})

const slug = computed(() => {
  const s = route.params.slug!
  return Array.isArray(s) ? (s[0] ?? '') : s
})

const post = ref<Post | null>(null)
const state = ref<'loading' | 'ready' | 'not-found'>('loading')

watch(
  slug,
  async value => {
    if (!value) return
    state.value = 'loading'
    const loaded = await getPost(value)
    // Quick navigation guard: only the latest slug may resolve the state.
    if (slug.value !== value) return
    post.value = loaded
    state.value = loaded ? 'ready' : 'not-found'
  },
  { immediate: true }
)

const author = computed(() => (post.value ? getAuthor(post.value.author) : undefined))

usePageMeta(
  computed(() => ({
    title: post.value?.title ?? 'Post',
    description: post.value?.excerpt ?? '',
    type: 'article' as const,
  }))
)

const whatsappMessage = computed(
  () =>
    `Olá! Li o artigo "${post.value?.title ?? ''}" no blog da Purple e quero conversar sobre isso. [mensagem provisória — copy final pendente]`
)

const relatedService = computed(() => {
  const cat = post.value?.category
  if (!cat) return undefined
  return services.catalog.find(s => s.blogCategories?.includes(cat))
})

// Posts relacionados — metadados do índice bastam para os cards
const related = computed(() => {
  const current = post.value
  if (!current) return []
  return posts.value
    .filter(
      (p: PostMeta) => p.slug !== current.slug && (p.category === current.category || p.author === current.author)
    )
    .slice(0, 3)
})

// Sumário — extrai h2/h3 com id do HTML gerado pelo plugin
const headings = computed(() => {
  const current = post.value
  if (!current) return []
  const re = /<h([23])\s+id="([^"]+)"[^>]*>([\s\S]*?)<\/h[23]>/gi
  const result: { level: number; id: string; text: string }[] = []
  let m: RegExpExecArray | null
  while ((m = re.exec(current.html)) !== null) {
    result.push({
      level: parseInt(m[1] ?? '2'),
      id: m[2] ?? '',
      // eslint-disable-next-line sonarjs/super-linear-regex -- single unbounded group, no nested/overlapping quantifiers; verified empirically.
      text: (m[3] ?? '').replace(/<[^>]+>/g, ''),
    })
  }
  return result
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Hero ───────────────────────────────────────────────────
.post-hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: var(--space-12) 0 var(--space-10);
}

.post-breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.8rem;
  color: var(--subtle);
  margin-bottom: var(--space-8);
  flex-wrap: wrap;

  a {
    color: var(--muted);
    transition: color 0.15s;
    &:hover {
      color: var(--purple);
    }
  }

  span[aria-current] {
    color: var(--text);
    font-weight: 500;
  }
}

.post-hero__inner {
  max-width: 760px;
}

.post-hero__meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.82rem;
  color: var(--subtle);
  margin-bottom: var(--space-5);
  flex-wrap: wrap;
}

.post-category-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--purple);
  background: var(--purple-100);
  padding: 0.2rem 0.625rem;
  border-radius: var(--radius-pill);
  transition: background 0.15s;
  &:hover {
    background: var(--purple-50);
  }
}

.post-hero__sep {
  color: var(--border);
}

.post-hero__inner h1 {
  font-size: clamp(1.8rem, 3.5vw, 3rem);
  margin-bottom: var(--space-4);
}

.post-hero__excerpt {
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: var(--space-6);
  max-width: 65ch;
}

.post-hero__author {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--text);
  text-decoration: none;

  div {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    line-height: 100%;
  }

  strong {
    font-size: 0.9rem;
    font-weight: 700;
  }
  span {
    font-size: 0.78rem;
    color: var(--subtle);
  }

  &:hover strong {
    color: var(--purple);
  }
}

// ── Layout: sumário + prose ────────────────────────────────
.post-layout-grid {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-12);
  align-items: start;

  @include respond-to(lg) {
    grid-template-columns: 1fr;
  }
}

// ── Sumário ────────────────────────────────────────────────
.post-toc {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);

  @include respond-to(lg) {
    display: none;
  }
}

.toc-h3 {
  padding-left: 0.875rem;
}

// ── Prose ──────────────────────────────────────────────────
.prose {
  font-size: var(--text-base);
  line-height: 1.8;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  box-shadow: var(--shadow-sm);
  min-width: 0; // evita overflow em grid

  :deep(h2) {
    font-size: var(--text-xl);
    font-weight: 700;
    margin: var(--space-10) 0 var(--space-4);
    padding-top: var(--space-8);
    border-top: 1px solid var(--border-subtle);
    color: var(--text);
    letter-spacing: -0.02em;
    &:first-child {
      margin-top: 0;
      padding-top: 0;
      border-top: none;
    }
  }

  :deep(h3) {
    font-size: 1.15rem;
    font-weight: 700;
    margin: var(--space-8) 0 var(--space-3);
    color: var(--text);
  }

  :deep(p) {
    margin-bottom: var(--space-5);
    color: var(--muted);
  }
  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(strong) {
    color: var(--text);
    font-weight: 700;
  }
  :deep(em) {
    font-style: italic;
  }

  :deep(a) {
    color: var(--purple);
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  :deep(ul) {
    list-style: disc;
    padding-left: var(--space-6);
    margin-bottom: var(--space-5);
  }
  :deep(ol) {
    list-style: decimal;
    padding-left: var(--space-6);
    margin-bottom: var(--space-5);
  }
  :deep(li) {
    color: var(--muted);
    margin-bottom: var(--space-2);
    line-height: 1.7;
  }

  :deep(blockquote) {
    margin: var(--space-8) 0;
    padding: var(--space-5) var(--space-6);
    background: var(--bg-alt);
    border-left: 4px solid var(--lime);
    border-radius: 0 var(--radius) var(--radius) 0;
    p {
      color: var(--muted);
      font-style: italic;
      margin: 0;
    }
  }

  :deep(code) {
    background: var(--purple-100);
    color: var(--purple-700);
    padding: 0.15rem 0.4rem;
    border-radius: 6px;
    font-size: 0.875em;
  }

  :deep(pre) {
    background: var(--purple-900);
    border-radius: var(--radius);
    padding: var(--space-6);
    overflow-x: auto;
    margin-bottom: var(--space-6);
    code {
      background: none;
      color: #e8d5ff;
      font-size: var(--text-sm);
      padding: 0;
    }
  }

  :deep(table) {
    display: block;
    overflow-x: auto;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: var(--space-6);
    font-size: 0.9rem;
    th {
      background: var(--bg-alt);
      padding: var(--space-3) var(--space-4);
      text-align: left;
      font-weight: 700;
      color: var(--text);
      border-bottom: 2px solid var(--border);
    }
    td {
      padding: var(--space-3) var(--space-4);
      border-bottom: 1px solid var(--border-subtle);
      color: var(--muted);
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:hover td {
      background: var(--bg-alt);
    }
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: var(--space-10) 0;
  }

  // Só imagens de conteúdo do markdown (filhas diretas de p/figure);
  // nunca alcança o <img> de um avatar (que é filho de span.avatar).
  :deep(p > img),
  :deep(figure img) {
    width: 100%;
    border-radius: var(--radius-lg);
    margin: var(--space-6) 0;
  }
}

// ── Convite ao serviço relacionado ─────────────────────────
.post-body {
  min-width: 0;
}

.post-service-cta {
  display: flex;
  gap: var(--space-5);
  align-items: flex-start;
  margin-top: var(--space-6);
  padding: 1.75rem;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-left: 4px solid var(--lime);
  border-radius: var(--radius-lg);

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: var(--radius);
    background: var(--purple-100);
    color: var(--purple);
    display: grid;
    place-items: center;
    font-size: 22px;
    flex-shrink: 0;
  }

  &__eyebrow {
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--lime-ink);
    margin-bottom: var(--space-1);
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }

  &__text {
    font-size: 0.9rem;
    color: var(--muted);
    margin-bottom: var(--space-3);
  }
}

// ── Card autor ─────────────────────────────────────────────
.post-author-section {
  background: var(--bg-alt);
  border-top: 1px solid var(--border);
}

.post-author-card {
  display: flex;
  gap: var(--space-8);
  align-items: flex-start;

  @include respond-to(sm) {
    flex-direction: column;
    gap: var(--space-5);
  }
}

.post-author-card__info {
  h3 {
    font-size: var(--text-lg);
    margin-bottom: 0.2rem;
  }
}

.post-author-card__role {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: var(--space-3);
}

// ── Relacionados ───────────────────────────────────────────
.post-related-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-8);
  margin-bottom: var(--space-8);

  h2 {
    margin-bottom: 0;
  }
}

.post-related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @include respond-to(lg) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond-to(sm) {
    grid-template-columns: 1fr;
  }
}
</style>
