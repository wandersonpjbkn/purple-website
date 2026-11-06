export interface MonitoringEnv {
  SENTRY_DSN?: string
}

type CaptureMessage = (message: string, context: { level: 'error'; extra: { details: unknown[] } }) => unknown

export const monitoringOptions = (env: MonitoringEnv, service: string) => ({
  dsn: env.SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 0,
  initialScope: { tags: { service } },
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: false,
    httpBodies: [],
    urlQueryParams: false,
    stackFrameVariables: false,
  },
})

export const createFailureReporter =
  (captureMessage: CaptureMessage) =>
  (event: string, ...details: unknown[]): void => {
    console.error(event, ...details)
    captureMessage(event, { level: 'error', extra: { details } })
  }
