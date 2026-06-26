import { describe, it, expect } from 'vitest'

import { POSITIONING_HOOK, SERVICE_OFFER, SERVICE_OFFER_DRAFT } from '@/content/placeholders'

// Guarda de produto: enquanto posicionamento/oferta não forem validados, o
// site NÃO pode renderizar copy final — só os placeholders trocáveis.
// Ver src/docs/CONTENT_MODEL.md e POSITIONING.md.

describe('POSITIONING_HOOK (hero em validação)', () => {
  it('título, eyebrow e subtítulo são placeholders', () => {
    expect(POSITIONING_HOOK.title).toBe('{{POSITIONING_HOOK}}')
    expect(POSITIONING_HOOK.eyebrow).toBe('{{POSITIONING_HOOK}}')
    expect(POSITIONING_HOOK.subtitle).toBe('{{POSITIONING_HOOK}}')
  })

  it('frases do typewriter e proofPoints são placeholders', () => {
    expect(POSITIONING_HOOK.rotating.every((s) => s === '{{POSITIONING_HOOK}}')).toBe(true)
    expect(POSITIONING_HOOK.proofPoints.every((p) => p.value === '{{POSITIONING_HOOK}}')).toBe(true)
  })
})

describe('SERVICE_OFFER (oferta em validação)', () => {
  it('enquadramento é placeholder', () => {
    expect(SERVICE_OFFER.title).toBe('{{SERVICE_OFFER}}')
    expect(SERVICE_OFFER.subtitle).toBe('{{SERVICE_OFFER}}')
  })

  it('todos os cards renderizados são placeholders (inclusive nomes)', () => {
    expect(SERVICE_OFFER.items.length).toBeGreaterThan(0)
    expect(SERVICE_OFFER.items.every((i) => i.title === '{{SERVICE_OFFER}}')).toBe(true)
  })
})

describe('SERVICE_OFFER_DRAFT (rascunho preservado, não renderizado)', () => {
  it('mantém o catálogo antigo como hipótese', () => {
    expect(SERVICE_OFFER_DRAFT.length).toBeGreaterThan(0)
    expect(SERVICE_OFFER_DRAFT.every((s) => typeof s.title === 'string' && s.title.length > 0)).toBe(true)
  })
})
