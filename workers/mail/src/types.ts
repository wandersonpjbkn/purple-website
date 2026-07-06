export interface Env {
  TURNSTILE_SECRET: string
  RESEND_API_KEY: string

  ALLOWED_ORIGIN: string
  ALLOWED_ORIGIN_WWW: string
}

export interface EmailData {
  name: string
  email: string
  service: string
  message: string
  url: string
  language: string
  sentAt: string
}

export interface ContactRequest {
  contact: EmailData
  interest: {
    service: string
    message: string
  }
  metadata: {
    url: string
    language: string
    sentAt: string
  }
  turnstileToken: string
}
