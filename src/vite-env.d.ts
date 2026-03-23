/// <reference types="vite/client" />

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
