import { describe, it, expect } from 'vitest'

import footer from '@/data/footer.json'
import services from '@/data/services.json'

const catalogIds = services.catalog.map(service => service.id)

// Rótulo diferente precisa levar a lugar diferente: os tópicos do rodapé
// apontavam todos para `/servicos` sem âncora, e um deles nomeava um serviço
// que não existe no catálogo.
describe('footer.json — tópicos do rodapé', () => {
  it('leva cada tópico a um serviço real do catálogo', () => {
    expect(footer.topics.length).toBeGreaterThan(0)

    for (const topic of footer.topics) {
      expect(topic.label).toBeTruthy()
      expect(catalogIds).toContain(topic.serviceId)
    }
  })

  it('não repete destino entre os tópicos', () => {
    const destinations = footer.topics.map(topic => topic.serviceId)

    expect(new Set(destinations).size).toBe(destinations.length)
  })
})
