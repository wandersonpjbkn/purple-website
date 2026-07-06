/// <reference types="vite/client" />

// vite-svg-loader: importar SVG como componente Vue (`...svg?component`).
declare module '*.svg?component' {
  import type { FunctionalComponent, SVGAttributes } from 'vue'
  const component: FunctionalComponent<SVGAttributes>
  export default component
}

declare module 'virtual:blog-posts' {
  export interface Post {
    title: string
    slug: string
    excerpt: string
    date: string
    author: string
    category: string
    tags: string[]
    readTime: number
    featured: boolean
    cover: string
    html: string
    wordCount: number
  }

  export interface CategoryCount {
    category: string
    count: number
  }

  export const posts: Post[]
  export function getPost(slug: string): Post | null
  export function getPostsByAuthor(authorSlug: string): Post[]
  export function getPostsByCategory(category: string): Post[]
  export function getFeaturedPosts(limit?: number): Post[]
  export function getAllCategories(): CategoryCount[]
}
