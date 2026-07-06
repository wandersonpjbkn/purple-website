<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Pular para o conteúdo</a>
    <AppHeader />
    <main id="main-content">
      <RouterView />
    </main>
    <AppFooter />
    <CookieConsent />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useHead } from '@unhead/vue'

import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CookieConsent from '@/components/layout/CookieConsent.vue'

useHead({
  htmlAttrs: { lang: 'pt-BR' },
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>

<style scoped>
/* Skip-link: oculto até receber foco por teclado. */
.skip-link {
  position: fixed;
  top: 0.5rem;
  left: 0.5rem;
  z-index: 200;
  transform: translateY(-150%);
  background: var(--purple);
  color: #fff;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  transition: transform 0.15s var(--ease);
}
.skip-link:focus {
  transform: translateY(0);
  outline: 2px solid var(--lime);
  outline-offset: 2px;
}
</style>
