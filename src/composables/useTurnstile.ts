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

// The Turnstile script loads via CDN with `async defer` (see index.html);
// on a slow connection it may not be ready yet when the widget mounts.
const SCRIPT_POLL_INTERVAL_MS = 150
const SCRIPT_MAX_WAIT_MS = 8000

export function useTurnstile() {
  const token = ref('')
  const widgetId = ref<string>()
  const status = ref<TurnstileStatus>('idle')

  const isValid = computed(() => token.value.length > 0)

  function renderWidget(container: HTMLElement) {
    if (!window.turnstile) return

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

  function render(container: HTMLElement) {
    status.value = 'loading'

    if (window.turnstile) {
      renderWidget(container)
      return
    }

    let waited = 0
    const poll = setInterval(() => {
      waited += SCRIPT_POLL_INTERVAL_MS

      if (window.turnstile) {
        clearInterval(poll)
        renderWidget(container)
        return
      }

      if (waited >= SCRIPT_MAX_WAIT_MS) {
        clearInterval(poll)
        status.value = 'error'
      }
    }, SCRIPT_POLL_INTERVAL_MS)
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
