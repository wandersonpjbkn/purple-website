import type { Post, PostMeta } from '@/types/blog'

const DB_NAME = 'purple-blog'
const DB_VERSION = 1
const META_STORE = 'meta'
const POSTS_STORE = 'posts'
const INDEX_KEY = 'index'

export interface CachedIndex {
  posts: PostMeta[]
  // Freshness token: the /index ETag. A new publish changes it, which also
  // invalidates every cached post carrying an older stamp.
  stamp: string
  fetchedAt: number
}

export interface CachedPost {
  slug: string
  post: Post
  stamp: string
  fetchedAt: number
}

// Every helper resolves null / no-ops on any failure (IndexedDB unavailable in
// private-mode Safari and jsdom) so callers degrade to network-only.
const openDb = (): Promise<IDBDatabase | null> =>
  new Promise(resolve => {
    if (typeof indexedDB === 'undefined') {
      resolve(null)
      return
    }

    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onupgradeneeded = () => {
        const db = request.result
        if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE)
        if (!db.objectStoreNames.contains(POSTS_STORE)) db.createObjectStore(POSTS_STORE, { keyPath: 'slug' })
      }
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => resolve(null)
      request.onblocked = () => resolve(null)
    } catch {
      resolve(null)
    }
  })

const readFrom = async <T>(store: string, key: string): Promise<T | null> => {
  const db = await openDb()
  if (!db) return null

  return new Promise(resolve => {
    try {
      const request = db.transaction(store, 'readonly').objectStore(store).get(key)
      request.onsuccess = () => {
        db.close()
        resolve((request.result as T | undefined) ?? null)
      }
      request.onerror = () => {
        db.close()
        resolve(null)
      }
    } catch {
      db.close()
      resolve(null)
    }
  })
}

const writeTo = async (store: string, value: unknown, key?: string): Promise<void> => {
  const db = await openDb()
  if (!db) return

  return new Promise(resolve => {
    try {
      const transaction = db.transaction(store, 'readwrite')
      transaction.objectStore(store).put(value, key)
      transaction.oncomplete = () => {
        db.close()
        resolve()
      }
      transaction.onerror = () => {
        db.close()
        resolve()
      }
      transaction.onabort = () => {
        db.close()
        resolve()
      }
    } catch {
      db.close()
      resolve()
    }
  })
}

export const useBlogCache = () => ({
  readIndex: () => readFrom<CachedIndex>(META_STORE, INDEX_KEY),
  writeIndex: (entry: CachedIndex) => writeTo(META_STORE, entry, INDEX_KEY),
  readPost: (slug: string) => readFrom<CachedPost>(POSTS_STORE, slug),
  writePost: (entry: CachedPost) => writeTo(POSTS_STORE, entry),
})
