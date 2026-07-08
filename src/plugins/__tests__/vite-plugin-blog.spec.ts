import { describe, it, expect, afterEach, vi } from 'vitest'

import { blogPlugin } from '@/plugins/vite-plugin-blog'

const samplePosts = [
  { slug: 'post-a', title: 'Post A', category: 'Cultura', featured: true },
  { slug: 'post-b', title: 'Post B', category: 'RH', featured: false },
]

describe('blogPlugin', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('resolve virtual:blog-posts para um id interno e ignora outros ids', () => {
    const plugin = blogPlugin()
    const resolveId = plugin.resolveId as (id: string) => string | undefined

    const resolved = resolveId('virtual:blog-posts')

    expect(resolved).toBeTruthy()
    expect(resolveId('outro-modulo')).toBeUndefined()
  })

  it('load() busca posts do worker e exporta os helpers com os dados reais', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(samplePosts) })
    )
    const plugin = blogPlugin('https://blog.worker.dev')
    const resolveId = plugin.resolveId as (id: string) => string | undefined
    const load = plugin.load as (id: string) => Promise<string | undefined>

    const code = await load(resolveId('virtual:blog-posts')!)

    expect(fetch).toHaveBeenCalledWith('https://blog.worker.dev/posts')
    expect(code).toContain('"slug":"post-a"')
    expect(code).toContain('export function getPost')
    expect(code).toContain('export function getAllCategories')
  })

  it('load() cai em fallback vazio quando o fetch falha, sem lançar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const plugin = blogPlugin()
    const resolveId = plugin.resolveId as (id: string) => string | undefined
    const load = plugin.load as (id: string) => Promise<string | undefined>

    const code = await load(resolveId('virtual:blog-posts')!)

    expect(code).toContain('export const posts = [];')
  })

  it('load() cai em fallback vazio quando a resposta HTTP não é ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))
    const plugin = blogPlugin()
    const resolveId = plugin.resolveId as (id: string) => string | undefined
    const load = plugin.load as (id: string) => Promise<string | undefined>

    const code = await load(resolveId('virtual:blog-posts')!)

    expect(code).toContain('export const posts = [];')
  })

  it('load() não retorna nada para ids que não são o módulo virtual', async () => {
    const plugin = blogPlugin()
    const load = plugin.load as (id: string) => Promise<string | undefined>

    expect(await load('outro-id')).toBeUndefined()
  })
})
