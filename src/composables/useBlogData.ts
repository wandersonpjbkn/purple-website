import { computed, ref } from 'vue'

import { useBlogCache } from '@/composables/useBlogCache'

import type { CategoryCount, Post, PostMeta } from '@/types/blog'

const API_URL: string = import.meta.env.VITE_POSTS_API_URL || 'http://localhost:8787'

// Skip background revalidation when the index was fetched moments ago
// (every page mount calls loadIndex; this throttles the network side).
const REVALIDATE_COOLDOWN_MS = 60_000

// Module-level singleton: Home, Blog, Post and Author share one index fetch.
const posts = ref<PostMeta[]>([])
const isLoading = ref(false)
const isReady = ref(false)

let indexStamp = ''
let lastFetchAt = 0
let inFlight: Promise<void> | null = null

const cache = useBlogCache()

const categories = computed<CategoryCount[]>(() => {
  const map = new Map<string, number>()
  for (const post of posts.value) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([category, count]) => ({ category, count }))
})

// Fallback stamp when the ETag header is missing (djb2 over the raw payload).
const hashStamp = (payload: string): string => {
  let hash = 5381
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash + payload.charCodeAt(i)) >>> 0
  }
  return `local-${hash.toString(16)}`
}

const fetchIndex = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/index`)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const payload = await response.text()
    const stamp = response.headers.get('ETag') ?? hashStamp(payload)
    lastFetchAt = Date.now()

    if (stamp !== indexStamp) {
      posts.value = JSON.parse(payload) as PostMeta[]
      indexStamp = stamp
      cache.writeIndex({ posts: posts.value, stamp, fetchedAt: lastFetchAt })
    }
  } catch (err) {
    // Silent-failure doctrine: keep whatever we have (cached index or []).
    console.error('[blog] falha ao buscar o índice de posts:', err)
  } finally {
    isLoading.value = false
    isReady.value = true
  }
}

/**
 * Stale-while-revalidate: serve the IndexedDB copy immediately (when there is
 * one), then refresh from the worker in the background. Concurrent callers
 * share the same in-flight promise.
 */
const loadIndex = (): Promise<void> => {
  if (inFlight) return inFlight
  if (lastFetchAt && Date.now() - lastFetchAt < REVALIDATE_COOLDOWN_MS) return Promise.resolve()

  inFlight = (async () => {
    if (!isReady.value) {
      const cached = await cache.readIndex()
      if (cached) {
        posts.value = cached.posts
        indexStamp = cached.stamp
        isReady.value = true
      } else {
        isLoading.value = true
      }
    }
    await fetchIndex()
  })().finally(() => {
    inFlight = null
  })

  return inFlight
}

/**
 * Single post, IndexedDB-first: a cached copy stamped by the current index is
 * fresh by definition; anything else goes to the network, falling back to the
 * stale copy when offline. 404 resolves to null.
 */
const getPost = async (slug: string): Promise<Post | null> => {
  // The index provides the freshness stamp (and pages need it anyway).
  await loadIndex()

  const cached = await cache.readPost(slug)
  if (cached && indexStamp && cached.stamp === indexStamp) return cached.post

  try {
    const response = await fetch(`${API_URL}/posts/${encodeURIComponent(slug)}`)
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const post = (await response.json()) as Post
    cache.writePost({ slug: post.slug, post, stamp: indexStamp, fetchedAt: Date.now() })
    return post
  } catch (err) {
    console.error(`[blog] falha ao buscar o post "${slug}":`, err)
    return cached?.post ?? null
  }
}

export const useBlogData = () => ({
  posts,
  isLoading,
  isReady,
  categories,
  loadIndex,
  getPost,
})
