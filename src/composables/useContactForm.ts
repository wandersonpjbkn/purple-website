import { reactive } from 'vue'

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

const emptyForm = (): ContactFormData => ({ name: '', email: '', subject: '', message: '' })

export const useContactForm = () => {
  const form = reactive<ContactFormData>(emptyForm())
  const errors = reactive<ContactFormData>(emptyForm())

  const validate = (): boolean => {
    errors.name = form.name.trim() ? '' : 'Informe seu nome.'
    errors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? '' : 'Informe um e-mail válido.'
    errors.subject = form.subject ? '' : 'Selecione um interesse.'
    errors.message = form.message.trim().length >= 10 ? '' : 'A mensagem precisa ter pelo menos 10 caracteres.'

    return !errors.name && !errors.email && !errors.subject && !errors.message
  }

  const clearForm = () => {
    Object.assign(form, emptyForm())
    Object.assign(errors, emptyForm())
  }

  return { form, errors, validate, clearForm }
}
