import { computed, unref, type Ref } from 'vue'

import { useContact } from './useContact'

export const useWhatsappUrl = (message: string | Ref<string>) => {
  const { phone } = useContact()

  return computed(() => `https://wa.me/${phone}?text=${encodeURIComponent(unref(message))}`)
}
