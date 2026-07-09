import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type ConsentChoice = 'unset' | 'accepted' | 'rejected'

export const useConsentStore = defineStore(
  'consent',
  () => {
    const analytics = ref<ConsentChoice>('unset')

    const decided = computed(() => analytics.value !== 'unset')
    const analyticsGranted = computed(() => analytics.value === 'accepted')

    const acceptAnalytics = () => (analytics.value = 'accepted')
    const rejectAnalytics = () => (analytics.value = 'rejected')
    const reopen = () => (analytics.value = 'unset')

    return {
      analytics,
      decided,
      analyticsGranted,
      acceptAnalytics,
      rejectAnalytics,
      reopen,
    }
  },
  {
    persist: true,
  }
)
