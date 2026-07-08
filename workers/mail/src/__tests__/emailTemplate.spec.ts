import { describe, it, expect } from 'vitest'

import { buildEmail } from '../emailTemplate'

const baseData = {
  name: 'Ana',
  email: 'ana@empresa.com',
  service: 'Endomarketing',
  message: 'Olá, quero conversar.',
  url: 'https://purplecomunicacao.com.br/contato',
  language: 'pt-BR',
  sentAt: '2026-07-08T12:00:00.000Z',
}

describe('buildEmail', () => {
  it('inclui todos os campos no HTML gerado', () => {
    const html = buildEmail(baseData)

    expect(html).toContain(baseData.name)
    expect(html).toContain(baseData.email)
    expect(html).toContain(baseData.service)
    expect(html).toContain(baseData.message)
    expect(html).toContain(baseData.url)
    expect(html).toContain(baseData.sentAt)
  })

  it('escapa HTML nos campos vindos do formulário', () => {
    const html = buildEmail({
      ...baseData,
      name: '<script>alert(1)</script>',
      message: 'Texto com "aspas" & <tag>',
    })

    expect(html).not.toContain('<script>alert(1)</script>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('&quot;aspas&quot;')
    expect(html).toContain('&amp;')
    expect(html).toContain('&lt;tag&gt;')
  })
})
