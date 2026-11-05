import { jsonResponse, buildAllowedOrigins } from '../../shared/http'
import { timingSafeEqual } from '../../shared/security'

import { markdownToHtml } from './markdown'
import { SHELL_PATH, buildPostHead, buildPostsSitemap, notFoundHead, renderPostPage } from './postPage'

import type { Env, BlogPost, PostMeta, RawFrontmatter } from './types'

const CORS_METHODS = 'GET, OPTIONS'

// Deliberately short TTLs: cache.delete on /deploy only purges the local PoP,
// so other datacenters self-heal within s-maxage.
const INDEX_TTL_SECONDS = 300
const POST_TTL_SECONDS = 3600

const json = (body: unknown, status = 200, origin = '*') => jsonResponse(body, status, origin, CORS_METHODS)

const POSTS_SITEMAP_PATH = '/sitemap-posts.xml'
const AUTHOR_PAGE_PATH = /^\/blog\/autor\/([^/]+)\/?$/
const POST_PAGE_PATH = /^\/blog\/([^/]+)\/?$/

const indexCacheKey = (requestUrl: string): Request => {
  const url = new URL(requestUrl)
  return new Request(`${url.origin}/index`)
}

async function handleDeployRequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const authToken = request.headers.get('Authorization')

  if (!authToken || !timingSafeEqual(authToken, env.BLOG_DEPLOY_TOKEN)) {
    return json({ success: false, message: 'Não autorizado.' }, 401, '*')
  }

  try {
    // Content changed: drop the cached /index (best-effort, local PoP only) and
    // let Render refresh the prerendered /blog SEO snapshot.
    ctx.waitUntil(caches.default.delete(indexCacheKey(request.url)))
    ctx.waitUntil(fetch(env.RENDER_DEPLOY_HOOK, { method: 'POST' }))
    return json({ success: true, message: 'Deploy disparado no Render com sucesso!' }, 200, '*')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return json({ success: false, message: 'Erro ao avisar o Render.', error: message }, 500, '*')
  }
}

async function listMarkdownKeys(bucket: R2Bucket): Promise<string[]> {
  const keys: string[] = []
  let cursor: string | undefined

  // R2 lists at most 1000 objects per call — paginate until exhausted.
  do {
    const listing = await bucket.list({ prefix: 'posts/', cursor })
    keys.push(...listing.objects.map(object => object.key).filter(key => key.endsWith('.md')))
    cursor = listing.truncated ? listing.cursor : undefined
  } while (cursor)

  return keys
}

const buildMeta = (key: string, fm: RawFrontmatter, body: string): PostMeta => {
  const wordCount = countWords(body)
  const fileSlug = key.replace('posts/', '').replace('.md', '')

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
    coverAlt: fm.coverAlt ?? '',
    wordCount,
  }
}

const byDateDesc = (a: PostMeta, b: PostMeta) => new Date(b.date).getTime() - new Date(a.date).getTime()

async function buildIndex(env: Env): Promise<PostMeta[]> {
  const keys = await listMarkdownKeys(env.POSTS_BUCKET)

  const metas = await Promise.all(
    keys.map(async key => {
      const file = await env.POSTS_BUCKET.get(key)
      if (!file) return null

      const { fm, body } = parseFrontmatter(await file.text())
      return buildMeta(key, fm, body)
    })
  )

  return metas.filter((meta): meta is PostMeta => meta !== null).sort(byDateDesc)
}

async function getPostBySlug(env: Env, slug: string): Promise<BlogPost | null> {
  // Fast path: slug matches the file name. A frontmatter slug overrides the
  // file name, so it must still match — otherwise the canonical slug is
  // another one and the slow path below resolves it.
  const direct = await env.POSTS_BUCKET.get(`posts/${slug}.md`)
  if (direct) {
    const { fm, body } = parseFrontmatter(await direct.text())
    const meta = buildMeta(`posts/${slug}.md`, fm, body)
    if (meta.slug === slug) return { ...meta, html: markdownToHtml(body, { cdnUrl: env.CDN_URL }) }
  }

  // Slow path: the frontmatter slug may differ from the file name.
  const keys = await listMarkdownKeys(env.POSTS_BUCKET)
  for (const key of keys) {
    const file = await env.POSTS_BUCKET.get(key)
    if (!file) continue

    const { fm, body } = parseFrontmatter(await file.text())
    const meta = buildMeta(key, fm, body)
    if (meta.slug === slug) return { ...meta, html: markdownToHtml(body, { cdnUrl: env.CDN_URL }) }
  }

  return null
}

