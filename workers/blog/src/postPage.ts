import { escapeHtml } from './markdown'

import type { PostMeta } from './types'

export const SHELL_PATH = '/spa-shell.html'

const SITE_NAME = 'Purple Comunicação'
const SITE_LOCALE = 'pt_BR'
const TWITTER_HANDLE = '@purplecomunica'
const DEFAULT_OG_IMAGE = '/og-default.jpg'
const DEFAULT_OG_IMAGE_SIZE = { width: 1200, height: 630 }
const NOT_FOUND_TITLE = 'Post não encontrado'

export interface PostPageConfig {
  siteOrigin: string
  cdnUrl?: string
}

export interface PostHead {
  title: string
  tags: string
}

export const resolveCoverUrl = (cover: string, cdnUrl: string | undefined): string | undefined => {
  if (!cover || !cdnUrl) return undefined
  return `${cdnUrl.replace(/\/$/, '')}/${cover.replace(/^\//, '')}`
}

const meta = (attribute: 'name' | 'property', key: string, content: string | number | undefined): string =>
  content === undefined || content === '' ? '' : `<meta ${attribute}="${key}" content="${escapeHtml(String(content))}">`

const serializeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c')

export const postUrl = (siteOrigin: string, slug: string): string => `${siteOrigin}/blog/${encodeURIComponent(slug)}`

const ISO_DATE = /^\d{4}-\d{2}-\d{2}/

export const buildPostsSitemap = (posts: PostMeta[], siteOrigin: string): string => {
  const urls = posts
    .map(post => {
      const lastmod = ISO_DATE.exec(post.date)?.[0]
      const lastmodTag = lastmod ? `<lastmod>${lastmod}</lastmod>` : ''
      return `<url><loc>${escapeHtml(postUrl(siteOrigin, post.slug))}</loc>${lastmodTag}</url>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`
}

export const fullTitle = (title: string): string => `${title} | ${SITE_NAME}`

export const buildPostHead = (post: PostMeta, config: PostPageConfig): PostHead => {
  const title = fullTitle(post.title)
  const url = postUrl(config.siteOrigin, post.slug)
  const cover = resolveCoverUrl(post.cover, config.cdnUrl)
  const image = cover ?? `${config.siteOrigin}${DEFAULT_OG_IMAGE}`
  const size = cover ? undefined : DEFAULT_OG_IMAGE_SIZE

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    name: title,
    url,
    description: post.excerpt,
    inLanguage: 'pt-BR',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: config.siteOrigin },
    headline: post.title,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    image,
    articleSection: post.category || undefined,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: config.siteOrigin,
      logo: { '@type': 'ImageObject', url: `${config.siteOrigin}/logo.png` },
    },
  }

  const tags = [
    meta('name', 'description', post.excerpt),
    `<link rel="canonical" href="${escapeHtml(url)}">`,
    meta('property', 'og:title', title),
    meta('property', 'og:description', post.excerpt),
    meta('property', 'og:url', url),
    meta('property', 'og:type', 'article'),
    meta('property', 'og:site_name', SITE_NAME),
    meta('property', 'og:locale', SITE_LOCALE),
    meta('property', 'og:image', image),
    meta('property', 'og:image:alt', post.coverAlt || post.title),
    meta('property', 'og:image:width', size?.width),
    meta('property', 'og:image:height', size?.height),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:site', TWITTER_HANDLE),
    meta('name', 'twitter:title', title),
    meta('name', 'twitter:description', post.excerpt),
    meta('name', 'twitter:image', image),
    meta('property', 'article:published_time', post.date),
    meta('property', 'article:section', post.category),
    `<script type="application/ld+json" data-hid="jsonld">${serializeJsonLd(jsonLd)}</script>`,
  ]

  return { title, tags: tags.filter(Boolean).join('') }
}

export const notFoundHead = (): PostHead => ({ title: fullTitle(NOT_FOUND_TITLE), tags: '' })

const MANAGED_HEAD_SELECTORS = [
  'meta[name="description"]',
  'meta[property^="og:"]',
  'meta[property^="article:"]',
  'meta[name^="twitter:"]',
  'link[rel="canonical"]',
  'script[type="application/ld+json"]',
]

export const renderPostPage = (shell: Response, head: PostHead, status: number): Response => {
  const rewriter = new HTMLRewriter()
    .on('title', {
      element: element => {
        element.setInnerContent(head.title)
      },
    })
    .on(MANAGED_HEAD_SELECTORS.join(', '), {
      element: element => {
        element.remove()
      },
    })
    .on('head', {
      element: element => {
        element.append(head.tags, { html: true })
      },
    })

  const headers = new Headers(shell.headers)
  headers.delete('ETag')
  headers.delete('Last-Modified')
  headers.delete('Content-Length')
  headers.set('Content-Type', 'text/html; charset=utf-8')

  return rewriter.transform(new Response(shell.body, { status, headers }))
}
