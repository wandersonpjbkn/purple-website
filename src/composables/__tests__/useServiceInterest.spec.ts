import { describe, it, expect } from 'vitest'

import { resolveServiceInterest, SERVICE_INTEREST_OPTIONS } from '@/composables/useServiceInterest'
import services from '@/data/services.json'

describe('useServiceInterest', () => {
  it('resolve o id de um serviço do catálogo para o título do serviço', () => {
    expect(resolveServiceInterest('endomarketing')).toBe('Endomarketing')
  })

  it('resolve o id de um plano mensal para o nome do plano', () => {
    expect(resolveServiceInterest('cultura-ativa')).toBe('Cultura Ativa')
  })

  it('retorna string vazia para um slug desconhecido', () => {
    expect(resolveServiceInterest('nao-existe')).toBe('')
  })

  it('retorna string vazia quando o slug está ausente ou nulo', () => {
    expect(resolveServiceInterest(undefined)).toBe('')
    expect(resolveServiceInterest(null)).toBe('')
  })

  it('lida com o formato de array do vue-router (repeated query key)', () => {
    expect(resolveServiceInterest(['endomarketing', 'outro'])).toBe('Endomarketing')
  })

  it('lista todas as opções de interesse: catálogo + planos + duas opções genéricas', () => {
    expect(SERVICE_INTEREST_OPTIONS).toHaveLength(services.catalog.length + services.packages.items.length + 2)
    expect(SERVICE_INTEREST_OPTIONS.slice(-2)).toEqual(['Orçamento geral', 'Outro'])
    expect(SERVICE_INTEREST_OPTIONS).toContain('Endomarketing')
    expect(SERVICE_INTEREST_OPTIONS).toContain('Cultura Ativa')
  })
})
