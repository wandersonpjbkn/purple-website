import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import CookieConsent from '@/components/layout/CookieConsent.vue'
import { useConsentStore } from '@/stores/consent'

function mountBanner() {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(CookieConsent, { global: { plugins: [pinia] } })
}

describe('CookieConsent (banner LGPD)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('aparece enquanto a escolha está indecisa', () => {
    const wrapper = mountBanner()
    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)
  })

  it('"Aceitar" concede análise e fecha o banner', async () => {
    const wrapper = mountBanner()
    const store = useConsentStore()

    const accept = wrapper.findAll('button').find((b) => b.text().includes('Aceitar'))
    await accept!.trigger('click')

    expect(store.analyticsGranted).toBe(true)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('"Recusar" decide sem conceder e fecha o banner', async () => {
    const wrapper = mountBanner()
    const store = useConsentStore()

    const reject = wrapper.findAll('button').find((b) => b.text().includes('Recusar'))
    await reject!.trigger('click')

    expect(store.decided).toBe(true)
    expect(store.analyticsGranted).toBe(false)
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('não aparece quando a escolha já foi feita', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    useConsentStore().rejectAnalytics()

    const wrapper = mount(CookieConsent, { global: { plugins: [pinia] } })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })
})
