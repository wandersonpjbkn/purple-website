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

import { ROUTES, AUTHOR_ROUTES, resolveChromium } from './shared.mjs'
import { createDistServer } from './dist-server.mjs'

const DIST = join(process.cwd(), 'dist')
// Fixed port: the blog Worker's CORS allowlist names it (workers/shared/http.ts).
const PORT = 4180

// Routes whose snapshot depends on the blog index (fetched at runtime).
const BLOG_ROUTES = ['/', '/blog', ...AUTHOR_ROUTES]

const SKIP_WITHOUT_POSTS = new Set(AUTHOR_ROUTES)

// Posts only: the empty/error states render as soon as the index settles, so
// accepting them here would cut a slow-but-successful fetch short.
const waitForPosts = async page =>
  page
    .waitForSelector('.post-card', { timeout: 8000 })
    .then(() => true)
    .catch(() => false)

const waitForPostsWithRetry = async page => {
  if (await waitForPosts(page)) return true
  await page.reload({ waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#app > *', { timeout: 15000 })
  return waitForPosts(page)
}

const run = async () => {
  const executablePath = await resolveChromium()
  const server = await createDistServer({ dist: DIST, port: PORT })
  const browser = await chromium.launch({ executablePath })
  const page = await browser.newPage()
  const routesWithoutPosts = []
  const routes = [...ROUTES, ...AUTHOR_ROUTES]

  for (const route of routes) {
    // Don't wait for `networkidle`: external CDNs (fonts, GTM) can hang. The
    // real signal is the app having rendered inside #app.
    await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('#app > *', { timeout: 15000 })

    if (BLOG_ROUTES.includes(route) && !(await waitForPostsWithRetry(page))) {
      console.warn(`[prerender] AVISO: ${route} saiu sem posts — o índice do blog não respondeu.`)
      routesWithoutPosts.push(route)
      if (SKIP_WITHOUT_POSTS.has(route)) continue
    }

    await page.waitForTimeout(300)

    await page.evaluate(() => {
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
  const skipped = routesWithoutPosts.filter(route => SKIP_WITHOUT_POSTS.has(route))
  console.log(`[prerender] ${routes.length - skipped.length} de ${routes.length} rotas geradas.`)

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
