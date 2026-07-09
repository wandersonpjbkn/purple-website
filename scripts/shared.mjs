/**
 * Utilitários compartilhados entre os scripts de `scripts/` (prerender,
 * color-audit) que abrem o site num Chromium headless via `playwright-core`.
 */
import { readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { chromium } from 'playwright-core'

// Rotas estáticas do site (as dinâmicas do blog ficam client-rendered).
export const ROUTES = ['/', '/sobre', '/abordagem', '/servicos', '/contato', '/blog', '/faq', '/privacidade']

export const resolveChromium = async () => {
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
