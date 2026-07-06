import { computed, ref } from 'vue'

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark' | 'auto'
          appearance?: 'always' | 'execute' | 'interaction-only'
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}

export type TurnstileStatus = 'idle' | 'loading' | 'ready' | 'verified' | 'expired' | 'error'

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string

export function useTurnstile() {
  const token = ref('')
  const widgetId = ref<string>()
  const status = ref<TurnstileStatus>('idle')

  const isValid = computed(() => token.value.length > 0)

  function render(container: HTMLElement) {
    if (!window.turnstile) {
      status.value = 'error'
      return
    }

    status.value = 'loading'

    widgetId.value = window.turnstile.render(container, {
      sitekey: siteKey,
      theme: 'auto',
      callback(receivedToken) {
        token.value = receivedToken
        status.value = 'verified'
      },
      'expired-callback'() {
        token.value = ''
        status.value = 'expired'

        if (widgetId.value) {
          window.turnstile?.reset(widgetId.value)
        }
      },
      'error-callback'() {
        token.value = ''
        status.value = 'error'
      },
    })

    status.value = 'ready'
  }

  function reset() {
    token.value = ''

    if (widgetId.value) {
      window.turnstile?.reset(widgetId.value)
    }

    status.value = 'ready'
  }

  function remove() {
    if (widgetId.value) {
      window.turnstile?.remove(widgetId.value)
    }

    token.value = ''
    widgetId.value = undefined
    status.value = 'idle'
  }

  return {
    token,
    status,
    isValid,
    render,
    reset,
    remove,
  }
}
