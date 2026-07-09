import { describe, it, expect, afterEach, vi } from 'vitest'

import { useMail } from '@/composables/useMail'

const form = { name: 'Ana', email: 'ana@empresa.com', service: 'Endomarketing', message: 'Olá, quero conversar.' }

describe('useMail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('envia com sucesso quando a API responde success: true', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) }))
    const { status, send } = useMail()

    const ok = await send(form, 'turnstile-token')

    expect(ok).toBe(true)
    expect(status.value).toBe('success')
  })

  it('erra quando a API responde success: false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ success: false, message: 'Falha na validação.' }),
      })
    )
    const { status, errorMsg, send } = useMail()

    const ok = await send(form, 'turnstile-token')

    expect(ok).toBe(false)
    expect(status.value).toBe('error')
    expect(errorMsg.value).toBe('Falha na validação.')
  })

  it('trata timeout da requisição', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new DOMException('Aborted', 'AbortError')))
    const { status, errorMsg, send } = useMail()

    const ok = await send(form, 'turnstile-token')

    expect(ok).toBe(false)
    expect(status.value).toBe('error')
    expect(errorMsg.value).toContain('demorou mais do que o esperado')
  })

  it('reset volta ao estado idle', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) }))
    const { status, errorMsg, send, reset } = useMail()
    await send(form, 'turnstile-token')

    reset()

    expect(status.value).toBe('idle')
    expect(errorMsg.value).toBe('')
  })
})
