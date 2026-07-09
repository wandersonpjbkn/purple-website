import { describe, it, expect, beforeAll, vi } from 'vitest'

vi.mock('@/composables/useBlogData', async () => {
  const { ref, computed } = await import('vue')

  const posts = ref([
    {
      title: 'Post A',
      slug: 'post-a',
      excerpt: 'Como estruturar a comunicação interna',
      date: '2026-01-10',
      author: 'ana',
      category: 'Cultura',
      tags: [],
      readTime: 4,
      featured: true,
      cover: '',
      wordCount: 120,
    },
    {
      title: 'Post B',
      slug: 'post-b',
      excerpt: 'Employer branding na prática',
      date: '2026-02-15',
      author: 'ana',
      category: 'Cultura',
      tags: [],
      readTime: 6,
      featured: false,
      cover: '',
      wordCount: 200,
    },
    {
      title: 'Post C',
      slug: 'post-c',
      excerpt: 'Indicadores de clima organizacional',
      date: '2026-03-20',
      author: 'bia',
      category: 'RH',
      tags: [],
      readTime: 3,
      featured: false,
      cover: '',
      wordCount: 80,
    },
  ])

  const categories = computed(() => {
    const map = new Map<string, number>()
    for (const post of posts.value) {
      map.set(post.category, (map.get(post.category) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count }))
  })

  return {
    useBlogData: () => ({
      posts,
      categories,
      isLoading: ref(false),
      isReady: ref(true),
      loadIndex: vi.fn().mockResolvedValue(undefined),
      getPost: vi.fn().mockResolvedValue(null),
    }),
  }
})

import { useBlog, formatDate } from '@/composables/useBlog'

beforeAll(() => {
  // jsdom não implementa scrollTo; setPage o usa.
  vi.stubGlobal('scrollTo', vi.fn())
})

describe('useBlog', () => {
  it('carrega posts e categorias do useBlogData', () => {
    const blog = useBlog()
    expect(blog.total.value).toBeGreaterThan(0)
    expect(Array.isArray(blog.categories.value)).toBe(true)
  })

  it('busca por termo inexistente zera os resultados', () => {
    const blog = useBlog()
    blog.query.value = '___nada_que_exista___'
    expect(blog.filtered.value).toHaveLength(0)
  })

  it('filtra por categoria real', () => {
    const blog = useBlog()
    const cat = blog.categories.value[0]?.category
    expect(cat).toBeTruthy()
    blog.activeCategory.value = cat as string
    expect(blog.filtered.value.length).toBeGreaterThan(0)
    expect(blog.filtered.value.every(p => p.category.toLowerCase() === (cat as string).toLowerCase())).toBe(true)
  })

  it('pagina conforme perPage', () => {
    const blog = useBlog({ perPage: 1 })
    expect(blog.paginated.value).toHaveLength(1)
    expect(blog.totalPages.value).toBe(blog.total.value)
  })

  it('setPage faz clamp dentro do intervalo válido', () => {
    const blog = useBlog({ perPage: 1 })
    blog.setPage(9999)
    expect(blog.page.value).toBe(blog.totalPages.value)
    blog.setPage(-5)
    expect(blog.page.value).toBe(1)
  })

  it('clearFilters reseta busca, categoria e página', () => {
    const blog = useBlog({ perPage: 1 })
    blog.query.value = 'x'
    blog.activeCategory.value = 'y'
    blog.setPage(2)
    blog.clearFilters()
    expect(blog.query.value).toBe('')
    expect(blog.activeCategory.value).toBe('')
    expect(blog.page.value).toBe(1)
  })
})

describe('formatDate', () => {
  it('formata ISO em pt-BR', () => {
    expect(formatDate('2026-01-15')).toMatch(/2026/)
  })
})