// Legacy full-array payload (GET / and GET /posts) — kept while older bundles
// may still call it; the SPA now uses /index + /posts/:slug.
async function listPosts(env: Env): Promise<BlogPost[]> {
  const keys = await listMarkdownKeys(env.POSTS_BUCKET)

  const blogPosts = await Promise.all(
    keys.map(async key => {
      const file = await env.POSTS_BUCKET.get(key)
      if (!file) return null

      const { fm, body } = parseFrontmatter(await file.text())
      return { ...buildMeta(key, fm, body), html: markdownToHtml(body, { cdnUrl: env.CDN_URL }) } as BlogPost
    })
  )

  return blogPosts.filter((p): p is BlogPost => p !== null).sort(byDateDesc)
}

// Site pages (/blog/* on the main domain)

const toSiteOrigin = (request: Request, env: Env): Request => {
  const url = new URL(request.url)
  return new Request(`${env.SITE_ORIGIN}${url.pathname}${url.search}`, request)
}

const fetchShell = async (env: Env): Promise<Response> => {
  const shell = await fetch(`${env.SITE_ORIGIN}${SHELL_PATH}`)
  if (!shell.ok) throw new Error(`Shell respondeu ${shell.status}.`)
  return shell
}

async function getCachedIndex(env: Env, ctx: ExecutionContext, origin: string): Promise<PostMeta[]> {
  const indexResponse = await withEdgeCache(new Request(`${origin}/index`), ctx, INDEX_TTL_SECONDS, async () => ({
    body: await buildIndex(env),
  }))
  return (await indexResponse.json()) as PostMeta[]
}

async function handlePostsSitemap(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const posts = await getCachedIndex(env, ctx, new URL(request.url).origin)
  return new Response(buildPostsSitemap(posts, env.SITE_ORIGIN), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `public, max-age=${INDEX_TTL_SECONDS}`,
    },
  })
}

async function findPostMeta(env: Env, ctx: ExecutionContext, origin: string, slug: string): Promise<PostMeta | null> {
  const listed = (await getCachedIndex(env, ctx, origin)).find(meta => meta.slug === slug)
  if (listed) return listed

  const key = `posts/${slug}.md`
  const file = await env.POSTS_BUCKET.get(key)
  if (!file) return null

  const { fm, body } = parseFrontmatter(await file.text())
  const meta = buildMeta(key, fm, body)
  return meta.slug === slug ? meta : null
}

async function handleAuthorPage(env: Env, slug: string): Promise<Response> {
  const snapshot = await fetch(`${env.SITE_ORIGIN}/blog/autor/${encodeURIComponent(slug)}/index.html`)
  return snapshot.ok ? snapshot : fetchShell(env)
}

async function handlePostPage(request: Request, env: Env, ctx: ExecutionContext, slug: string): Promise<Response> {
  const origin = new URL(request.url).origin
  const [meta, shell] = await Promise.all([findPostMeta(env, ctx, origin, slug), fetchShell(env)])
  const config = { siteOrigin: env.SITE_ORIGIN, cdnUrl: env.CDN_URL }

  return meta ? renderPostPage(shell, buildPostHead(meta, config), 200) : renderPostPage(shell, notFoundHead(), 404)
}

async function handleSitePage(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const { pathname } = new URL(request.url)
  const isRead = request.method === 'GET' || request.method === 'HEAD'
  if (!isRead || pathname.endsWith('/index.html')) return fetch(toSiteOrigin(request, env))

  try {
    const author = AUTHOR_PAGE_PATH.exec(pathname)?.[1]
    if (author) return await handleAuthorPage(env, decodeURIComponent(author))

    const slug = POST_PAGE_PATH.exec(pathname)?.[1]
    if (slug) return await handlePostPage(request, env, ctx, decodeURIComponent(slug))
  } catch (err) {
    console.error('[site-page] falha, servindo a origem:', err instanceof Error ? err.message : String(err))
  }

  return fetch(toSiteOrigin(request, env))
}

