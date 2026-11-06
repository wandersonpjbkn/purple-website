import { describe, expect, it, vi } from 'vitest'

import { createFailureReporter, monitoringOptions } from '../../../shared/monitoring'

describe('monitoringOptions', () => {
  it('usa o DSN do ambiente e marca o serviço de origem', () => {
    const options = monitoringOptions({ SENTRY_DSN: 'https://key@sentry.example/1' }, 'mail-worker')

    expect(options.dsn).toBe('https://key@sentry.example/1')
    expect(options.initialScope.tags.service).toBe('mail-worker')
  })

  it('não coleta dado pessoal: IP, cookies, cabeçalhos, corpos, query string e variáveis locais', () => {
    const { dataCollection } = monitoringOptions({}, 'mail-worker')

    expect(dataCollection).toEqual({
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    })
  })

  it('fica desligado sem DSN', () => {
    expect(monitoringOptions({}, 'mail-worker').dsn).toBeUndefined()
  })
})

describe('createFailureReporter', () => {
  it('registra no log e envia ao Sentry como erro, com os detalhes', () => {
    const capture = vi.fn()
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})

    createFailureReporter(capture)('resend_failed', 422, 'validation_error')

    expect(log).toHaveBeenCalledWith('resend_failed', 422, 'validation_error')
    expect(capture).toHaveBeenCalledWith('resend_failed', {
      level: 'error',
      extra: { details: [422, 'validation_error'] },
    })
    log.mockRestore()
  })
})
