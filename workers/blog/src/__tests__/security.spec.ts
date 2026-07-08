import { describe, it, expect } from 'vitest'

import { timingSafeEqual } from '../../../shared/security'

describe('timingSafeEqual', () => {
  it('retorna true para strings idênticas', () => {
    expect(timingSafeEqual('segredo-123', 'segredo-123')).toBe(true)
  })

  it('retorna false para strings diferentes do mesmo tamanho', () => {
    expect(timingSafeEqual('segredo-123', 'segredo-456')).toBe(false)
  })

  it('retorna false para strings de tamanhos diferentes', () => {
    expect(timingSafeEqual('curta', 'muito-mais-longa')).toBe(false)
  })

  it('retorna false comparando com string vazia', () => {
    expect(timingSafeEqual('', 'algo')).toBe(false)
  })
})
