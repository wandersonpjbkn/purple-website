import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'

import { useBlogCache } from '@/composables/useBlogCache'

import type { CachedIndex, CachedPost } from '@/composables/useBlogCache'
import type { Post, PostMeta } from '@/types/blog'

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

const post: Post = { ...meta, html: '<p>corpo</p>' }

beforeEach(() => {
  // Fresh in-memory IndexedDB per test.
  vi.stubGlobal('indexedDB', new IDBFactory())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useBlogCache', () => {
  it('faz round-trip do índice', async () => {
    const cache = useBlogCache()
    const entry: CachedIndex = { posts: [meta], stamp: 'W/"abc"', fetchedAt: Date.now() }

    await cache.writeIndex(entry)
    const read = await cache.readIndex()

    expect(read?.stamp).toBe('W/"abc"')
    expect(read?.posts).toHaveLength(1)
    expect(read?.posts[0]?.slug).toBe('post-a')
  })

  it('faz round-trip de um post pelo slug', async () => {
    const cache = useBlogCache()
    const entry: CachedPost = { slug: post.slug, post, stamp: 'W/"abc"', fetchedAt: Date.now() }

    await cache.writePost(entry)
    const read = await cache.readPost('post-a')

    expect(read?.post.html).toContain('corpo')
  })

  it('resolve null quando não há nada gravado', async () => {
    const cache = useBlogCache()
    expect(await cache.readIndex()).toBeNull()
    expect(await cache.readPost('nao-existe')).toBeNull()
  })

  it('degrada para null/no-op quando IndexedDB não está disponível', async () => {
    vi.stubGlobal('indexedDB', undefined)
    const cache = useBlogCache()

    await expect(cache.writeIndex({ posts: [], stamp: 'x', fetchedAt: 0 })).resolves.toBeUndefined()
    expect(await cache.readIndex()).toBeNull()
  })
})
