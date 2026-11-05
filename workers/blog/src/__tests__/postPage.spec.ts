import { describe, it, expect } from 'vitest'

import { escapeHtml } from '../markdown'
import { buildPostHead, buildPostsSitemap, notFoundHead, resolveCoverUrl } from '../postPage'

import type { PostMeta } from '../types'

const META: PostMeta = {
  title: 'Demissão humanizada existe?',
  slug: 'demissao-humanizada',
  excerpt: 'Conduzir com respeito, transparência e "cuidado".',
  date: '2026-11-05',
  author: 'suelen-fernanda',
  category: 'Employer Branding',
  tags: [],
  readTime: 6,
  featured: false,
  cover: 'blog/post-6.jpg',
  coverAlt: '',
  wordCount: 1200,
}

const CONFIG = { siteOrigin: 'https://purplecomunicacao.com.br', cdnUrl: 'https://cdn.example' }

const metaContent = (tags: string, key: string): string | undefined =>
  new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)">`).exec(tags)?.[1]

describe('resolveCoverUrl', () => {
  it('junta o caminho relativo da capa à base do CDN', () => {
    expect(resolveCoverUrl('blog/post-6.jpg', 'https://cdn.example')).toBe('https://cdn.example/blog/post-6.jpg')
  })

  it('não duplica barras entre a base e o caminho', () => {
    expect(resolveCoverUrl('/blog/post-6.jpg', 'https://cdn.example/')).toBe('https://cdn.example/blog/post-6.jpg')
  })

  it('sem capa ou sem CDN configurado, não devolve URL', () => {
    expect(resolveCoverUrl('', 'https://cdn.example')).toBeUndefined()
    expect(resolveCoverUrl('blog/post-6.jpg', undefined)).toBeUndefined()
  })
})

describe('escapeHtml', () => {
  it('escapa os caracteres que quebrariam um atributo ou uma tag', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;')
  })
})

describe('buildPostHead', () => {
  it('monta título, descrição, canonical e Open Graph do post', () => {
    const { title, tags } = buildPostHead(META, CONFIG)

    expect(title).toBe('Demissão humanizada existe? | Purple Comunicação')
    expect(metaContent(tags, 'og:title')).toBe('Demissão humanizada existe? | Purple Comunicação')
    expect(metaContent(tags, 'description')).toBe('Conduzir com respeito, transparência e &quot;cuidado&quot;.')
    expect(metaContent(tags, 'og:type')).toBe('article')
    expect(metaContent(tags, 'og:url')).toBe('https://purplecomunicacao.com.br/blog/demissao-humanizada')
    expect(tags).toContain('<link rel="canonical" href="https://purplecomunicacao.com.br/blog/demissao-humanizada">')
  })

  it('usa a capa do post, em URL absoluta do CDN, como og:image e twitter:image — sem dimensões fixas', () => {
    const { tags } = buildPostHead(META, CONFIG)

    expect(metaContent(tags, 'og:image')).toBe('https://cdn.example/blog/post-6.jpg')
    expect(metaContent(tags, 'twitter:image')).toBe('https://cdn.example/blog/post-6.jpg')
    expect(metaContent(tags, 'og:image:width')).toBeUndefined()
  })

  it('descreve a imagem com o coverAlt quando existe, e com o título quando não', () => {
    expect(metaContent(buildPostHead({ ...META, coverAlt: 'Pessoa em reunião' }, CONFIG).tags, 'og:image:alt')).toBe(
      'Pessoa em reunião'
    )
    expect(metaContent(buildPostHead(META, CONFIG).tags, 'og:image:alt')).toBe('Demissão humanizada existe?')
  })

  it('sem capa, cai na imagem padrão do site com as dimensões dela', () => {
    const { tags } = buildPostHead({ ...META, cover: '' }, CONFIG)

    expect(metaContent(tags, 'og:image')).toBe('https://purplecomunicacao.com.br/og-default.jpg')
    expect(metaContent(tags, 'og:image:width')).toBe('1200')
    expect(metaContent(tags, 'og:image:height')).toBe('630')
  })

  it('emite o JSON-LD de Article com a chave que o SPA reaproveita ao montar', () => {
    const { tags } = buildPostHead(META, CONFIG)
    const json = /<script type="application\/ld\+json" data-hid="jsonld">(.*?)<\/script>/.exec(tags)?.[1] ?? '{}'
    const data = JSON.parse(json) as Record<string, unknown>

    expect(data['@type']).toBe('Article')
    expect(data.headline).toBe('Demissão humanizada existe?')
    expect(data.datePublished).toBe('2026-11-05')
    expect(data.image).toBe('https://cdn.example/blog/post-6.jpg')
  })

  it('não deixa o conteúdo do post fechar a tag do JSON-LD', () => {
    const { tags } = buildPostHead({ ...META, excerpt: 'fim</script><script>alert(1)</script>' }, CONFIG)

    expect(tags.match(/<\/script>/g)).toHaveLength(1)
  })
})

describe('notFoundHead', () => {
  it('só troca o título, sem meta tags de post', () => {
    expect(notFoundHead()).toEqual({ title: 'Post não encontrado | Purple Comunicação', tags: '' })
  })
})

describe('buildPostsSitemap', () => {
  it('lista cada post com a URL canônica e a data como lastmod', () => {
    const xml = buildPostsSitemap([META, { ...META, slug: 'outro', date: '' }], 'https://purplecomunicacao.com.br')

    expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    expect(xml).toContain(
      '<url><loc>https://purplecomunicacao.com.br/blog/demissao-humanizada</loc><lastmod>2026-11-05</lastmod></url>'
    )
    expect(xml).toContain('<url><loc>https://purplecomunicacao.com.br/blog/outro</loc></url>')
  })
})
