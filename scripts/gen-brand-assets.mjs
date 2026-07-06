// Gera os assets raster da marca (favicon.png, apple-touch-icon.png,
// og-default.jpg) a partir do desenho da marca, usando o Chromium já instalado.
// Rodar pontualmente: `node scripts/gen-brand-assets.mjs`. Não faz parte do build.
import { chromium } from 'playwright-core'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = resolve(__dirname, '../public')
const EXECUTABLE = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

const mark = (size) => `
  <div style="width:${size}px;height:${size}px;display:grid;place-items:center;
    background:#8b2fcc;border-radius:${Math.round(size * 0.22)}px;position:relative;">
    <span style="font:800 ${Math.round(size * 0.58)}px/1 'Plus Jakarta Sans',system-ui,sans-serif;color:#fff;">p</span>
    <span style="position:absolute;right:${size * 0.2}px;bottom:${size * 0.28}px;
      width:${size * 0.15}px;height:${size * 0.15}px;border-radius:50%;background:#c5e22e;"></span>
  </div>`

const page = (inner, w, h, bg = 'transparent') => `<!doctype html><html><head><meta charset="utf-8">
  <style>@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;800&display=swap');
  *{margin:0;box-sizing:border-box}body{width:${w}px;height:${h}px;display:grid;place-items:center;background:${bg}}</style>
  </head><body>${inner}</body></html>`

const og = `
  <div style="width:1200px;height:630px;display:flex;flex-direction:column;justify-content:center;gap:28px;
    padding:0 96px;background:linear-gradient(135deg,#241047,#1a0533);color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif;">
    <div style="display:flex;align-items:center;gap:20px;">
      ${mark(72)}
      <span style="font-weight:800;font-size:34px;">ppl<span style="color:#c5e22e;">.</span> <span style="font-weight:500;font-size:22px;opacity:.7;">comunicação</span></span>
    </div>
    <h1 style="font-weight:800;font-size:60px;line-height:1.1;max-width:900px;letter-spacing:-1.5px;">
      A comunicação da sua empresa, <span style="color:#c5e22e;">de dentro para fora</span></h1>
    <p style="font-size:26px;opacity:.8;max-width:820px;">Employer Branding, Endomarketing e Comunicação Interna com foco em pessoas.</p>
  </div>`

const shots = [
  { html: page(mark(512), 512, 512), file: 'favicon.png', w: 512, h: 512, type: 'png' },
  { html: page(mark(180), 180, 180), file: 'apple-touch-icon.png', w: 180, h: 180, type: 'png' },
  { html: page(og, 1200, 630), file: 'og-default.jpg', w: 1200, h: 630, type: 'jpeg' },
]

const browser = await chromium.launch({ executablePath: EXECUTABLE })
for (const s of shots) {
  const p = await browser.newPage({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: 1 })
  await p.setContent(s.html, { waitUntil: 'networkidle' })
  await p.waitForTimeout(300)
  const el = await p.$('body > *')
  await el.screenshot({
    path: resolve(pub, s.file),
    type: s.type,
    ...(s.type === 'jpeg' ? { quality: 88 } : { omitBackground: true }),
  })
  await p.close()
  console.log('wrote', s.file)
}
await browser.close()
