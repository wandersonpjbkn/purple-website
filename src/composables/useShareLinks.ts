import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { SITE_URL } from '@/composables/usePageMeta'

export type ShareNetwork = 'linkedin' | 'x' | 'whatsapp'
export type ShareSource = ShareNetwork | 'copy' | 'native'

const NETWORKS: { network: ShareNetwork; icon: string; label: string }[] = [
  { network: 'linkedin', icon: 'linkedin', label: 'Compartilhar no LinkedIn' },
  { network: 'x', icon: 'x', label: 'Compartilhar no X' },
  { network: 'whatsapp', icon: 'whatsapp', label: 'Compartilhar no WhatsApp' },
]

const NETWORK_URL: Record<ShareNetwork, (url: string, title: string) => string> = {
  linkedin: url => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  x: (url, title) =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  whatsapp: (url, title) => `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
}

export const withShareUtm = (url: string, source: ShareSource): string => {
  let shared: URL
  try {
    shared = new URL(url)
  } catch {
    return url
  }
  shared.searchParams.set('utm_source', source)
  shared.searchParams.set('utm_medium', 'social')
  shared.searchParams.set('utm_campaign', 'blog-share')
  return shared.toString()
}

export const useShareLinks = (path: MaybeRefOrGetter<string>, title: MaybeRefOrGetter<string>) => {
  const url = computed(() => `${SITE_URL}${toValue(path)}`)

  const links = computed(() =>
    NETWORKS.map(item => ({
      ...item,
      href: NETWORK_URL[item.network](withShareUtm(url.value, item.network), toValue(title)),
    }))
  )

  return { url, links }
}
