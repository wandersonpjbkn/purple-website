export interface Env {
  BLOG_DEPLOY_TOKEN: string
  RENDER_DEPLOY_HOOK: string

  POSTS_BUCKET: R2Bucket

  ALLOWED_ORIGIN: string
  ALLOWED_ORIGIN_WWW: string
}

export interface RawFrontmatter {
  title?: string
  slug?: string
  excerpt?: string
  date?: string
  author?: string
  category?: string
  tags?: string[]
  readTime?: number
  featured?: boolean
  cover?: string
}

export interface BlogPost {
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
