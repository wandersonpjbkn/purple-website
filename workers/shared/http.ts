export const jsonResponse = (body: unknown, status: number, origin: string, methods: string, extraHeaders: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': methods,
      ...extraHeaders,
    },
  })

interface OriginEnv {
  ALLOWED_ORIGIN: string
  ALLOWED_ORIGIN_WWW: string
  ALLOWED_ORIGIN_LAN?: string
}

// 5173 = vite dev · 8787 = wrangler dev · 4173 = vite preview · 4180 = prerender
export const buildAllowedOrigins = (env: OriginEnv): string[] =>
  [
    env.ALLOWED_ORIGIN,
    env.ALLOWED_ORIGIN_WWW,
    'http://localhost:5173',
    'http://localhost:8787',
    'http://localhost:4173',
    'http://localhost:4180',
    env.ALLOWED_ORIGIN_LAN,
  ].filter((origin): origin is string => Boolean(origin))
