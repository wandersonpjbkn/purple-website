import type { ContactRequest } from './types'

export function validateContactRequest(body: ContactRequest): boolean {
  return Boolean(
    body.contact?.name && body.contact?.email && body.interest?.service && body.interest?.message && body.turnstileToken
  )
}
