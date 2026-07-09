/**
 * Auditoria de proporção de cor (relatório, não é teste — não roda em
 * `yarn test`/CI, não faz assertions).
 *
 * Confere na prática a regra 60/30/10 (neutro/roxo/lima) descrita em
 * DESIGN_SYSTEM.md: navega cada rota, tira um screenshot full-page e
 * classifica cada pixel por matiz (neutro/roxo/lima/outro). O PNG é
 * decodificado dentro do próprio browser (Image + canvas), não no Node —
 * evita adicionar libs de imagem (sharp/pngjs) só pra isso.
 *
 * Pré-requisito: `yarn dev` rodando em outro terminal (http://localhost:5173,
 * ajustável via COLOR_AUDIT_BASE_URL). Para incluir os cards reais do blog na
 * contagem, suba também `yarn --cwd workers/blog dev --remote` — sem isso,
 * /blog e o teaser da Home caem no estado vazio (aviso no console, não
 * falha). Precisa também de acesso real à CDN (VITE_CDN_URL) pras fotos de
 * time/posts — sem rede, o fallback de gradiente entra no lugar e distorce
 * a contagem.
 */
import { chromium } from 'playwright-core'

import { ROUTES, resolveChromium } from './shared.mjs'

const BASE_URL = process.env.COLOR_AUDIT_BASE_URL || 'http://localhost:5173'
const SAMPLE_WIDTH = 200 // downscale width (px) antes do getImageData; preserva proporção

// Classifica um screenshot (data URL de PNG) por matiz, dentro do browser.
// Devolve a contagem de pixels por bucket: neutral/purple/lime/other.
const classifyScreenshot = (page, dataUrl, sampleWidth) =>
  page.evaluate(
    async ({ dataUrl, sampleWidth }) => {
      const img = new Image()
      img.src = dataUrl
      await img.decode()

      const scale = sampleWidth / img.naturalWidth
      const w = sampleWidth
      const h = Math.max(1, Math.round(img.naturalHeight * scale))

      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high' // amostragem por área, não vizinho mais próximo
      ctx.drawImage(img, 0, 0, w, h)

      const { data } = ctx.getImageData(0, 0, w, h)
      const counts = { neutral: 0, purple: 0, lime: 0, other: 0 }

      const rgbToHsl = (r, g, b) => {
        r /= 255
        g /= 255
        b /= 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const l = (max + min) / 2
        if (max === min) return [0, 0, l * 100]
        const d = max - min
        const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        let hue
        if (max === r) hue = (g - b) / d + (g < b ? 6 : 0)
        else if (max === g) hue = (b - r) / d + 2
        else hue = (r - g) / d + 4
        return [hue * 60, s * 100, l * 100]
      }

      // Screenshots do Playwright são opacos por padrão (sem omitBackground) —
      // alpha é sempre 255 na prática, não vale checar por pixel.
      for (let i = 0; i < data.length; i += 4) {
        const [hue, sat, light] = rgbToHsl(data[i], data[i + 1], data[i + 2])
        let bucket
        // Tons quase pretos (--ink) leem como neutro; o roxo de marca usado
        // como tinta de texto (--text, L~11%) fica de fora de propósito e
        // cai no bucket "purple" mais abaixo — condiz com o papel dele no
        // 60/30/10 (texto conta como parte dos 30% secundários).
        if (light > 94 || light < 10) bucket = 'neutral'
        else if (sat < 12) bucket = 'neutral'
        else if (hue >= 250 && hue <= 330) bucket = 'purple'
        else if (hue >= 55 && hue <= 100) bucket = 'lime'
        else bucket = 'other'
        counts[bucket] += 1
      }
      return counts
    },
    { dataUrl, sampleWidth }
  )

const toPercentages = (counts) => {
  const total = counts.neutral + counts.purple + counts.lime + counts.other
  const pct = (n) => `${((n / total) * 100).toFixed(1)}%`
  return { neutral: pct(counts.neutral), purple: pct(counts.purple), lime: pct(counts.lime), other: pct(counts.other) }
}

const auditRoute = async (page, route) => {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#app > *', { timeout: 15000 })

  if (route === '/' || route === '/blog') {
    await page.waitForSelector('.post-card, .blog-empty, .home-blog-empty', { timeout: 8000 }).catch(() => {})
    const isEmpty = await page.evaluate(() => !!document.querySelector('.blog-empty, .home-blog-empty'))
    if (isEmpty) {
      console.warn(
        `[color-audit] ${route}: blog em estado vazio — suba "yarn --cwd workers/blog dev --remote" pra contar os cards reais`
      )
    }
  }

  await page.waitForTimeout(300)

  const buffer = await page.screenshot({ fullPage: true })
  const dataUrl = `data:image/png;base64,${buffer.toString('base64')}`
  return classifyScreenshot(page, dataUrl, SAMPLE_WIDTH)
}

const run = async () => {
  const executablePath = await resolveChromium()
  const browser = await chromium.launch({ executablePath })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })

  // Congela animações (pulse/blink/float do hero, cursor do typewriter) pra
  // um estado de repouso determinístico — o app já respeita
  // prefers-reduced-motion.
  await page.emulateMedia({ reducedMotion: 'reduce' })

  // Primeira navegação: descarta o aviso de cookies. O backdrop
  // (CookieConsent.vue) cobre 100% da viewport com roxo a 35% de opacidade
  // até ser decidido — sem isso, cada pixel do site sairia contaminado de
  // roxo na auditoria. Persiste via pinia-plugin-persistedstate, então não
  // reaparece nas rotas seguintes.
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('#app > *', { timeout: 15000 })
  await page.keyboard.press('Escape').catch(() => {})

  const aggregate = { neutral: 0, purple: 0, lime: 0, other: 0 }
  const rows = []

  for (const route of ROUTES) {
    const counts = await auditRoute(page, route)
    for (const k in aggregate) aggregate[k] += counts[k]
    rows.push({ route, ...toPercentages(counts) })
    console.log(`[color-audit] ${route} ok`)
  }

  await browser.close()

  rows.push({ route: 'TOTAL (todas as rotas)', ...toPercentages(aggregate) })
  console.table(rows)
}

run().catch((err) => {
  console.error('[color-audit] falhou:', err.message)
  process.exit(1)
})
