import { describe, it, expect, beforeAll, vi } from 'vitest'

import { useBlog, formatDate } from '@/composables/useBlog'

beforeAll(() => {
  // jsdom não implementa scrollTo; setPage o usa.
  vi.stubGlobal('scrollTo', vi.fn())
})

describe('useBlog', () => {
  it('carrega posts e categorias do virtual:blog-posts', () => {
    const blog = useBlog()
    expect(blog.total.value).toBeGreaterThan(0)
    expect(Array.isArray(blog.categories)).toBe(true)
  })

  it('busca por termo inexistente zera os resultados', () => {
    const blog = useBlog()
    blog.query.value = '___nada_que_exista___'
    expect(blog.filtered.value.length).toBe(0)
  })

  it('filtra por categoria real', () => {
    const blog = useBlog()
    const cat = blog.categories[0]?.category
    expect(cat).toBeTruthy()
    blog.activeCategory.value = cat as string
    expect(blog.filtered.value.length).toBeGreaterThan(0)
    expect(blog.filtered.value.every((p) => p.category.toLowerCase() === (cat as string).toLowerCase())).toBe(true)
  })

  it('pagina conforme perPage', () => {
    const blog = useBlog({ perPage: 1 })
    expect(blog.paginated.value.length).toBe(1)
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
