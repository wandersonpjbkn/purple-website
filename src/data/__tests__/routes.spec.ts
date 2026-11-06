import { describe, it, expect } from 'vitest'

import footer from '@/data/footer.json'
import pages from '@/data/pages.json'
import { baseRoutes } from '@/router/modules/base'
import { blogRoutes } from '@/router/modules/blog'

const routeNames = [...baseRoutes, ...blogRoutes].map(route => route.name)

const collectRouteNames = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(collectRouteNames)
  if (value === null || typeof value !== 'object') return []
  return Object.entries(value).flatMap(([key, child]) =>
    key === 'routeName' && typeof child === 'string' ? [child] : collectRouteNames(child)
  )
}

describe('rotas citadas pelos dados', () => {
  it.each([
    { file: 'pages.json', data: pages },
    { file: 'footer.json', data: footer },
  ])('$file só aponta para rotas que existem', ({ data }) => {
    const cited = collectRouteNames(data)

    expect(cited.length).toBeGreaterThan(0)
    for (const name of cited) expect(routeNames).toContain(name)
  })
})
