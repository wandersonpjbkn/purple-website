import { afterEach, describe, expect, it, vi } from 'vitest'

import worker from '../index'

import type { ContactRequest, Env } from '../types'

const env: Env = {
  TURNSTILE_SECRET: 'turnstile-secret',
  RESEND_API_KEY: 'resend-key',
  ALLOWED_ORIGIN: 'https://purplecomunicacao.com.br',
  ALLOWED_ORIGIN_WWW: 'https://www.purplecomunicacao.com.br',
  EMAIL_FROM: 'contato@purplecomunicacao.com.br',
  EMAIL_TO: 'destino@empresa.com',
}

const body: ContactRequest = {
  contact: { name: 'Ana', email: 'ana@empresa.com' } as ContactRequest['contact'],
  interest: { service: 'Endomarketing', message: 'Olá, quero conversar.' },
  metadata: { url: '', language: '', sentAt: '' },
  turnstileToken: 'token-123',
}

const request = () =>
  new Request('https://mail.purplecomunicacao.com.br/', {
    method: 'POST',
    headers: { Origin: env.ALLOWED_ORIGIN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

const resendError = { statusCode: 422, name: 'validation_error', message: 'Invalid `from` field.' }

const stubUpstream = () =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string) =>
      url.includes('challenges.cloudflare.com')
        ? new Response(JSON.stringify({ success: true }))
        : new Response(JSON.stringify(resendError), { status: 422 })
    )
  )

describe('worker de e-mail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('registra o status e o tipo do erro do Resend quando o envio falha', async () => {
    stubUpstream()
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})

    await worker.fetch(request(), env)

    expect(log).toHaveBeenCalledWith('resend_failed', 422, 'validation_error', 'Invalid `from` field.')
  })

  it('responde 500 com mensagem genérica, sem repassar o erro do Resend', async () => {
    stubUpstream()
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await worker.fetch(request(), env)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ success: false, message: 'Erro ao enviar e-mail.' })
  })

  it('responde 500 sem o detalhe interno quando a rede falha e registra o motivo no log', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await worker.fetch(request(), env)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ success: false, message: 'Erro ao processar requisição.' })
    expect(log).toHaveBeenCalledWith('request_failed', 'network down')
  })
})
