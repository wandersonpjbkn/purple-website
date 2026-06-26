import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

import { useEmailJS } from '@/composables/useEmailJS'

const form = { name: 'Ana', email: 'ana@empresa.com', subject: 'Endomarketing', message: 'Olá, quero conversar.' }

describe('useEmailJS', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    delete (window as unknown as { emailjs?: unknown }).emailjs
  })

  it('sem env configurada, simula sucesso (não trava o dev)', async () => {
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '')
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', '')
    const { status, send } = useEmailJS()

    const ok = await send(form)

    expect(ok).toBe(true)
    expect(status.value).toBe('success')
  })

  describe('com env configurada', () => {
    beforeEach(() => {
      vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'service_x')
      vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'template_x')
    })

    it('erra se o SDK do EmailJS não carregou', async () => {
      const { status, errorMsg, send } = useEmailJS()
      const ok = await send(form)
      expect(ok).toBe(false)
      expect(status.value).toBe('error')
      expect(errorMsg.value).not.toBe('')
    })

    it('envia quando o SDK está presente', async () => {
      const sendSpy = vi.fn().mockResolvedValue({ status: 200, text: 'OK' })
      ;(window as unknown as { emailjs: { send: typeof sendSpy } }).emailjs = { send: sendSpy }

      const { status, send } = useEmailJS()
      const ok = await send(form)

      expect(ok).toBe(true)
      expect(status.value).toBe('success')
      expect(sendSpy).toHaveBeenCalledOnce()
    })
  })
})
