// src/types/blog.d.ts

declare module 'virtual:blog-posts' {
  export interface Post {
    title: string
    slug: string
    excerpt: string
    date: string       // ISO "2026-03-01"
    author: string     // slug do autor
    category: string
    tags: string[]     // mantido no frontmatter, mas não usado na UI
    readTime: number
    featured: boolean
    cover: string
    html: string       // corpo convertido para HTML pelo plugin
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

// Autor — importado de src/data/authors.json
export interface Author {
  slug: string
  name: string
  role: string
  bio: string
  avatar: string   // caminho relativo, ex: "/images/team/suelen.jpg"
  linkedin: string
}
