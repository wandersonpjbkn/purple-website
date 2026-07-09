// Blog data contracts — mirror of the worker payloads
// (/index returns PostMeta[]; /posts/:slug returns a full Post).

export interface PostMeta {
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
  wordCount: number
}

export interface Post extends PostMeta {
  html: string
}

export interface CategoryCount {
  category: string
  count: number
}
