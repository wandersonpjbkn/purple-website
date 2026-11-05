import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'

import team from '../../src/data/team.json'

const read = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8')

const SITE = 'https://purplecomunicacao.com.br'

const prerenderedRoutes = (): string[] => {
  const declaration = /export const ROUTES = \[([^\]]*)\]/.exec(read('../shared.mjs'))?.[1] ?? ''
  return [...declaration.matchAll(/'([^']+)'/g)].map(([, route]) => route ?? '')
}

const sitemapLocs = (): string[] =>
  [...read('../../public/sitemap.xml').matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc ?? '')

describe('public/sitemap.xml — páginas estáticas', () => {
  it('lista toda rota prerenderizada e todo autor do blog', () => {
    const authors = team.filter(member => member.isAuthor).map(member => `/blog/autor/${member.slug}`)
    const expected = [...prerenderedRoutes(), ...authors].map(route => `${SITE}${route}`)

    expect(sitemapLocs().sort()).toEqual(expected.sort())
  })

  it('o robots.txt declara o sitemap estático e o dos posts', () => {
    const robots = read('../../public/robots.txt')

    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`)
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap-posts.xml`)
  })
})
