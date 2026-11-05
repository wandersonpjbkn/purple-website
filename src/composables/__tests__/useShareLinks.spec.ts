import { describe, it, expect } from 'vitest'
import { ref } from 'vue'

import { useShareLinks, withShareUtm } from '@/composables/useShareLinks'
import { SITE_URL } from '@/composables/usePageMeta'

describe('withShareUtm', () => {
  it('acrescenta source, medium e campaign de compartilhamento', () => {
    const url = new URL(withShareUtm('https://example.com/blog/post', 'linkedin'))

    expect(url.searchParams.get('utm_source')).toBe('linkedin')
    expect(url.searchParams.get('utm_medium')).toBe('social')
    expect(url.searchParams.get('utm_campaign')).toBe('blog-share')
  })

  it('preserva parâmetros que a URL já tinha', () => {
    const url = new URL(withShareUtm('https://example.com/blog/post?ref=abc', 'x'))

    expect(url.searchParams.get('ref')).toBe('abc')
    expect(url.searchParams.get('utm_source')).toBe('x')
  })
})

describe('useShareLinks', () => {
  it('monta a URL canônica do post a partir da URL do site', () => {
    const { url } = useShareLinks('/blog/demissao-humanizada', 'Título')

    expect(url.value).toBe(`${SITE_URL}/blog/demissao-humanizada`)
  })

  it('gera LinkedIn, X e WhatsApp, cada um com a própria origem na UTM', () => {
    const { links } = useShareLinks('/blog/post', 'Demissão humanizada existe?')

    expect(links.value.map(link => link.network)).toEqual(['linkedin', 'x', 'whatsapp'])
    for (const link of links.value) {
      const shared = encodeURIComponent(withShareUtm(`${SITE_URL}/blog/post`, link.network))
      expect(link.href).toContain(shared)
    }
  })

  it('leva o título no texto do X e do WhatsApp', () => {
    const title = 'Demissão humanizada existe?'
    const { links } = useShareLinks('/blog/post', title)
    const byNetwork = Object.fromEntries(links.value.map(link => [link.network, link.href]))

    expect(byNetwork.x).toContain(`text=${encodeURIComponent(title)}`)
    expect(decodeURIComponent(byNetwork.whatsapp ?? '')).toContain(title)
  })

  it('reage à troca de post', () => {
    const path = ref('/blog/a')
    const { url } = useShareLinks(path, 'Título')

    path.value = '/blog/b'

    expect(url.value).toBe(`${SITE_URL}/blog/b`)
  })
})
