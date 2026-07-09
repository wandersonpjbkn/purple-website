import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import type { CachedIndex, CachedPost } from '@/composables/useBlogCache'
import type { Post, PostMeta } from '@/types/blog'

// In-memory stand-in for the IndexedDB layer, reset per test.
const cacheState: { index: CachedIndex | null; posts: Record<string, CachedPost> } = { index: null, posts: {} }

vi.mock('@/composables/useBlogCache', () => ({
  useBlogCache: () => ({
    readIndex: () => Promise.resolve(cacheState.index),
    writeIndex: (entry: CachedIndex) => {
      cacheState.index = entry
      return Promise.resolve()
    },
    readPost: (slug: string) => Promise.resolve(cacheState.posts[slug] ?? null),
    writePost: (entry: CachedPost) => {
      cacheState.posts[entry.slug] = entry
      return Promise.resolve()
    },
  }),
}))

const meta: PostMeta = {
  title: 'Post A',
  slug: 'post-a',
  excerpt: 'Resumo',
  date: '2026-01-10',
  author: 'ana',
  category: 'Cultura',
  tags: [],
  readTime: 4,
  featured: false,
  cover: '',
  wordCount: 120,
}

const fullPost: Post = { ...meta, html: '<p>corpo</p>' }

const jsonResponse = (body: unknown, headers: Record<string, string> = {}, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })

// useBlogData keeps module-level singleton state — re-import fresh per test.
const freshUseBlogData = async () => {
  vi.resetModules()
  const module = await import('@/composables/useBlogData')
  return module.useBlogData()
}

const fetchMock = vi.fn()

beforeEach(() => {
  cacheState.index = null
  cacheState.posts = {}
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('useBlogData — loadIndex', () => {
  it('sem cache, busca o índice na rede e grava no cache', async () => {
    fetchMock.mockResolvedValue(jsonResponse([meta], { ETag: 'W/"v1"' }))
    const blog = await freshUseBlogData()

    await blog.loadIndex()

    expect(blog.posts.value).toHaveLength(1)
    expect(blog.isReady.value).toBe(true)
    expect(cacheState.index?.stamp).toBe('W/"v1"')
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:8787/index')
  })

  it('com cache, serve o índice e revalida contra a rede', async () => {
    cacheState.index = { posts: [meta], stamp: 'W/"old"', fetchedAt: 0 }
    const fresh = { ...meta, title: 'Post A (novo)' }
    fetchMock.mockResolvedValue(jsonResponse([fresh], { ETag: 'W/"new"' }))
    const blog = await freshUseBlogData()

    await blog.loadIndex()

    expect(blog.posts.value[0]?.title).toBe('Post A (novo)')
    expect(cacheState.index?.stamp).toBe('W/"new"')
  })

  it('falha de rede mantém o cache, não lança e marca pronto', async () => {
    cacheState.index = { posts: [meta], stamp: 'W/"old"', fetchedAt: 0 }
    fetchMock.mockRejectedValue(new Error('offline'))
    const blog = await freshUseBlogData()

    await expect(blog.loadIndex()).resolves.toBeUndefined()

    expect(blog.posts.value).toHaveLength(1)
    expect(blog.isReady.value).toBe(true)
  })

  it('falha de rede sem cache resulta em lista vazia pronta', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    const blog = await freshUseBlogData()

    await blog.loadIndex()

    expect(blog.posts.value).toHaveLength(0)
    expect(blog.isReady.value).toBe(true)
  })

  it('chamadas concorrentes compartilham o mesmo fetch', async () => {
    fetchMock.mockResolvedValue(jsonResponse([meta], { ETag: 'W/"v1"' }))
    const blog = await freshUseBlogData()

    await Promise.all([blog.loadIndex(), blog.loadIndex(), blog.loadIndex()])

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('expõe categorias contadas e ordenadas a partir do índice', async () => {
    const second: PostMeta = { ...meta, slug: 'post-b', category: 'RH' }
    const third: PostMeta = { ...meta, slug: 'post-c', category: 'RH' }
    fetchMock.mockResolvedValue(jsonResponse([meta, second, third], { ETag: 'W/"v1"' }))
    const blog = await freshUseBlogData()

    await blog.loadIndex()

    expect(blog.categories.value).toEqual([
      { category: 'RH', count: 2 },
      { category: 'Cultura', count: 1 },
    ])
  })
})

describe('useBlogData — getPost', () => {
  const routeFetch = (etag: string, post: Post | null) => {
    fetchMock.mockImplementation((url: string) => {
      if (url.endsWith('/index')) return Promise.resolve(jsonResponse([meta], { ETag: etag }))
      if (post) return Promise.resolve(jsonResponse(post))
      return Promise.resolve(new Response('', { status: 404 }))
    })
  }

  it('serve do cache quando o stamp bate com o índice atual', async () => {
    cacheState.posts['post-a'] = { slug: 'post-a', post: fullPost, stamp: 'W/"v1"', fetchedAt: 0 }
    routeFetch('W/"v1"', fullPost)
    const blog = await freshUseBlogData()

    const result = await blog.getPost('post-a')

    expect(result?.html).toContain('corpo')
    const postCalls = fetchMock.mock.calls.filter(([url]) => String(url).includes('/posts/'))
    expect(postCalls).toHaveLength(0)
  })

  it('stamp divergente refaz o fetch e atualiza o cache', async () => {
    cacheState.posts['post-a'] = {
      slug: 'post-a',
      post: { ...fullPost, html: '<p>velho</p>' },
      stamp: 'W/"old"',
      fetchedAt: 0,
    }
    routeFetch('W/"new"', fullPost)
    const blog = await freshUseBlogData()

    const result = await blog.getPost('post-a')

    expect(result?.html).toContain('corpo')
    expect(cacheState.posts['post-a']?.stamp).toBe('W/"new"')
  })

  it('retorna null para post inexistente (404)', async () => {
    routeFetch('W/"v1"', null)
    const blog = await freshUseBlogData()

    expect(await blog.getPost('nao-existe')).toBeNull()
  })

  it('falha de rede devolve a cópia stale quando existe', async () => {
    cacheState.posts['post-a'] = { slug: 'post-a', post: fullPost, stamp: 'W/"old"', fetchedAt: 0 }
    fetchMock.mockRejectedValue(new Error('offline'))
    const blog = await freshUseBlogData()

    const result = await blog.getPost('post-a')

    expect(result?.html).toContain('corpo')
  })
})
