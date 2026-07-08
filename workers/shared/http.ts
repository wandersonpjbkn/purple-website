export const jsonResponse = (body: unknown, status: number, origin: string, methods: string): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': methods,
    },
  })

interface OriginEnv {
  ALLOWED_ORIGIN: string
  ALLOWED_ORIGIN_WWW: string
  ALLOWED_ORIGIN_LAN?: string
}

export const buildAllowedOrigins = (env: OriginEnv): string[] =>
  [env.ALLOWED_ORIGIN, env.ALLOWED_ORIGIN_WWW, 'http://localhost:5173', 'http://localhost:8787', env.ALLOWED_ORIGIN_LAN].filter(
    (origin): origin is string => Boolean(origin)
  )
