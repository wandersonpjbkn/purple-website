import { describe, it, expect } from 'vitest'
import { ref } from 'vue'

import { useWhatsappUrl } from '@/composables/useWhatsapp'
import { useContact } from '@/composables/useContact'

describe('useWhatsappUrl', () => {
  it('monta a URL do wa.me com o telefone de contato e a mensagem codificada', () => {
    const { phone } = useContact()
    const message = 'Olá, tudo bem?'

    const url = useWhatsappUrl(message)

    expect(url.value).toBe(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
  })

  it('codifica acentos, espaços e pontuação da mensagem', () => {
    const message = 'Olá! Vim pelo site & quero saber mais (urgente)?'

    const url = useWhatsappUrl(message)

    expect(url.value).toContain(`text=${encodeURIComponent(message)}`)
    expect(url.value).not.toContain(message)
    expect(url.value).not.toContain(' ')
  })

  it('atualiza reativamente quando a mensagem passada como ref muda', () => {
    const message = ref('Primeira mensagem')
    const url = useWhatsappUrl(message)
    const firstUrl = url.value

    message.value = 'Segunda mensagem'

    expect(url.value).not.toBe(firstUrl)
    expect(url.value).toContain(encodeURIComponent('Segunda mensagem'))
  })
})
