// @vitest-environment node
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Server } from 'node:http'

import { describe, it, expect, beforeEach, afterEach } from 'vitest'

// @ts-expect-error — script utilitário em .mjs, sem tipos (fora do tsconfig do app)
import { createDistServer } from '../dist-server.mjs'

const SHELL = '<!doctype html><html><head><title>Shell</title></head><body><div id="app"></div></body></html>'
// O que o prerender grava por cima do shell ao capturar a home.
const SNAPSHOT =
  '<!doctype html><html><head><title>Home</title></head><body><div id="app"><main>home</main></div></body></html>'

let dist: string
let server: Server | undefined

const listen = async () => {
  server = await createDistServer({ dist, port: 0 })
  const address = server!.address()
  if (!address || typeof address === 'string') throw new Error('servidor sem porta')
  return `http://127.0.0.1:${address.port}`
}

beforeEach(async () => {
  dist = await mkdtemp(join(tmpdir(), 'dist-server-'))
  await writeFile(join(dist, 'index.html'), SHELL, 'utf-8')
})

afterEach(async () => {
  server?.close()
  server = undefined
  await rm(dist, { recursive: true, force: true })
})

describe('createDistServer — servidor estático do prerender', () => {
  it('serve o shell original mesmo depois de dist/index.html virar um snapshot', async () => {
    // Dado o servidor no ar sobre um dist recém-buildado
    const baseUrl = await listen()
    expect(await (await fetch(`${baseUrl}/sobre`)).text()).toContain('<div id="app"></div>')

    // Quando o prerender grava o snapshot da home por cima do index.html
    await writeFile(join(dist, 'index.html'), SNAPSHOT, 'utf-8')

    // Então as rotas seguintes continuam bootando do shell limpo — sem herdar
    // o <head> da home, que é o que duplicava o JSON-LD no snapshot publicado
    const html = await (await fetch(`${baseUrl}/servicos`)).text()
    expect(html).toContain('<div id="app"></div>')
    expect(html).not.toContain('<main>home</main>')
  })

  it('serve do disco o arquivo que existe, em vez de cair no shell', async () => {
    // Dado um asset real no dist
    await mkdir(join(dist, 'assets'), { recursive: true })
    await writeFile(join(dist, 'assets', 'app.js'), 'console.log(1)', 'utf-8')
    const baseUrl = await listen()

    // Quando o browser pede esse caminho
    const response = await fetch(`${baseUrl}/assets/app.js`)

    // Então vem o arquivo, com o Content-Type que faz o bundle executar
    expect(await response.text()).toBe('console.log(1)')
    expect(response.headers.get('content-type')).toBe('text/javascript')
  })

  it('recusa iniciar quando dist/index.html já é um snapshot de uma execução anterior', async () => {
    // Dado um dist onde o prerender já rodou e não houve build novo
    await writeFile(join(dist, 'index.html'), SNAPSHOT, 'utf-8')

    // Quando se tenta subir o servidor de novo
    // Então falha alto, em vez de reaproveitar o snapshot como shell
    await expect(createDistServer({ dist, port: 0 })).rejects.toThrow(/já é um snapshot/)
  })

  it('recusa iniciar quando não existe build no dist', async () => {
    await rm(join(dist, 'index.html'))

    await expect(createDistServer({ dist, port: 0 })).rejects.toThrow(/não existe/)
  })
})
