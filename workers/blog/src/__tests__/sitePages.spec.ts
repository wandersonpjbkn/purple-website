import { describe, it, expect, vi, beforeEach } from 'vitest'

import worker from '../index'

import type { Env } from '../types'

// HTMLRewriter só existe no runtime do Workers; a reescrita real é conferida com `wrangler dev`.
class FakeRewriter {
  private handlers: [string, { element: (element: unknown) => void }][] = []

  on(selector: string, handler: { element: (element: unknown) => void }) {
    this.handlers.push([selector, handler])
    return this
  }

  transform(response: Response) {
    const applied: Record<string, string> = {}
    for (const [selector, handler] of this.handlers) {
      handler.element({
        setInnerContent: (value: string) => (applied[`${selector}:content`] = value),
        append: (value: string) => (applied[`${selector}:append`] = value),
        remove: () => (applied[`${selector}:removed`] = 'yes'),
      })
    }
    return new Response(JSON.stringify(applied), { status: response.status, headers: response.headers })
  }
}

const POST_A = [
  '---',
  'title: Post A',
  'date: 2026-01-10',
  'category: Cultura',
  'cover: blog/a.jpg',
  '---',
  'Corpo.',
].join('\n')
const SHELL =
  '<!doctype html><html><head><title>Purple Comunicação</title></head><body><div id="app"></div></body></html>'
const SITE = 'https://site.example'

const makeBucket = (files: Record<string, string>) => ({
  list: vi.fn(({ prefix }: { prefix: string }) =>
    Promise.resolve({
      objects: Object.keys(files)
        .filter(key => key.startsWith(prefix))
        .map(key => ({ key })),
      truncated: false,
    })
  ),
  get: vi.fn((key: string) =>
    Promise.resolve(files[key] === undefined ? null : { text: () => Promise.resolve(files[key]) })
  ),
})

const makeEnv = (files: Record<string, string>): Env =>
  ({
    POSTS_BUCKET: makeBucket(files),
    ALLOWED_ORIGIN: SITE,
    ALLOWED_ORIGIN_WWW: SITE,
    SITE_ORIGIN: SITE,
    CDN_URL: 'https://cdn.example',
  }) as unknown as Env

const makeCtx = () => ({ waitUntil: vi.fn() }) as unknown as ExecutionContext

const cacheStub = { match: vi.fn(), put: vi.fn(), delete: vi.fn() }

const origin = vi.fn<(url: string) => Response>()

const page = (path: string, init: RequestInit = {}) => new Request(`https://purplecomunicacao.com.br${path}`, init)

const applied = async (response: Response) => (await response.json()) as Record<string, string>

beforeEach(() => {
  vi.clearAllMocks()
  cacheStub.match.mockResolvedValue(undefined)
  origin.mockImplementation(url =>
    url === `${SITE}/spa-shell.html` ? new Response(SHELL) : new Response('origem', { status: 200 })
  )
  vi.stubGlobal('caches', { default: cacheStub })
  vi.stubGlobal('HTMLRewriter', FakeRewriter)
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo) => Promise.resolve(origin(typeof input === 'string' ? input : input.url)))
  )
})

describe('GET /blog/:slug no domínio do site', () => {
  it('serve o shell do SPA com título e meta tags do post', async () => {
    const response = await worker.fetch(page('/blog/post-a'), makeEnv({ 'posts/post-a.md': POST_A }), makeCtx())
    const result = await applied(response)

    expect(response.status).toBe(200)
    expect(result['title:content']).toBe('Post A | Purple Comunicação')
    expect(result['head:append']).toContain('<meta property="og:image" content="https://cdn.example/blog/a.jpg">')
    expect(result['head:append']).toContain('<link rel="canonical" href="https://site.example/blog/post-a">')
  })

  it('encontra post recém-publicado que ainda não está no índice em cache', async () => {
    cacheStub.match.mockImplementation((key: Request) =>
      Promise.resolve(key.url.endsWith('/index') ? new Response('[]') : undefined)
    )

    const response = await worker.fetch(page('/blog/post-a'), makeEnv({ 'posts/post-a.md': POST_A }), makeCtx())

    expect(response.status).toBe(200)
    expect((await applied(response))['title:content']).toBe('Post A | Purple Comunicação')
  })

  it('responde 404 com o shell para slug inexistente, em vez de devolver a home', async () => {
    const response = await worker.fetch(page('/blog/nao-existe'), makeEnv({ 'posts/post-a.md': POST_A }), makeCtx())
    const result = await applied(response)

    expect(response.status).toBe(404)
    expect(result['title:content']).toBe('Post não encontrado | Purple Comunicação')
    expect(result['head:append']).toBe('')
  })

  it('se o shell falhar, repassa a requisição para a origem em vez de quebrar a página', async () => {
    origin.mockImplementation(url =>
      url.endsWith('/spa-shell.html') ? new Response('erro', { status: 503 }) : new Response('origem')
    )

    const response = await worker.fetch(page('/blog/post-a'), makeEnv({ 'posts/post-a.md': POST_A }), makeCtx())

    expect(await response.text()).toBe('origem')
    expect(origin).toHaveBeenLastCalledWith(`${SITE}/blog/post-a`)
  })

  it('repassa métodos que não são leitura e pedidos de arquivo direto para a origem', async () => {
    const env = makeEnv({})

    await worker.fetch(page('/blog/post-a', { method: 'POST' }), env, makeCtx())
    expect(origin).toHaveBeenLastCalledWith(`${SITE}/blog/post-a`)

    await worker.fetch(page('/blog/autor/x/index.html'), env, makeCtx())
    expect(origin).toHaveBeenLastCalledWith(`${SITE}/blog/autor/x/index.html`)
  })
})

describe('GET /blog/autor/:slug no domínio do site', () => {
  it('serve o snapshot prerenderizado do autor', async () => {
    origin.mockImplementation(url =>
      url === `${SITE}/blog/autor/suelen-fernanda/index.html` ? new Response('snapshot do autor') : new Response(SHELL)
    )

    const response = await worker.fetch(page('/blog/autor/suelen-fernanda'), makeEnv({}), makeCtx())

    expect(await response.text()).toBe('snapshot do autor')
  })

  it('sem snapshot, cai no shell do SPA (nunca na home)', async () => {
    origin.mockImplementation(url =>
      url === `${SITE}/spa-shell.html` ? new Response(SHELL) : new Response('não existe', { status: 404 })
    )

    const response = await worker.fetch(page('/blog/autor/novo-autor'), makeEnv({}), makeCtx())

    expect(await response.text()).toBe(SHELL)
  })
})
