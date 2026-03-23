// src/composables/useBlog.ts
// Composable central — filtros, busca, paginação

import { computed, ref, type Ref } from 'vue'
import {
  posts as allPosts,
  getAllCategories,
  type Post,
} from 'virtual:blog-posts'
import authors from '@/data/authors.json'
import type { Author } from '@/types/blog'

// ── Utilitários ───────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(iso + 'T00:00:00'))
}

export function getAuthor(slug: string): Author | undefined {
  return (authors as Author[]).find(a => a.slug === slug)
}

// ── Composable principal ──────────────────────────────────
export function useBlog(options?: {
  initialCategory?: Ref<string>
  initialQuery?:    Ref<string>
  perPage?: number
}) {
  const query          = options?.initialQuery    ?? ref('')
  const activeCategory = options?.initialCategory ?? ref('')
  const page           = ref(1)
  const perPage        = options?.perPage ?? 9

  const filtered = computed(() => {
    let result = allPosts

    if (activeCategory.value) {
      result = result.filter(
        p => p.category.toLowerCase() === activeCategory.value.toLowerCase()
      )
    }

    const q = query.value.trim().toLowerCase()
    if (q) {
      result = result.filter(p =>
        p.title.toLowerCase().includes(q)   ||
        p.excerpt.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      )
    }

    return result
  })

  const totalPages = computed(() => Math.ceil(filtered.value.length / perPage))
  const paginated  = computed(() =>
    filtered.value.slice((page.value - 1) * perPage, page.value * perPage)
  )

  function setPage(n: number) {
    page.value = Math.min(Math.max(1, n), totalPages.value || 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function clearFilters() {
    query.value          = ''
    activeCategory.value = ''
    page.value           = 1
  }

  function watchReset() {
    page.value = 1
  }

  return {
    query,
    activeCategory,
    page,
    filtered,
    paginated,
    totalPages,
    total:      computed(() => filtered.value.length),
    categories: getAllCategories(),
    setPage,
    clearFilters,
    watchReset,
  }
}
