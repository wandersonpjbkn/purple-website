import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useGtm } from '@gtm-support/vue-gtm'

import { useCtaTracking } from '@/composables/useCtaTracking'

const trackEvent = vi.fn()

vi.mock('@gtm-support/vue-gtm', () => ({
  useGtm: vi.fn(),
}))

describe('useCtaTracking', () => {
  beforeEach(() => {
    trackEvent.mockClear()
    vi.mocked(useGtm).mockReturnValue({ trackEvent } as unknown as ReturnType<typeof useGtm>)
  })

  it('dispara whatsapp_click com categoria/ação/label corretos', () => {
    const { trackWhatsappClick } = useCtaTracking()

    trackWhatsappClick('header:home')

    expect(trackEvent).toHaveBeenCalledWith({
      event: 'whatsapp_click',
      category: 'cta',
      action: 'click',
      label: 'header:home',
    })
  })

  it('dispara contact_form_submit mesclando dados extras', () => {
    const { trackContactFormSubmit } = useCtaTracking()

    trackContactFormSubmit('contact_page_form', { service: 'Endomarketing' })

    expect(trackEvent).toHaveBeenCalledWith({
      event: 'contact_form_submit',
      category: 'cta',
      action: 'submit',
      label: 'contact_page_form',
      service: 'Endomarketing',
    })
  })

  it('não lança erro quando o GTM não está configurado (useGtm retorna undefined)', () => {
    vi.mocked(useGtm).mockReturnValue(undefined)

    const { trackWhatsappClick, trackContactFormSubmit } = useCtaTracking()

    expect(() => trackWhatsappClick('header:home')).not.toThrow()
    expect(() => trackContactFormSubmit('contact_page_form')).not.toThrow()
    expect(trackEvent).not.toHaveBeenCalled()
  })
})
