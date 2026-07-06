import { describe, it, expect } from 'vitest'

import { useContactForm } from '@/composables/useContactForm'

describe('useContactForm', () => {
  it('rejeita formulário vazio com uma mensagem por campo', () => {
    const { errors, validate } = useContactForm()

    const valid = validate()

    expect(valid).toBe(false)
    expect(errors.name).not.toBe('')
    expect(errors.email).not.toBe('')
    expect(errors.subject).not.toBe('')
    expect(errors.message).not.toBe('')
  })

  it('rejeita e-mail em formato inválido', () => {
    const { form, errors, validate } = useContactForm()
    form.name = 'Ana'
    form.email = 'não-é-um-email'
    form.subject = 'Endomarketing'
    form.message = 'Mensagem com mais de dez caracteres.'

    expect(validate()).toBe(false)
    expect(errors.email).not.toBe('')
  })

  it('rejeita mensagem com menos de 10 caracteres', () => {
    const { form, validate } = useContactForm()
    form.name = 'Ana'
    form.email = 'ana@empresa.com'
    form.subject = 'Endomarketing'
    form.message = 'curta'

    expect(validate()).toBe(false)
  })

  it('aceita formulário completo e válido, sem erros', () => {
    const { form, errors, validate } = useContactForm()
    form.name = 'Ana'
    form.email = 'ana@empresa.com'
    form.subject = 'Endomarketing'
    form.message = 'Olá, quero conversar sobre um projeto.'

    expect(validate()).toBe(true)
    expect(errors.name).toBe('')
    expect(errors.email).toBe('')
    expect(errors.subject).toBe('')
    expect(errors.message).toBe('')
  })

  it('clearForm limpa campos e erros', () => {
    const { form, errors, validate, clearForm } = useContactForm()
    form.name = 'Ana'
    validate()

    clearForm()

    expect(form.name).toBe('')
    expect(errors.name).toBe('')
  })
})
