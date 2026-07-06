import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
  }
)
