// src/composables/useEmailJS.ts
// Envio de formulário via EmailJS sem backend.
//
// Setup (5 min):
//   1. Crie conta em https://emailjs.com
//   2. "Add Service" → Gmail → conecte purplecomunica@gmail.com
//   3. "Create Template" — use as variáveis: {{from_name}}, {{from_email}},
//      {{subject}}, {{message}}
//   4. Copie Service ID, Template ID e Public Key
//   5. Coloque no .env:
//        VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
//        VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
//        VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxxxxxxxxx

import { ref } from 'vue'

export type FormStatus = 'idle' | 'sending' | 'success' | 'error'

export interface ContactForm {
  name:    string
  email:   string
  subject: string
  message: string
}

// EmailJS é carregado via CDN no index.html (sem npm install necessário)
// Adicione ao <head> do index.html:
//   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
//   <script>emailjs.init({ publicKey: "SUA_PUBLIC_KEY" })</script>
//
// OU instale via npm: npm install @emailjs/browser
// e importe: import emailjs from '@emailjs/browser'

declare global {
  interface Window {
    emailjs?: {
      send: (
        serviceId: string,
        templateId: string,
        params: Record<string, string>,
      ) => Promise<{ status: number; text: string }>
    }
  }
}

export function useEmailJS() {
  const status  = ref<FormStatus>('idle')
  const errorMsg = ref('')

  async function send(form: ContactForm): Promise<boolean> {
    const serviceId  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string

    if (!serviceId || !templateId) {
      console.warn('[EmailJS] Variáveis de ambiente não configuradas.')
      // Em dev sem config, simula sucesso após 1s para testar o UI
      status.value = 'sending'
      await new Promise(r => setTimeout(r, 1000))
      status.value = 'success'
      return true
    }

    if (!window.emailjs) {
      status.value = 'error'
      errorMsg.value = 'Serviço de e-mail não carregado. Tente novamente.'
      return false
    }

    status.value = 'sending'
    errorMsg.value = ''

    try {
      await window.emailjs.send(serviceId, templateId, {
        from_name:  form.name,
        from_email: form.email,
        subject:    form.subject,
        message:    form.message,
        reply_to:   form.email,
      })
      status.value = 'success'
      return true
    } catch (err) {
      status.value = 'error'
      errorMsg.value = 'Não foi possível enviar a mensagem. Tente novamente ou entre em contato pelo WhatsApp.'
      console.error('[EmailJS]', err)
      return false
    }
  }

  function reset() {
    status.value   = 'idle'
    errorMsg.value = ''
  }

  return { status, errorMsg, send, reset }
}
