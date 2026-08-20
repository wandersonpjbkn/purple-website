import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, it, expect } from 'vitest'

const read = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), 'utf-8')

const prerenderedRoutes = (): string[] => {
  const source = read('../shared.mjs')
  const declaration = /export const ROUTES = \[([^\]]*)\]/.exec(source)?.[1] ?? ''
  return [...declaration.matchAll(/'([^']+)'/g)].map(([, route]) => route)
}

const rewriteRules = (): { source: string; destination: string }[] => {
  const yaml = read('../../render.yaml')
  return [...yaml.matchAll(/- type: rewrite\s+source: (\S+)\s+destination: (\S+)/g)].map(([, source, destination]) => ({
    source,
    destination,
  }))
}

// O Render só ignora as regras de rota quando existe um recurso no caminho
// exato pedido. `/blog` não é um recurso (o arquivo é `/blog/index.html`), então
// sem uma regra por rota a catch-all de SPA devolve a home em todas elas — e o
// prerender inteiro deixa de chegar a crawler nenhum.
describe('render.yaml — regras de rota do site estático', () => {
  it('tem um rewrite explícito para cada rota prerenderizada', () => {
    const rules = rewriteRules()

    for (const route of prerenderedRoutes()) {
      if (route === '/') continue // a raiz já resolve para index.html sozinha

      expect(rules).toContainEqual({ source: route, destination: `${route}/index.html` })
    }
  })

  it('mantém a catch-all de SPA por último, para não engolir as rotas acima', () => {
    const rules = rewriteRules()
    const catchAll = rules.at(-1)

    expect(catchAll).toEqual({ source: '/*', destination: '/index.html' })
    expect(rules.filter(rule => rule.source === '/*')).toHaveLength(1)
  })
})
