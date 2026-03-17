import { useSeoMeta, useHead } from '@unhead/vue'
import { toValue } from 'vue'
import { useRoute } from 'vue-router'

interface PageMetaOptions {
  title: string
  description?: string
  type?: 'website' | 'article'
}

type MaybeRefOrGetter<T> = T | (() => T) | import('vue').Ref<T>

export function usePageMeta(options: MaybeRefOrGetter<PageMetaOptions>) {
  const route = useRoute()
  const siteUrl = import.meta.env.VITE_SITE_URL ?? ''
  const siteName = 'Purple Comunicação'
  const canonical = `${siteUrl}${route.path}`

  const fullTitle = `${toValue(options).title} | ${siteName}`

  useSeoMeta({
    title: fullTitle,
    description: toValue(options).description,
    ogTitle: fullTitle,
    ogDescription: toValue(options).description,
    ogUrl: canonical,
    ogType: toValue(options).type ?? 'website',
    ogSiteName: siteName,
    twitterCard: 'summary',
  })

  useHead({
    htmlAttrs: { lang: 'pt-BR' },
    link: [{ rel: 'canonical', href: canonical }],
  })
}
