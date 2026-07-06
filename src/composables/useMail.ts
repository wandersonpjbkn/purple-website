import { ref } from 'vue'

export type ContactStatus = 'idle' | 'sending' | 'success' | 'error'

export interface ContactForm {
  name: string
  email: string
  service: string
  message: string
}

interface ContactPayload {
  contact: {
    name: string
    email: string
  }

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

interface ApiResponse {
  success: boolean
  message?: string
}

const API_URL = import.meta.env.VITE_CONTACT_API_URL as string

export function useMail() {
  const status = ref<ContactStatus>('idle')
  const errorMsg = ref('')

  async function send(form: ContactForm, turnstileToken: string): Promise<boolean> {
    status.value = 'sending'
    errorMsg.value = ''

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const payload: ContactPayload = {
        contact: {
          name: form.name.trim(),
          email: form.email.trim(),
        },
        interest: {
          service: form.service,
          message: form.message.trim(),
        },
        metadata: {
          url: window.location.href,
          language: navigator.language,
          sentAt: new Date().toISOString(),
        },
        turnstileToken,
      }

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })

      clearTimeout(timeout)

      const json = (await response.json()) as ApiResponse
      if (!response.ok || !json.success) {
        throw new Error(json.message ?? 'Erro ao enviar mensagem.')
      }

      status.value = 'success'
      return true
    } catch (err) {
      console.error(err)
      status.value = 'error'

      if (err instanceof DOMException && err.name === 'AbortError') {
        errorMsg.value = 'A solicitação demorou mais do que o esperado.'
      } else if (err instanceof Error) {
        errorMsg.value = err.message
      } else {
        errorMsg.value = 'Não foi possível enviar sua mensagem.'
      }

      return false
    }
  }

  function reset() {
    status.value = 'idle'
    errorMsg.value = ''
  }

  return {
    status,
    errorMsg,
    send,
    reset,
  }
}
