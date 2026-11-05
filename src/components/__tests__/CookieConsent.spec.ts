import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

import CookieConsent from '@/components/layout/CookieConsent.vue'
import { useConsentStore } from '@/stores/consent'

const routerStub = { RouterLink: { template: '<a><slot /></a>' } }
const BANNER = '[aria-label="Aviso de cookies"]'

let wrapper: VueWrapper | undefined

function mountBanner() {
  const pinia = createPinia()
  setActivePinia(pinia)
  wrapper = mount(CookieConsent, { global: { plugins: [pinia], stubs: routerStub }, attachTo: document.body })
  return wrapper
}

describe('CookieConsent (banner LGPD)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    wrapper?.unmount()
    wrapper = undefined
  })

  it('aparece enquanto a escolha está indecisa', () => {
    const banner = mountBanner()
    expect(banner.find(BANNER).exists()).toBe(true)
  })

  it('não bloqueia a página: sem overlay, sem trava de rolagem e sem modal', () => {
    const banner = mountBanner()
    const region = banner.find(BANNER)

    expect(region.element.tagName).toBe('SECTION')
    expect(region.attributes('role')).toBeUndefined()
    expect(region.attributes('aria-modal')).toBeUndefined()
    expect(document.querySelector('.cookie-consent-backdrop')).toBeNull()
    expect(document.body.style.overflow).toBe('')
  })

  it('não rouba o foco ao aparecer', async () => {
    mountBanner()
    await new Promise(resolve => setTimeout(resolve))
    expect(document.activeElement).toBe(document.body)
  })

  it('Esc dentro do banner equivale a "Recusar"', async () => {
    const banner = mountBanner()
    const store = useConsentStore()

    await banner.find(BANNER).trigger('keydown', { key: 'Escape' })

    expect(store.decided).toBe(true)
    expect(store.analyticsGranted).toBe(false)
  })

  it('"Aceitar" concede análise e fecha o banner', async () => {
    const banner = mountBanner()
    const store = useConsentStore()

    const accept = banner.findAll('button').find(b => b.text().includes('Aceitar'))
    await accept!.trigger('click')

    expect(store.analyticsGranted).toBe(true)
    expect(banner.find(BANNER).exists()).toBe(false)
  })

  it('"Recusar" decide sem conceder e fecha o banner', async () => {
    const banner = mountBanner()
    const store = useConsentStore()

    const reject = banner.findAll('button').find(b => b.text().includes('Recusar'))
    await reject!.trigger('click')

    expect(store.decided).toBe(true)
    expect(store.analyticsGranted).toBe(false)
    expect(banner.find(BANNER).exists()).toBe(false)
  })

  it('não aparece quando a escolha já foi feita', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    useConsentStore().rejectAnalytics()

    wrapper = mount(CookieConsent, { global: { plugins: [pinia], stubs: routerStub } })
    expect(wrapper.find(BANNER).exists()).toBe(false)
  })
})
