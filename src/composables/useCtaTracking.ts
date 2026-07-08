import { useGtm } from '@gtm-support/vue-gtm'

export const useCtaTracking = () => {
  const gtm = useGtm()

  const trackWhatsappClick = (origin: string, extra: Record<string, unknown> = {}) => {
    gtm?.trackEvent({ event: 'whatsapp_click', category: 'cta', action: 'click', label: origin, ...extra })
  }

  const trackContactFormSubmit = (origin: string, extra: Record<string, unknown> = {}) => {
    gtm?.trackEvent({ event: 'contact_form_submit', category: 'cta', action: 'submit', label: origin, ...extra })
  }

  return { trackWhatsappClick, trackContactFormSubmit }
}
