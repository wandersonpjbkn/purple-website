import { buildEmail } from './emailTemplate'
import { validateContactRequest } from './validate'

import { jsonResponse, buildAllowedOrigins } from '../../shared/http'

import type { ContactRequest, Env } from './types'

const json = (body: unknown, status = 200, origin = '*') => jsonResponse(body, status, origin, 'POST, OPTIONS')

export default {
  async fetch(request: Request, env: Env) {
    const origin = request.headers.get('Origin') ?? ''
    const allowedOrigins = buildAllowedOrigins(env)

    if (request.method === 'OPTIONS') {
      return json({}, 200, origin)
    }

    if (!allowedOrigins.includes(origin)) {
      return json({ success: false, message: 'Origin não permitida.' }, 403, origin)
    }

    if (request.method !== 'POST') {
      return json({ success: false, message: 'Método inválido.' }, 405, origin)
    }

    try {
      const body = (await request.json()) as ContactRequest

      if (!validateContactRequest(body)) {
        return json({ success: false, message: 'Campos obrigatórios ausentes.' }, 400, origin)
      }

      const verify = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: body.turnstileToken,
        }),
      })

      const captcha = (await verify.json()) as { success: boolean }
      if (!captcha.success) {
        return json({ success: false, message: 'Falha na validação de segurança.' }, 403, origin)
      }

      const resend = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Purple Comunicação <${env.EMAIL_FROM}>`,
          to: [env.EMAIL_TO],
          subject: `Novo contato | ${body.interest.service}`,
          html: buildEmail({
            name: body.contact.name,
            email: body.contact.email,
            service: body.interest.service,
            message: body.interest.message,
            url: body.metadata.url,
            language: body.metadata.language,
            sentAt: body.metadata.sentAt,
          }),
        }),
      })

      if (!resend.ok) {
        return json({ success: false, message: 'Erro ao enviar e-mail.' }, 500, origin)
      }

      return json({ success: true }, 200, origin)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return json({ success: false, message: 'Erro ao processar requisição.', error: message }, 500, origin)
    }
  },
}
