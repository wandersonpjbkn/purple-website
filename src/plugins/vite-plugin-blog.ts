import type { Plugin } from 'vite'

const VIRTUAL_ID = 'virtual:blog-posts'
const RESOLVED = '\0' + VIRTUAL_ID

export const blogPlugin = (workerUrl?: string): Plugin => {
  return {
    name: 'vite-plugin-blog',

    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED
    },

    async load(id: string) {
      if (id !== RESOLVED) return

      const API_URL = workerUrl ? `${workerUrl}/posts` : 'http://localhost:8787/posts'

      try {
        console.log(`[vite-plugin-blog] Buscando posts de: ${API_URL}`)

        const response = await fetch(API_URL)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const blogPosts = await response.json()

        return `
export const posts = ${JSON.stringify(blogPosts, null, 0)};

export function getPost(slug) {
  return posts.find(p => p.slug === slug) ?? null;
}

export function getPostsByAuthor(authorSlug) {
  return posts.filter(p => p.author === authorSlug);
}

export function getPostsByCategory(category) {
  return posts.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedPosts(limit = 3) {
  return posts.filter(p => p.featured).slice(0, limit);
}

export function getAllCategories() {
  const map = new Map();
  for (const post of posts) {
    map.set(post.category, (map.get(post.category) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
}
`
      } catch (error: any) {
        console.error('[vite-plugin-blog] Erro ao carregar posts do R2:', error.message)
        return `
export const posts = [];
export function getPost() { return null; }
export function getPostsByAuthor() { return []; }
export function getPostsByCategory() { return []; }
export function getFeaturedPosts() { return []; }
export function getAllCategories() { return []; }
`
      }
    },
  }
}
