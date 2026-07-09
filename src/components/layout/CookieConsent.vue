<template>
  <Transition name="consent-backdrop">
    <div
      v-if="!consent.decided"
      class="cookie-consent-backdrop"
      aria-hidden="true"
    />
  </Transition>
  <Transition name="consent">
    <section
      v-if="!consent.decided"
      ref="bannerRef"
      class="cookie-consent"
      role="dialog"
      aria-modal="true"
      aria-label="Aviso de cookies"
      tabindex="-1"
      @keydown="handleKeydown"
    >
      <div class="cookie-consent__inner">
        <p class="cookie-consent__text">
          Usamos <strong>cookies de análise</strong> (Google Tag Manager) para entender como o site é usado e
          melhorá-lo. Os cookies essenciais ao funcionamento são sempre ativos. Você decide sobre os de análise.
          <RouterLink
            to="/privacidade"
            class="cookie-consent__link"
            >Saiba mais</RouterLink
          >.
        </p>
        <!-- Anchoring bias: "Aceitar" renders as the primary/brand button (the
             suggested default), "Recusar" stays `secondary` — same size, always
             fully clickable, never hidden or shrunk. Do not remove this comment
             (see CONVENTIONS.md § Vieses cognitivos). -->
        <div class="cookie-consent__actions">
          <BaseButton
            variant="secondary"
            @click="reject"
            >Recusar análise</BaseButton
          >
          <BaseButton @click="accept">Aceitar</BaseButton>
        </div>
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { useGtm } from '@gtm-support/vue-gtm'
import { RouterLink } from 'vue-router'
import { ref, onUnmounted, watch, nextTick } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()

const bannerRef = ref<HTMLElement | null>(null)
const focusBanner = () => nextTick(() => bannerRef.value?.focus())

const accept = () => {
  consent.acceptAnalytics()
  useGtm()?.enable(true)
}

const reject = () => {
  consent.rejectAnalytics()
  useGtm()?.enable(false)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    reject()
    return
  }

  if (event.key !== 'Tab' || !bannerRef.value) return

  const focusable = bannerRef.value.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
  if (focusable.length === 0) return

  const first = focusable[0]!
  const last = focusable[focusable.length - 1]!

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

watch(
  () => consent.decided,
  decided => {
    document.body.style.overflow = decided ? '' : 'hidden'
    if (!decided) focusBanner()
  },
  { immediate: true }
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.cookie-consent-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99;
  background: rgba(var(--purple-rgb), 0.35);
}

.cookie-consent {
  position: fixed;
  left: var(--space-4);
  right: var(--space-4);
  bottom: var(--space-4);
  z-index: 100;
  margin: 0 auto;
  width: fit-content;
}

.cookie-consent__inner {
  max-width: var(--container);
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: var(--space-5) var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-6);

  @include respond-to(md) {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-4);
  }
}

.cookie-consent__text {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.6;
  margin: 0;

  strong {
    color: var(--text);
  }
}

.cookie-consent__link {
  color: var(--purple);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cookie-consent__actions {
  display: flex;
  gap: var(--space-3);
  flex-shrink: 0;

  @include respond-to(sm) {
    flex-direction: column;
  }
}

.consent-enter-active,
.consent-leave-active {
  transition:
    opacity 0.25s var(--ease),
    transform 0.25s var(--ease);
}
.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.consent-backdrop-enter-active,
.consent-backdrop-leave-active {
  transition: opacity 0.25s var(--ease);
}
.consent-backdrop-enter-from,
.consent-backdrop-leave-to {
  opacity: 0;
}
</style>
