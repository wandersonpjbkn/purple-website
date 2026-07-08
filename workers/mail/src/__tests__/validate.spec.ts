import { describe, it, expect } from 'vitest'

import { validateContactRequest } from '../validate'

import type { ContactRequest } from '../types'

const validBody: ContactRequest = {
  contact: { name: 'Ana', email: 'ana@empresa.com' } as ContactRequest['contact'],
  interest: { service: 'Endomarketing', message: 'Olá, quero conversar.' },
  metadata: { url: '', language: '', sentAt: '' },
  turnstileToken: 'token-123',
}

describe('validateContactRequest', () => {
  it('aceita um payload com todos os campos obrigatórios', () => {
    expect(validateContactRequest(validBody)).toBe(true)
  })

  it('rejeita quando falta o nome', () => {
    expect(
      validateContactRequest({
        ...validBody,
        contact: { ...validBody.contact, name: '' },
      })
    ).toBe(false)
  })

  it('rejeita quando falta o token do Turnstile', () => {
    expect(validateContactRequest({ ...validBody, turnstileToken: '' })).toBe(false)
  })

  it('rejeita quando falta o serviço de interesse', () => {
    expect(
      validateContactRequest({
        ...validBody,
        interest: { ...validBody.interest, service: '' },
      })
    ).toBe(false)
  })
})
