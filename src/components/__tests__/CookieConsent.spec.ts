import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'

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

describe('CookieConsent — espaço reservado para o foco', () => {
  let resizeCallback: ((entries: unknown[]) => void) | undefined

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: (entries: unknown[]) => void) {
          resizeCallback = callback
        }
        observe() {}
        unobserve() {}
        disconnect() {}
      }
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.documentElement.style.removeProperty('--consent-banner-height')
  })

  it('publica a altura do aviso para a página reservar espaço no rodapé', async () => {
    const banner = mountBanner()
    await nextTick()
    resizeCallback?.([
      { target: banner.find(BANNER).element, contentRect: { height: 0 }, borderBoxSize: [{ blockSize: 120 }] },
    ])

    expect(document.documentElement.style.getPropertyValue('--consent-banner-height')).toBe('120px')
  })

  it('libera o espaço quando a escolha é feita', async () => {
    const banner = mountBanner()
    await nextTick()
    resizeCallback?.([
      { target: banner.find(BANNER).element, contentRect: { height: 0 }, borderBoxSize: [{ blockSize: 120 }] },
    ])

    await banner
      .findAll('button')
      .find(b => b.text().includes('Recusar'))!
      .trigger('click')

    expect(document.documentElement.style.getPropertyValue('--consent-banner-height')).toBe('')
  })
})

describe('CookieConsent — foco não fica atrás do aviso', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.querySelectorAll('[data-test="outside"]').forEach(node => node.remove())
  })

  const rect = (top: number, bottom: number) => ({
    top,
    bottom,
    left: 0,
    right: 100,
    width: 100,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => ({}),
  })

  it('rola a página quando o elemento focado está coberto pelo aviso', async () => {
    const banner = mountBanner()
    await nextTick()
    vi.spyOn(banner.find(BANNER).element, 'getBoundingClientRect').mockReturnValue(rect(600, 800))
    const outside = document.createElement('button')
    outside.dataset.test = 'outside'
    document.body.append(outside)
    vi.spyOn(outside, 'getBoundingClientRect').mockReturnValue(rect(650, 690))
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})

    outside.focus()

    expect(scrollBy).toHaveBeenCalledWith({ top: 106, behavior: 'instant' })
  })

  it('não rola quando o elemento focado está visível acima do aviso', async () => {
    const banner = mountBanner()
    await nextTick()
    vi.spyOn(banner.find(BANNER).element, 'getBoundingClientRect').mockReturnValue(rect(600, 800))
    const outside = document.createElement('button')
    outside.dataset.test = 'outside'
    document.body.append(outside)
    vi.spyOn(outside, 'getBoundingClientRect').mockReturnValue(rect(100, 140))
    const scrollBy = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})

    outside.focus()

    expect(scrollBy).not.toHaveBeenCalled()
  })
})
