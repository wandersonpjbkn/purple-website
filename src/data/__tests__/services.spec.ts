import { describe, it, expect } from 'vitest'

import services from '@/data/services.json'
import home from '@/data/home.json'
import approach from '@/data/approach.json'
import { ICONS } from '@/components/ui/icons'

// Guarda de integridade do conteúdo publicado: substitui o antigo guard de
// placeholders (que garantia o inverso — copy ainda em validação).
describe('services.json / home.json — integridade do conteúdo', () => {
  it('não sobrou nenhum token de placeholder ({{...}})', () => {
    expect(JSON.stringify(services)).not.toMatch(/\{\{.*\}\}/)
    expect(JSON.stringify(home)).not.toMatch(/\{\{.*\}\}/)
  })

  it('não publica preços (decisão: sob consulta)', () => {
    expect(JSON.stringify(services)).not.toMatch(/R\$/)
    expect(JSON.stringify(home)).not.toMatch(/R\$/)
  })

  it('catálogo completo: 7 serviços com formato rico', () => {
    expect(services.catalog).toHaveLength(7)
    for (const service of services.catalog) {
      expect(service.id).toBeTruthy()
      expect(service.title).toBeTruthy()
      expect(service.tagline).toBeTruthy()
      expect(service.summary).toBeTruthy()
      expect(service.description).toBeTruthy()
      expect(service.benefits.length).toBeGreaterThanOrEqual(3)
      expect(service.process.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('exatamente um serviço em destaque (card featured da Home)', () => {
    expect(services.catalog.filter(s => s.featured)).toHaveLength(1)
  })

  it('3 pacotes com campos obrigatórios e preço sob consulta', () => {
    expect(services.packages.items).toHaveLength(3)
    expect(services.packages.priceLabel).toBe('Sob consulta')
    for (const pkg of services.packages.items) {
      expect(pkg.name).toBeTruthy()
      expect(pkg.audience).toBeTruthy()
      expect(pkg.includes.length).toBeGreaterThan(0)
    }
  })

  it('todo ícone referenciado nos dados existe no mapa de ícones', () => {
    const referenced = [
      ...services.catalog.map(s => s.icon),
      ...services.projects.items.map(p => p.icon),
      ...approach.pillars.map(p => p.icon),
      ...approach.differentials.map(d => d.icon),
    ]
    for (const name of referenced) {
      expect(ICONS[name], `ícone "${name}" não existe em icons.ts`).toBeDefined()
    }
  })

  it('hero da Home restaurado: stats com valor + sinal e frases do typewriter', () => {
    expect(home.hero.rotating.length).toBeGreaterThanOrEqual(3)
    expect(home.hero.stats).toHaveLength(3)
    for (const stat of home.hero.stats) {
      expect(stat.value).toBeTruthy()
      expect(stat.sign).toBeTruthy()
      expect(stat.label).toBeTruthy()
      // Modelo estrito: o campo `source` existe mesmo quando pendente de
      // confirmação (ver PROJECT_STATE.md).
      expect(stat).toHaveProperty('source')
    }
    expect(home.hero.card).toHaveProperty('source')
  })
})
