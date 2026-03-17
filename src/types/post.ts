export interface PostSection {
  id: string
  title: string
  body: string[]
}

export interface Post {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  cover: string
  author: string
  date: string
  readTime: string
  featured?: boolean
  content: PostSection[]
}
