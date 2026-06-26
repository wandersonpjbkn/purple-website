import { ref, computed } from 'vue'
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

export const useConsentStore = defineStore(
  'consent',
  () => {
    // state
    const analytics = ref<ConsentChoice>('unset')

    // getters
    const decided = computed(() => analytics.value !== 'unset')
    const analyticsGranted = computed(() => analytics.value === 'accepted')

    // actions
    const acceptAnalytics = () => (analytics.value = 'accepted')
    const rejectAnalytics = () => (analytics.value = 'rejected')
    const reopen = () => (analytics.value = 'unset')

    return {
      // state
      analytics,

      // getters
      decided,
      analyticsGranted,

      // actions
      acceptAnalytics,
      rejectAnalytics,
      reopen,
    }
  },
  {
    persist: true,
  },
)
