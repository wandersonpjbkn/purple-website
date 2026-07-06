<template>
  <Transition name="consent">
    <section
      v-if="!consent.decided"
      class="cookie-consent"
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de cookies"
    >
      <div class="cookie-consent__inner">
        <p class="cookie-consent__text">
          Usamos cookies de <strong>análise</strong> (Google Tag Manager) para entender como o site é usado e
          melhorá-lo. Os cookies essenciais ao funcionamento são sempre ativos. Você decide sobre os de análise.
          <RouterLink to="/privacidade" class="cookie-consent__link">Saiba mais</RouterLink>.
        </p>
        <div class="cookie-consent__actions">
          <BaseButton variant="secondary" @click="reject">Recusar análise</BaseButton>
          <BaseButton @click="accept">Aceitar</BaseButton>
        </div>
      </div>
    </section>
  </Transition>
</template>

<script setup lang="ts">
import { useGtm } from '@gtm-support/vue-gtm'
import { RouterLink } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()

const accept = () => {
  consent.acceptAnalytics()
  // Carrega/ativa o GTM apenas após o opt-in (loadScript: true cuida do <script>).
  useGtm()?.enable(true)
}

const reject = () => {
  consent.rejectAnalytics()
  useGtm()?.enable(false)
}
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.cookie-consent {
  position: fixed;
  left: var(--space-4);
  right: var(--space-4);
  bottom: var(--space-4);
  z-index: 100;
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

// Animação de entrada/saída
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
</style>
