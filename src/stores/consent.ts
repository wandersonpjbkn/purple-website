import { defineStore } from 'pinia'

/**
 * Consentimento LGPD — autoral e local.
 *
 * Sem biblioteca de terceiros: o estado mora num store Pinia persistido em
 * localStorage (via pinia-plugin-persistedstate). Hoje há uma única categoria
 * opcional — `analytics` (gateia o GTM). A categoria "necessário" é implícita e
 * sempre ativa (não há cookies necessários hoje além do próprio consentimento).
 */
export type ConsentChoice = 'unset' | 'accepted' | 'rejected'

export const useConsentStore = defineStore('consent', {
  state: () => ({
    analytics: 'unset' as ConsentChoice,
  }),
  getters: {
    decided: (s): boolean => s.analytics !== 'unset',
    analyticsGranted: (s): boolean => s.analytics === 'accepted',
  },
  actions: {
    acceptAnalytics() {
      this.analytics = 'accepted'
    },
    rejectAnalytics() {
      this.analytics = 'rejected'
    },
    /** Reabre o banner (ex.: link "Preferências de cookies" no rodapé). */
    reopen() {
      this.analytics = 'unset'
    },
  },
  persist: true,
})
