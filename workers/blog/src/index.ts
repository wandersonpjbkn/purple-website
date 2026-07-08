import type { Env, BlogPost, RawFrontmatter } from './types'

const json = (body: unknown, status = 200, origin = '*') =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') ?? ''
    const allowedOrigins = [
      env.ALLOWED_ORIGIN,
      env.ALLOWED_ORIGIN_WWW,
      'http://localhost:5173',
      'http://localhost:8787',
      'http://192.168.15.12:5173',
    ]

    if (url.pathname === '/deploy' && request.method === 'POST') {
      const authToken = request.headers.get('Authorization')

      if (!authToken || authToken !== env.BLOG_DEPLOY_TOKEN) {
        return json({ success: false, message: 'Não autorizado.' }, 401, '*')
      }

      try {
        ctx.waitUntil(fetch(env.RENDER_DEPLOY_HOOK, { method: 'POST' }))
        return json({ success: true, message: 'Deploy disparado no Render com sucesso!' }, 200, '*')
      } catch (err: any) {
        return json({ success: false, message: 'Erro ao avisar o Render.', error: err.message }, 500, '*')
      }
    }

    if (request.method === 'OPTIONS') {
      return json({}, 200, origin)
    }

    if (origin !== '' && !allowedOrigins.includes(origin)) {
      return json({ success: false, message: 'Origin não permitida.' }, 403, origin)
    }

    if (request.method !== 'GET') {
      return json({ success: false, message: 'Método inválido.' }, 405, origin)
    }

    try {
      // 1. List all objects in the bucket with the prefix 'posts/'
      const listing = await env.POSTS_BUCKET.list({ prefix: 'posts/' })
      const mdFiles = listing.objects.filter(obj => obj.key.endsWith('.md'))

      // 2. Read and process each .md file in parallel
      const blogPosts = await Promise.all(
        mdFiles.map(async object => {
          const file = await env.POSTS_BUCKET.get(object.key)
          if (!file) return null

          const raw = await file.text()
          const { fm, body } = parseFrontmatter(raw)
          const html = markdownToHtml(body)
          const wordCount = countWords(body)
          const fileSlug = object.key.replace('posts/', '').replace('.md', '')

          return {
            title: fm.title ?? '',
            slug: fm.slug ?? fileSlug,
            excerpt: fm.excerpt ?? '',
            date: fm.date ?? '',
            author: fm.author ?? '',
            category: fm.category ?? '',
            tags: fm.tags ?? [],
            readTime: fm.readTime ?? Math.ceil(wordCount / 200),
            featured: fm.featured ?? false,
            cover: fm.cover ?? '',
            html,
            wordCount,
          } as BlogPost
        })
      )

      // 3. Remove any nulls and sort by date (most recent first)
      const filteredPosts = blogPosts
        .filter((p): p is BlogPost => p !== null)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const responseOrigin = allowedOrigins.includes(origin) ? origin : '*'
      return json(filteredPosts, 200, responseOrigin)
    } catch (err: any) {
      return json({ success: false, message: 'Erro ao processar posts.', error: err.message }, 500, origin)
    }
  },
}

// ── Parser de frontmatter YAML simples ────────────────────

function parseFrontmatter(raw: string): { fm: RawFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m)
  if (!match) return { fm: {}, body: raw }

  const yamlBlock = match[1] ?? ''
  const body = match[2] ?? ''
  const fm: Record<string, any> = {}

  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const key = line.slice(0, colonIdx).trim()
    const rawVal = line.slice(colonIdx + 1).trim()

    if (rawVal.startsWith('[')) {
      fm[key] = rawVal
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    } else if (rawVal === 'true') {
      fm[key] = true
    } else if (rawVal === 'false') {
      fm[key] = false
    } else if (/^\d+$/.test(rawVal)) {
      fm[key] = parseInt(rawVal, 10)
    } else {
      fm[key] = rawVal.replace(/^["']|["']$/g, '')
    }
  }

  return { fm, body }
}

// ── Markdown → HTML ───────────────────────────────────────

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
  html = html.replace(/^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm, (_, header: string, rows: string) => {
    const th = header
      .split('|')
      .filter(Boolean)
      .map((c: string) => `<th>${c.trim()}</th>`)
      .join('')
    const trs = rows
      .trim()
      .split('\n')
      .map((row: string) => {
        const tds = row
          .split('|')
          .filter(Boolean)
          .map((c: string) => `<td>${c.trim()}</td>`)
          .join('')
        return `<tr>${tds}</tr>`
      })
      .join('')
    return `<table><thead><tr>${th}</tr></thead><tbody>${trs}</tbody></table>`
  })

  // Code blocks (antes de tudo para não processar conteúdo interno)
  html = html.replace(/```[\w]*\n([\s\S]*?)```/g, '<pre><code>$1</code></pre>')

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')

  // Headings com id para âncoras (h2, h3 — suficiente para sumário)
  const headingCounters: Record<string, number> = {}
  html = html.replace(/^(#{2,6}) (.+)$/gm, (_, hashes: string, text: string) => {
    const level = hashes.length
    const base = slugify(text)
    headingCounters[base] = (headingCounters[base] ?? 0) + 1
    const id = headingCounters[base] > 1 ? `${base}-${headingCounters[base]}` : base
    return `<h${level} id="${id}">${text}</h${level}>`
  })

  // HR
  html = html.replace(/^---$/gm, '<hr>')

  // Listas não ordenadas
  html = html.replace(/^((?:^- .+\n?)+)/gm, (block: string) => {
    const items = block
      .trim()
      .split('\n')
      .map((l: string) => `<li>${l.replace(/^- /, '')}</li>`)
      .join('')
    return `<ul>${items}</ul>`
  })

  // Listas ordenadas
  html = html.replace(/^((?:^\d+\. .+\n?)+)/gm, (block: string) => {
    const items = block
      .trim()
      .split('\n')
      .map((l: string) => `<li>${l.replace(/^\d+\. /, '')}</li>`)
      .join('')
    return `<ol>${items}</ol>`
  })

  // Inline
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')

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
