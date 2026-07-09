import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { test, expect } from '@playwright/test'

// Read as JSON via fs, not an ES import — Playwright's test runner executes
// specs through Node's native ESM loader, which requires import attributes
// for JSON that the app's Vite bundler doesn't need.
const pages: { routeName: string; label: string }[] = JSON.parse(
  readFileSync(fileURLToPath(new URL('../src/data/pages.json', import.meta.url)), 'utf-8')
)

// Minimal shape of the real `window.turnstile` (see src/composables/useTurnstile.ts) —
// declared locally because e2e/ isn't part of the app's TS program.
declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: { callback?: (token: string) => void }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

// The real mail Worker is production (VITE_CONTACT_API_URL points at
// mail.purplecomunicacao.com.br, see workers/mail/wrangler.toml) — a real
// POST here would send a real e-mail via Resend to the Purple inbox. Every
// test blocks it and mocks Turnstile so "envio simulado" never touches
// either.
const REAL_MAIL_HOST = /^https:\/\/mail\.purplecomunicacao\.com\.br/

test.beforeEach(async ({ page }) => {
  await page.route(/challenges\.cloudflare\.com/, (route) => route.abort())
  await page.addInitScript(() => {
    window.turnstile = {
      render: (_container, options) => {
        setTimeout(() => options.callback?.('e2e-fake-token'), 0)
        return 'e2e-widget'
      },
      reset: () => {},
      remove: () => {},
    }
  })
})

test.describe('Funcionalidade: Navegação principal', () => {
  for (const { label } of pages) {
    test(`Cenário: visitante abre "${label}" pelo menu`, async ({ page }) => {
      // Dado que o visitante está na Home
      await page.goto('/')
      await page.keyboard.press('Escape') // fecha o aviso de cookies

      // Quando ele clica no item do menu principal
      await page
        .locator('nav[aria-label="Navegação principal"]')
        .getByRole('link', { name: label, exact: true })
        .click()

      // Então a página correspondente carrega com um h1 visível e sem crash
      await expect(page.locator('h1').first()).toBeVisible()
    })
  }
})

test.describe('Funcionalidade: Formulário de contato', () => {
  test('Cenário: envio simulado com sucesso, sem tocar o Worker real', async ({ page }) => {
    // Dado que o POST para o Worker de mail está mocado (nunca sai para produção)
    await page.route(REAL_MAIL_HOST, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    )

    await page.goto('/contato')
    await page.keyboard.press('Escape')

    // Quando o visitante preenche o formulário válido e envia
    await page.locator('input[placeholder="Seu nome"]').fill('Visitante de teste')
    await page.locator('input[placeholder="voce@empresa.com"]').fill('visitante@example.com')
    await page.locator('input[placeholder="Selecione um interesse"]').click()
    await page.getByRole('option').first().click()
    await page.locator('textarea[placeholder*="desafio"]').fill('Mensagem de teste com mais de dez caracteres.')
    await page.getByRole('button', { name: /Enviar mensagem/i }).click()

    // Então a mensagem de sucesso aparece
    await expect(page.getByText('Mensagem enviada!')).toBeVisible()
  })

  test('Cenário: campos vazios bloqueiam o envio e focam o primeiro erro', async ({ page }) => {
    // Dado que o visitante está no formulário de contato
    await page.goto('/contato')
    await page.keyboard.press('Escape')

    // Quando ele envia sem preencher nada
    await page.getByRole('button', { name: /Enviar mensagem/i }).click()

    // Então o campo Nome recebe o foco (primeiro erro)
    await expect(page.locator('input[placeholder="Seu nome"]')).toBeFocused()
  })
})
