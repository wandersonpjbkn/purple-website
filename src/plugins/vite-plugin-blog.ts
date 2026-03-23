// src/plugins/vite-plugin-blog.ts
// Plugin Vite — lê .md em content/posts/, parseia frontmatter + Markdown,
// expõe via módulo virtual 'virtual:blog-posts' (sem dependências externas).

import type { Plugin } from 'vite'
import fs   from 'node:fs'
import path from 'node:path'

// ── Tipos internos (usados só no plugin) ──────────────────

interface RawFrontmatter {
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

// ── Parser de frontmatter YAML simples ────────────────────

function parseFrontmatter(raw: string): { fm: RawFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m)
  if (!match) return { fm: {}, body: raw }

  const fm: RawFrontmatter = {}

  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const key = line.slice(0, colonIdx).trim() as keyof RawFrontmatter
    const rawVal = line.slice(colonIdx + 1).trim()

    if (rawVal.startsWith('[')) {
      // Array YAML inline: ["a", "b"] ou [a, b]
      ;(fm as Record<string, unknown>)[key] = rawVal
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (rawVal === 'true') {
      ;(fm as Record<string, unknown>)[key] = true
    } else if (rawVal === 'false') {
      ;(fm as Record<string, unknown>)[key] = false
    } else if (/^\d+$/.test(rawVal)) {
      ;(fm as Record<string, unknown>)[key] = parseInt(rawVal, 10)
    } else {
      ;(fm as Record<string, unknown>)[key] = rawVal.replace(/^["']|["']$/g, '')
    }
  }

  return { fm, body: match[2] }
}

// ── Markdown → HTML ───────────────────────────────────────
// Injeta id="slug-N" nos h2/h3 para o sumário funcionar.

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

function markdownToHtml(md: string): string {
  let html = md

  // Tabelas GFM
  html = html.replace(
    /^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm,
    (_, header: string, rows: string) => {
      const th = header.split('|').filter(Boolean)
        .map((c: string) => `<th>${c.trim()}</th>`).join('')
      const trs = rows.trim().split('\n').map((row: string) => {
        const tds = row.split('|').filter(Boolean)
          .map((c: string) => `<td>${c.trim()}</td>`).join('')
        return `<tr>${tds}</tr>`
      }).join('')
      return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`
    }
  )

  // Code blocks (antes de tudo para não processar conteúdo interno)
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')

  // Headings com id para âncoras (h2, h3 — suficiente para sumário)
  const headingCounters: Record<string, number> = {}
  html = html.replace(/^(#{2,6}) (.+)$/gm, (_, hashes: string, text: string) => {
    const level = hashes.length
    const base  = slugify(text)
    headingCounters[base] = (headingCounters[base] ?? 0) + 1
    const id = headingCounters[base] > 1 ? `${base}-${headingCounters[base]}` : base
    return `<h${level} id="${id}">${text}</h${level}>`
  })

  // HR
  html = html.replace(/^---$/gm, '<hr>')

  // Listas não ordenadas
  html = html.replace(/^((?:^- .+\n?)+)/gm, (block: string) => {
    const items = block.trim().split('\n')
      .map((l: string) => `<li>${l.replace(/^- /, '')}</li>`).join('')
    return `<ul>${items}</ul>`
  })

  // Listas ordenadas
  html = html.replace(/^((?:^\d+\. .+\n?)+)/gm, (block: string) => {
    const items = block.trim().split('\n')
      .map((l: string) => `<li>${l.replace(/^\d+\. /, '')}</li>`).join('')
    return `<ol>${items}</ol>`
  })

  // Inline
  html = html.replace(/\*\*(.+?)\*\*/g,        '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g,             '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g,             '<code>$1</code>')
  html = html.replace(/\[(.+?)\]\((.+?)\)/g,    '<a href="$2">$1</a>')

  // Parágrafos
  html = html
    .split(/\n\n+/)
    .map(block => {
      block = block.trim()
      if (!block) return ''
      if (/^<(h[1-6]|ul|ol|pre|blockquote|table|hr)/.test(block)) return block
      return `<p>${block.replace(/\n/g, ' ')}</p>`
    })
    .join('\n')

  return html
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ── Plugin Vite ───────────────────────────────────────────

const VIRTUAL_ID = 'virtual:blog-posts'
const RESOLVED   = '\0' + VIRTUAL_ID

export function blogPlugin(): Plugin {
  return {
    name: 'vite-plugin-blog',

    resolveId(id: string) {
      if (id === VIRTUAL_ID) return RESOLVED
    },

    load(id: string) {
      if (id !== RESOLVED) return

      const postsDir = path.resolve(process.cwd(), 'content/posts')

      const empty = `
export const posts = [];
export function getPost() { return null; }
export function getPostsByAuthor() { return []; }
export function getPostsByCategory() { return []; }
export function getFeaturedPosts() { return []; }
export function getAllCategories() { return []; }
`
      if (!fs.existsSync(postsDir)) return empty

      const files = fs.readdirSync(postsDir)
        .filter((f: string) => f.endsWith('.md'))
        .sort()

      const blogPosts: BlogPost[] = files.map((file: string) => {
        const raw          = fs.readFileSync(path.join(postsDir, file), 'utf-8')
        const { fm, body } = parseFrontmatter(raw)
        const html         = markdownToHtml(body)
        const wordCount    = countWords(body)

        return {
          title:     fm.title     ?? '',
          slug:      fm.slug      ?? file.replace('.md', ''),
          excerpt:   fm.excerpt   ?? '',
          date:      fm.date      ?? '',
          author:    fm.author    ?? '',
          category:  fm.category  ?? '',
          tags:      fm.tags      ?? [],
          readTime:  fm.readTime  ?? Math.ceil(wordCount / 200),
          featured:  fm.featured  ?? false,
          cover:     fm.cover     ?? '',
          html,
          wordCount,
        }
      })

      // Mais recente primeiro
      blogPosts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )

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
    },

    // Hot-reload quando qualquer .md é alterado em dev
    configureServer(server) {
      const postsDir = path.resolve(process.cwd(), 'content/posts')
      if (!fs.existsSync(postsDir)) return

      fs.watch(postsDir, { recursive: true }, () => {
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}
