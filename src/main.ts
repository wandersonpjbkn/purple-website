import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import persisteStorage from 'pinia-plugin-persistedstate'
import { createGtm } from '@gtm-support/vue-gtm'

import router from '@/router'
import { useConsentStore } from '@/stores/consent'

import App from '@/App.vue'

import '@/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

pinia.use(persisteStorage)

app.use(pinia)
app.use(head)
app.use(router)

// ── GTM condicionado ao consentimento (LGPD) ──────────────
const gtmId = import.meta.env.VITE_GTM_ID
if (gtmId) {
  const consent = useConsentStore(pinia)
  app.use(
    createGtm({
      id: gtmId,
      enabled: consent.analyticsGranted,
      loadScript: true,
      vueRouter: router,
      defer: true,
    })
  )
}

app.mount('#app')
