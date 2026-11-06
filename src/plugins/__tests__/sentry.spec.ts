import { describe, it, expect } from 'vitest'

import { sentryOptions } from '@/plugins/sentry'

const SITE = 'https://purplecomunicacao.com.br'
const DSN = 'https://key@o0.ingest.sentry.io/0'

const env = (overrides = {}) => ({ dsn: DSN, siteUrl: SITE, dev: false, ...overrides })

describe('Funcionalidade: monitoramento de erros no front', () => {
  describe('Cenário: onde o Sentry liga', () => {
    it('Dado DSN e o host do site, Então liga', () => {
      expect(sentryOptions(env(), 'purplecomunicacao.com.br')).not.toBeNull()
    })

    it('Dado o snapshot do prerender em localhost:4180, Então não liga', () => {
      expect(sentryOptions(env(), 'localhost')).toBeNull()
    })

    it('Dado outro host (preview, cópia do site), Então não liga', () => {
      expect(sentryOptions(env(), 'purple-website.onrender.com')).toBeNull()
    })

    it('Dado o ambiente de desenvolvimento, Então não liga', () => {
      expect(sentryOptions(env({ dev: true }), 'purplecomunicacao.com.br')).toBeNull()
    })

    it('Dado DSN ou URL do site ausentes, Então não liga', () => {
      expect(sentryOptions(env({ dsn: '' }), 'purplecomunicacao.com.br')).toBeNull()
      expect(sentryOptions(env({ siteUrl: '' }), 'purplecomunicacao.com.br')).toBeNull()
    })
  })

  describe('Cenário: o que é enviado (fora do aviso de cookies, sem dado pessoal)', () => {
    const options = sentryOptions(env(), 'purplecomunicacao.com.br')

    it('Então a coleta automática do SDK está toda desligada', () => {
      expect(options?.dataCollection).toEqual({
        userInfo: false,
        cookies: false,
        httpHeaders: false,
        httpBodies: [],
        urlQueryParams: false,
        stackFrameVariables: false,
      })
    })

    it('Então as props dos componentes (ex.: valor de campo do formulário) não vão junto do erro', () => {
      expect(options?.attachProps).toBe(false)
    })

    it('Então não há tracing e o serviço é marcado como frontend', () => {
      expect(options?.tracesSampleRate).toBe(0)
      expect(options?.initialScope).toEqual({ tags: { service: 'frontend' } })
    })

    it('Então só erros vindos dos scripts do próprio site entram', () => {
      expect(options?.allowUrls).toEqual([SITE])
    })

    it('Então a sessão por visita é removida e os demais padrões ficam', () => {
      const defaults = [{ name: 'BrowserSession' }, { name: 'GlobalHandlers' }, { name: 'Vue' }]
      const integrations = options?.integrations as (list: typeof defaults) => typeof defaults
      expect(integrations(defaults).map(({ name }) => name)).toEqual(['GlobalHandlers', 'Vue'])
    })
  })
})
