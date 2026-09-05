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
import { writeFile, mkdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'

import { chromium } from 'playwright-core'

import { ROUTES, resolveChromium } from './shared.mjs'
import { createDistServer } from './dist-server.mjs'

const DIST = join(process.cwd(), 'dist')
// Fixed port: the blog Worker's CORS allowlist names it (workers/shared/http.ts).
const PORT = 4180

// Routes whose snapshot depends on the blog index (fetched at runtime).
const BLOG_ROUTES = ['/', '/blog']

// Posts only: the empty/error states render as soon as the index settles, so
// accepting them here would cut a slow-but-successful fetch short.
const waitForPosts = async page =>
  page
    .waitForSelector('.post-card', { timeout: 8000 })
    .then(() => true)
    .catch(() => false)

const run = async () => {
  const executablePath = await resolveChromium()
  const server = await createDistServer({ dist: DIST, port: PORT })
  const browser = await chromium.launch({ executablePath })
  const page = await browser.newPage()
  const routesWithoutPosts = []

  for (const route of ROUTES) {
    // Don't wait for `networkidle`: external CDNs (fonts, GTM) can hang. The
    // real signal is the app having rendered inside #app.
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('#app > *', { timeout: 15000 })

    if (BLOG_ROUTES.includes(route)) {
      let loaded = await waitForPosts(page)

      // One retry: the index comes from the network at runtime, so a single
      // hiccup during the build would otherwise freeze an error state into the
      // snapshot every crawler reads.
      if (!loaded) {
        await page.reload({ waitUntil: 'domcontentloaded' })
        await page.waitForSelector('#app > *', { timeout: 15000 })
        loaded = await waitForPosts(page)
      }

      if (!loaded) {
        console.warn(`[prerender] AVISO: ${route} saiu sem posts — o índice do blog não respondeu.`)
        routesWithoutPosts.push(route)
      }
    }

    await page.waitForTimeout(300)

    await page.evaluate(() => {
      // CookieConsent locks body scroll (`overflow: hidden`) while consent is
      // unset, which is always true in this fresh headless context — strip it
      // so the frozen snapshot doesn't ship real visitors an unscrollable page.
      document.body.style.overflow = ''

      // The blog failure notice is transient runtime state, not page content:
      // the visitor's browser refetches and renders posts (or its own error).
      // Freezing it here would publish a false claim to every crawler.
      document.querySelectorAll('.home-blog-empty, .blog-empty').forEach(node => node.remove())
    })

    const html = '<!DOCTYPE html>\n' + (await page.content()).replace(/^<!DOCTYPE html>/i, '').trimStart()
    const outFile = route === '/' ? join(DIST, 'index.html') : join(DIST, route, 'index.html')
    await mkdir(dirname(outFile), { recursive: true })
    await writeFile(outFile, html, 'utf-8')
    console.log(`[prerender] ${route} → ${outFile.replace(DIST + '/', 'dist/')}`)
  }

  await browser.close()
  server.close()
  console.log(`[prerender] ${ROUTES.length} rotas geradas.`)

  // The per-route warning scrolls away in a build log, and a snapshot
  // published without posts must not read as a clean run.
  if (routesWithoutPosts.length) {
    console.warn(
      `[prerender] AVISO: ${routesWithoutPosts.join(', ')} sem posts no snapshot — crawler lê o blog vazio até o próximo deploy.`
    )
  }
}

run().catch(err => {
  console.error('[prerender] falhou:', err.message)
  process.exit(1)
})
