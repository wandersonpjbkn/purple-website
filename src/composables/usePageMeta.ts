import { computed } from 'vue'
import { useSeoMeta, useHead } from '@unhead/vue'
import { toValue, type MaybeRefOrGetter } from 'vue'
import { useRoute } from 'vue-router'

const SITE = {
  name: 'Purple Comunicação',
  url: import.meta.env.VITE_SITE_URL ?? 'https://purplecomunicacao.com.br',
  locale: 'pt_BR',
  twitterHandle: '@purplecomunica',
  defaultOgImage: '/og-default.jpg',
}

export interface PageMetaOptions {
  title: string
  description?: string
  type?: 'website' | 'article' | 'profile'
  publishedAt?: string
  modifiedAt?: string
  author?: string
  category?: string
  image?: string
  imageAlt?: string
}

export const usePageMeta = (options: MaybeRefOrGetter<PageMetaOptions>) => {
  const route = useRoute()

  const canonical = computed(() => {
    const path = route.path.endsWith('/') ? route.path.slice(0, -1) : route.path
    return `${SITE.url}${path}`
  })

  const resolved = computed<PageMetaOptions>(() => toValue(options))

  const fullTitle = computed(() =>
    resolved.value.title === SITE.name ? SITE.name : `${resolved.value.title} | ${SITE.name}`
  )

  const image = computed(() => {
    const img = resolved.value.image
    if (!img) return `${SITE.url}${SITE.defaultOgImage}`
    return img.startsWith('http') ? img : `${SITE.url}${img}`
  })

  useSeoMeta({
    title: () => fullTitle.value,
    description: () => resolved.value.description,

    ogTitle: () => fullTitle.value,
    ogDescription: () => resolved.value.description,
    ogUrl: () => canonical.value,
    ogType: () => resolved.value.type ?? 'website',
    ogSiteName: SITE.name,
    ogLocale: SITE.locale,
    ogImage: () => image.value,
    ogImageAlt: () => resolved.value.imageAlt ?? resolved.value.title,
    ogImageWidth: 1200,
    ogImageHeight: 630,

    twitterCard: 'summary_large_image',
    twitterSite: SITE.twitterHandle,
    twitterTitle: () => fullTitle.value,
    twitterDescription: () => resolved.value.description,
    twitterImage: () => image.value,

    articlePublishedTime: () => resolved.value.publishedAt,
    articleModifiedTime: () => resolved.value.modifiedAt,
    articleAuthor: () => (resolved.value.author ? [resolved.value.author] : undefined),
    articleSection: () => resolved.value.category,

    // `robots` has a single source in App.vue (noindex,nofollow while the site is
    // pre-launch). Don't emit it here to avoid conflicting — see ARCHITECTURE.md.
  })

  useHead({
    htmlAttrs: { lang: 'pt-BR' },
    link: [{ rel: 'canonical', href: () => canonical.value }],
  })

  useHead({
    script: [
      {
        type: 'application/ld+json',
        innerHTML: () => {
          const base = {
            '@context': 'https://schema.org',
            '@type': resolved.value.type === 'article' ? 'Article' : 'WebPage',
            name: fullTitle.value,
            url: canonical.value,
            description: resolved.value.description,
            inLanguage: 'pt-BR',
            isPartOf: { '@type': 'WebSite', name: SITE.name, url: SITE.url },
          }

          if (resolved.value.type === 'article') {
            return JSON.stringify({
              ...base,
              '@type': 'Article',
              headline: resolved.value.title,
              datePublished: resolved.value.publishedAt,
              dateModified: resolved.value.modifiedAt ?? resolved.value.publishedAt,
              author: resolved.value.author ? { '@type': 'Person', name: resolved.value.author } : undefined,
              image: image.value,
              articleSection: resolved.value.category,
              publisher: {
                '@type': 'Organization',
                name: SITE.name,
                url: SITE.url,
                logo: { '@type': 'ImageObject', url: `${SITE.url}/logo.png` },
              },
            })
          }

          return JSON.stringify(base)
        },
      },
    ],
  })
}
