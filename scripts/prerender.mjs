/**
 * Static prerender (post-build SEO snapshot).
 *
 * The app is a client-rendered SPA, so the initial HTML is nearly empty until
 * the JS runs — bad for crawlers. This script boots the already-built `dist/`
 * in a headless Chromium, lets each route render, and writes the resulting HTML
 * back to `dist/<route>/index.html`. The bundle scripts stay in place, so the
 * SPA still boots and takes over on real visits — crawlers just get content.
 *
 * Runs only where a Chromium is available (this is NOT part of `yarn build`).
 * Point it at a browser via PRERENDER_CHROMIUM, or rely on auto-detection /
 * `npx playwright install chromium`.
 */
import http from 'node:http'
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'

import { chromium } from 'playwright-core'

const DIST = join(process.cwd(), 'dist')
const PORT = 4180

// Rotas estáticas (as dinâmicas do blog ficam client-rendered).
const ROUTES = ['/', '/sobre', '/abordagem', '/servicos', '/contato', '/blog', '/faq', '/privacidade']

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

const resolveChromium = async () => {
  if (process.env.PRERENDER_CHROMIUM) return process.env.PRERENDER_CHROMIUM
  const base = '/opt/pw-browsers'
  if (existsSync(base)) {
    const dir = (await readdir(base)).find((d) => /^chromium-\d+$/.test(d))
    const candidate = dir && join(base, dir, 'chrome-linux', 'chrome')
    if (candidate && existsSync(candidate)) return candidate
  }
  try {
    return chromium.executablePath()
  } catch {
    return undefined
  }
}

// Servidor estático com fallback SPA (qualquer rota → index.html).
const startServer = () =>
  new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const path = decodeURIComponent((req.url ?? '/').split('?')[0])
      let file = join(DIST, path)
      if (!extname(file) || !existsSync(file)) file = join(DIST, 'index.html')
      try {
        const buf = await readFile(file)
        res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream')
        res.end(buf)
      } catch {
        res.statusCode = 404
        res.end('not found')
      }
    })
    server.listen(PORT, () => resolve(server))
  })

const run = async () => {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html não existe. Rode `yarn build` antes.')
    process.exit(1)
  }

  const executablePath = await resolveChromium()
  const server = await startServer()
  const browser = await chromium.launch({ executablePath })
  const page = await browser.newPage()

  for (const route of ROUTES) {
    // Não esperar `networkidle`: CDNs externos (fontes, GTM) podem travar.
    // O sinal real é o app ter renderizado dentro de #app.
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('#app > *', { timeout: 15000 })
    await page.waitForTimeout(300)

    const html = '<!DOCTYPE html>\n' + (await page.content()).replace(/^<!DOCTYPE html>/i, '').trimStart()
    const outFile = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
    await mkdir(dirname(outFile), { recursive: true })
    await writeFile(outFile, html, 'utf-8')
    console.log(`[prerender] ${route} → ${outFile.replace(DIST + '/', 'dist/')}`)
  }

  await browser.close()
  server.close()
  console.log(`[prerender] ${ROUTES.length} rotas geradas.`)
}

run().catch((err) => {
  console.error('[prerender] falhou:', err.message)
  process.exit(1)
})
