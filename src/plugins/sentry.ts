import type { App } from 'vue'

interface SentryEnv {
  dsn?: string
  siteUrl?: string
  dev: boolean
}

export const sentryOptions = ({ dsn, siteUrl, dev }: SentryEnv, hostname: string) => {
  if (!dsn || !siteUrl || dev) return null

  const site = new URL(siteUrl)
  if (site.hostname !== hostname) return null

  return {
    dsn,
    environment: 'production',
    tracesSampleRate: 0,
    initialScope: { tags: { service: 'frontend' } },
    allowUrls: [site.origin],
    attachProps: false,
    integrations: <T extends { name: string }>(defaults: T[]) =>
      defaults.filter(({ name }) => name !== 'BrowserSession'),
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      stackFrameVariables: false,
    },
  }
}

export const setupSentry = async (app: App) => {
  const options = sentryOptions(
    {
      dsn: import.meta.env.VITE_SENTRY_DSN,
      siteUrl: import.meta.env.VITE_SITE_URL,
      dev: import.meta.env.DEV,
    },
    window.location.hostname
  )
  if (!options) return

  const { init } = await import('@sentry/vue')
  init({ app, ...options })
}
