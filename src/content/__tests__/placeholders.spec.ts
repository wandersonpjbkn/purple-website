import { describe, it, expect } from 'vitest'

import { POSITIONING_HOOK, SERVICE_OFFER, SERVICE_OFFER_DRAFT } from '@/content/placeholders'

// Guarda de produto: o conteúdo em validação fica isolado em placeholders.ts.
// O hero virou um RASCUNHO 🟡 (hipótese A/B, não validada — não publica o site,
// que segue noindex). A oferta de Serviços continua 100% placeholder.
// Ver src/docs/CONTENT_MODEL.md e POSITIONING.md.

describe('POSITIONING_HOOK (rascunho do hero — hipótese não validada)', () => {
  it('mantém as duas variantes de manchete e um seletor válido', () => {
    expect(POSITIONING_HOOK.headlineVariants.A.length).toBeGreaterThan(0)
    expect(POSITIONING_HOOK.headlineVariants.B.length).toBeGreaterThan(0)
    expect(['A', 'B']).toContain(POSITIONING_HOOK.activeHeadline)
  })

  it('a variante ativa resolve para uma manchete não vazia', () => {
    const headline = POSITIONING_HOOK.headlineVariants[POSITIONING_HOOK.activeHeadline]
    expect(typeof headline).toBe('string')
    expect(headline.length).toBeGreaterThan(0)
  })

  it('tem eyebrow, subhead e a linha secundária de NR-1', () => {
    expect(POSITIONING_HOOK.eyebrow.length).toBeGreaterThan(0)
    expect(POSITIONING_HOOK.subhead.length).toBeGreaterThan(0)
    expect(POSITIONING_HOOK.nr1Line.length).toBeGreaterThan(0)
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
