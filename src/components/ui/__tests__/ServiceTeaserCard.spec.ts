import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ServiceTeaserCard from '@/components/ui/ServiceTeaserCard.vue'

const service = { id: 'employer-branding', icon: 'trophy', title: 'Employer Branding', summary: 'Resumo do serviço.' }
const routerLinkStub = { RouterLink: { props: ['to'], template: '<a :href="to"><slot /></a>' } }

const mountCard = (props: Record<string, unknown> = {}) =>
  mount(ServiceTeaserCard, { props: { service, ...props }, global: { stubs: routerLinkStub } })

describe('ServiceTeaserCard', () => {
  it('convida a conhecer o serviço com um verbo e leva à âncora dele', () => {
    const link = mountCard().find('a')

    expect(link.text()).toBe('Conhecer o serviço')
    expect(link.attributes('href')).toBe('/servicos#employer-branding')
  })

  it('o link cobre o card inteiro', () => {
    expect(mountCard().find('a').classes()).toContain('service-card__link')
  })

  it('fica empilhado por padrão e deita na versão horizontal', () => {
    expect(mountCard().classes()).not.toContain('service-card--horizontal')
    expect(mountCard({ horizontal: true }).classes()).toContain('service-card--horizontal')
  })
})
