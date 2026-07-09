import { describe, it, expect, vi, beforeEach } from 'vitest'

import worker from '../index'

import type { Env } from '../types'

const POST_A = ['---', 'title: Post A', 'date: 2026-01-10', 'category: Cultura', '---', 'Corpo do **post A**.'].join('\n')
const POST_B = ['---', 'title: Post B', 'slug: slug-custom', 'date: 2026-03-01', 'category: RH', '---', 'Corpo do post B.'].join('\n')

const makeBucket = (files: Record<string, string>, pageSize = 1000) => ({
  list: vi.fn(({ prefix, cursor }: { prefix: string; cursor?: string }) => {
    const keys = Object.keys(files)
      .filter(key => key.startsWith(prefix))
      .sort()
    const start = cursor ? parseInt(cursor, 10) : 0
    const page = keys.slice(start, start + pageSize)
    const truncated = start + pageSize < keys.length
    return Promise.resolve({
      objects: page.map(key => ({ key })),
      truncated,
      cursor: truncated ? String(start + pageSize) : undefined,
    })
  }),
  get: vi.fn((key: string) => Promise.resolve(files[key] === undefined ? null : { text: () => Promise.resolve(files[key]) })),
})

const makeEnv = (bucket: ReturnType<typeof makeBucket>): Env =>
  ({
    BLOG_DEPLOY_TOKEN: 'token-secreto',
    RENDER_DEPLOY_HOOK: 'https://render.example/hook',
    POSTS_BUCKET: bucket,
    ALLOWED_ORIGIN: 'https://purplecomunicacao.com.br',
    ALLOWED_ORIGIN_WWW: 'https://www.purplecomunicacao.com.br',
  }) as unknown as Env

const makeCtx = () => ({ waitUntil: vi.fn() }) as unknown as ExecutionContext

const cacheStub = {
  match: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
}

const request = (path: string, init: RequestInit = {}) => new Request(`https://blog.example${path}`, init)

beforeEach(() => {
  vi.clearAllMocks()
  cacheStub.match.mockResolvedValue(undefined)
  vi.stubGlobal('caches', { default: cacheStub })
})

describe('GET /index', () => {
  it('retorna metadados sem html, ordenados por data desc', async () => {
    const env = makeEnv(makeBucket({ 'posts/post-a.md': POST_A, 'posts/post-b.md': POST_B }))
    const response = await worker.fetch(request('/index'), env, makeCtx())
    const body = (await response.json()) as Array<Record<string, unknown>>

    expect(response.status).toBe(200)
    expect(body).toHaveLength(2)
    expect(body[0]?.title).toBe('Post B')
    expect(body[1]?.title).toBe('Post A')
    expect(body[0]).not.toHaveProperty('html')
    expect(response.headers.get('Cache-Control')).toContain('max-age=300')
    expect(response.headers.get('ETag')).toMatch(/^W\//)
  })

  it('pagina a listagem do R2 quando truncada', async () => {
    const bucket = makeBucket({ 'posts/post-a.md': POST_A, 'posts/post-b.md': POST_B }, 1)
    const env = makeEnv(bucket)
    const response = await worker.fetch(request('/index'), env, makeCtx())
    const body = (await response.json()) as unknown[]

    expect(body).toHaveLength(2)
    expect(bucket.list).toHaveBeenCalledTimes(2)
  })

  it('responde 304 quando If-None-Match bate com o ETag', async () => {
    const env = makeEnv(makeBucket({ 'posts/post-a.md': POST_A }))
    const first = await worker.fetch(request('/index'), env, makeCtx())
    const etag = first.headers.get('ETag') as string

    const second = await worker.fetch(request('/index', { headers: { 'If-None-Match': etag } }), env, makeCtx())
    expect(second.status).toBe(304)
    expect(await second.text()).toBe('')
  })

  it('serve do edge cache sem tocar o R2 e anexa CORS por request', async () => {
    const env = makeEnv(makeBucket({}))
    cacheStub.match.mockResolvedValue(
      new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } })
    )

    const response = await worker.fetch(
      request('/index', { headers: { Origin: 'https://purplecomunicacao.com.br' } }),
      env,
      makeCtx()
    )

    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://purplecomunicacao.com.br')
    expect((env.POSTS_BUCKET as unknown as ReturnType<typeof makeBucket>).list).not.toHaveBeenCalled()
  })
})

describe('GET /posts/:slug', () => {
  it('retorna o post com html pelo nome do arquivo', async () => {
    const env = makeEnv(makeBucket({ 'posts/post-a.md': POST_A }))
    const response = await worker.fetch(request('/posts/post-a'), env, makeCtx())
    const body = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(200)
    expect(body.slug).toBe('post-a')
    expect(body.html).toContain('<strong>post A</strong>')
  })

  it('encontra post cujo slug do frontmatter difere do nome do arquivo', async () => {
    const env = makeEnv(makeBucket({ 'posts/post-b.md': POST_B }))
    const response = await worker.fetch(request('/posts/slug-custom'), env, makeCtx())
    const body = (await response.json()) as Record<string, unknown>

    expect(response.status).toBe(200)
    expect(body.slug).toBe('slug-custom')
    expect(body.title).toBe('Post B')
  })

  it('retorna 404 para slug inexistente, sem gravar no cache', async () => {
    const env = makeEnv(makeBucket({ 'posts/post-a.md': POST_A }))
    const response = await worker.fetch(request('/posts/nao-existe'), env, makeCtx())

    expect(response.status).toBe(404)
    expect(cacheStub.put).not.toHaveBeenCalled()
  })
})

describe('CORS e métodos', () => {
  it('recusa origem não permitida com 403', async () => {
    const env = makeEnv(makeBucket({}))
    const response = await worker.fetch(request('/index', { headers: { Origin: 'https://malicioso.example' } }), env, makeCtx())
    expect(response.status).toBe(403)
  })

  it('responde preflight OPTIONS com 200', async () => {
    const env = makeEnv(makeBucket({}))
    const response = await worker.fetch(request('/index', { method: 'OPTIONS' }), env, makeCtx())
    expect(response.status).toBe(200)
  })

  it('mantém a rota legada /posts com o array completo (html incluso)', async () => {
    const env = makeEnv(makeBucket({ 'posts/post-a.md': POST_A, 'posts/post-b.md': POST_B }))
    const response = await worker.fetch(request('/posts'), env, makeCtx())
    const body = (await response.json()) as Array<Record<string, unknown>>

    expect(body).toHaveLength(2)
    expect(body[0]).toHaveProperty('html')
  })
})

describe('POST /deploy', () => {
  it('purga o cache do índice e dispara o hook do Render', async () => {
    const env = makeEnv(makeBucket({}))
    const ctx = makeCtx()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('ok')))

    const response = await worker.fetch(
      request('/deploy', { method: 'POST', headers: { Authorization: 'token-secreto' } }),
      env,
      ctx
    )

    expect(response.status).toBe(200)
    expect(cacheStub.delete).toHaveBeenCalledTimes(1)
    const deleted = cacheStub.delete.mock.calls[0]?.[0] as Request
    expect(new URL(deleted.url).pathname).toBe('/index')
    expect(ctx.waitUntil).toHaveBeenCalledTimes(2)
  })

  it('recusa token inválido com 401', async () => {
    const env = makeEnv(makeBucket({}))
    const response = await worker.fetch(request('/deploy', { method: 'POST', headers: { Authorization: 'errado' } }), env, makeCtx())
    expect(response.status).toBe(401)
    expect(cacheStub.delete).not.toHaveBeenCalled()
  })
})
