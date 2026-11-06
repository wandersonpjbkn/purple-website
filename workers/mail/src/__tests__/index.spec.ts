import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import * as Sentry from '@sentry/cloudflare'

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

vi.mock('@sentry/cloudflare', async importOriginal => ({
  ...(await importOriginal<typeof import('@sentry/cloudflare')>()),
  captureMessage: vi.fn(),
}))

const ctx = { waitUntil: vi.fn(), passThroughOnException: vi.fn() } as unknown as ExecutionContext

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
  beforeEach(() => {
    vi.mocked(Sentry.captureMessage).mockClear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('responde 400 a corpo que não é JSON, sem registrar falha nem enviar ao Sentry', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    const malformed = new Request('https://mail.purplecomunicacao.com.br/', {
      method: 'POST',
      headers: { Origin: env.ALLOWED_ORIGIN },
      body: '{"contact": {"name": "Ana", "email": "ana@empresa.com"',
    })

    const response = await worker.fetch(malformed, env, ctx)

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ success: false, message: 'Campos obrigatórios ausentes.' })
    expect(log).not.toHaveBeenCalled()
    expect(Sentry.captureMessage).not.toHaveBeenCalled()
  })

  it('registra o status e o tipo do erro do Resend quando o envio falha', async () => {
    stubUpstream()
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})

    await worker.fetch(request(), env, ctx)

    expect(log).toHaveBeenCalledWith('resend_failed', 422, 'validation_error', 'Invalid `from` field.')
    expect(Sentry.captureMessage).toHaveBeenCalledWith('resend_failed', {
      level: 'error',
      extra: { details: [422, 'validation_error', 'Invalid `from` field.'] },
    })
  })

  it('responde 500 com mensagem genérica, sem repassar o erro do Resend', async () => {
    stubUpstream()
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await worker.fetch(request(), env, ctx)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ success: false, message: 'Erro ao enviar e-mail.' })
  })

  it('responde 500 sem o detalhe interno quando a rede falha e registra o motivo no log', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})

    const response = await worker.fetch(request(), env, ctx)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ success: false, message: 'Erro ao processar requisição.' })
    expect(log).toHaveBeenCalledWith('request_failed', 'network down')
    expect(Sentry.captureMessage).toHaveBeenCalledWith('request_failed', {
      level: 'error',
      extra: { details: ['network down'] },
    })
  })
})
