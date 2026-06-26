import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useConsentStore } from '@/stores/consent'

describe('consent store (LGPD)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('começa indeciso: nada consentido, banner aparece', () => {
    const consent = useConsentStore()
    expect(consent.analytics).toBe('unset')
    expect(consent.decided).toBe(false)
    expect(consent.analyticsGranted).toBe(false)
  })

  it('aceitar análise concede o consentimento e decide', () => {
    const consent = useConsentStore()
    consent.acceptAnalytics()
    expect(consent.analytics).toBe('accepted')
    expect(consent.decided).toBe(true)
    expect(consent.analyticsGranted).toBe(true)
  })

  it('recusar decide sem conceder', () => {
    const consent = useConsentStore()
    consent.rejectAnalytics()
    expect(consent.decided).toBe(true)
    expect(consent.analyticsGranted).toBe(false)
  })

  it('reopen volta a indeciso (reabre o banner)', () => {
    const consent = useConsentStore()
    consent.acceptAnalytics()
    consent.reopen()
    expect(consent.analytics).toBe('unset')
    expect(consent.decided).toBe(false)
  })
})