const weakEtag = (payload: string): string => {
  // djb2 — cheap and stable; only needs to change when the payload changes.
  let hash = 5381
  for (let i = 0; i < payload.length; i++) {
    hash = ((hash << 5) + hash + payload.charCodeAt(i)) >>> 0
  }
  return `W/"${hash.toString(16)}"`
}

// Serves from caches.default, producing (and storing) the payload on miss.
// The cached response carries NO CORS headers — they vary per request and are
// appended later by finalize(), otherwise the first requester's origin would
// be baked into the cached copy.
async function withEdgeCache(
  request: Request,
  ctx: ExecutionContext,
  ttlSeconds: number,
  produce: () => Promise<{ body: unknown; status?: number }>
): Promise<Response> {
  const url = new URL(request.url)
  const cacheKey = new Request(url.origin + url.pathname)
  const cache = caches.default

  const cached = await cache.match(cacheKey)
  if (cached) return cached

  const { body, status = 200 } = await produce()
  const payload = JSON.stringify(body)
  const response = new Response(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${ttlSeconds}, s-maxage=${ttlSeconds}`,
      ...(status === 200 ? { ETag: weakEtag(payload) } : {}),
    },
  })

  if (status === 200) ctx.waitUntil(cache.put(cacheKey, response.clone()))
  return response
}

const finalize = (response: Response, request: Request, origin: string): Response => {
  const headers = new Headers(response.headers)
  headers.set('Access-Control-Allow-Origin', origin)
  headers.set('Access-Control-Allow-Headers', 'Content-Type')
  headers.set('Access-Control-Allow-Methods', CORS_METHODS)
  // ETag is not a CORS-safelisted header — the SPA reads it as the cache stamp.
  headers.set('Access-Control-Expose-Headers', 'ETag')
  headers.set('Vary', 'Origin')

  const etag = response.headers.get('ETag')
  if (etag && request.headers.get('If-None-Match') === etag) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(response.body, { status: response.status, headers })
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin') ?? ''
    const allowedOrigins = buildAllowedOrigins(env)

    if (url.pathname.startsWith('/blog/')) {
      return handleSitePage(request, env, ctx)
    }

    if (url.pathname === '/deploy' && request.method === 'POST') {
      return handleDeployRequest(request, env, ctx)
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

    const responseOrigin = allowedOrigins.includes(origin) ? origin : '*'

    try {
      if (url.pathname === POSTS_SITEMAP_PATH) {
        return await handlePostsSitemap(request, env, ctx)
      }

      if (url.pathname === '/index') {
        const response = await withEdgeCache(request, ctx, INDEX_TTL_SECONDS, async () => ({
          body: await buildIndex(env),
        }))
        return finalize(response, request, responseOrigin)
      }

      const slugMatch = url.pathname.match(/^\/posts\/([^/]+)$/)
      if (slugMatch) {
        const response = await withEdgeCache(request, ctx, POST_TTL_SECONDS, async () => {
          const post = await getPostBySlug(env, decodeURIComponent(slugMatch[1] ?? ''))
          return post ? { body: post } : { body: { success: false, message: 'Post não encontrado.' }, status: 404 }
        })
        return finalize(response, request, responseOrigin)
      }

      if (url.pathname === '/' || url.pathname === '/posts') {
        return json(await listPosts(env), 200, responseOrigin)
      }

      return json({ success: false, message: 'Rota não encontrada.' }, 404, responseOrigin)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return json({ success: false, message: 'Erro ao processar posts.', error: message }, 500, origin)
    }
  },
}

export function parseFrontmatter(raw: string): { fm: RawFrontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m)
  if (!match) return { fm: {}, body: raw }

  const yamlBlock = match[1] ?? ''
  const body = match[2] ?? ''
  const fm: Record<string, string | string[] | boolean | number> = {}

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

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
