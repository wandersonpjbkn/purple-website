import { describe, it, expect, beforeAll } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'

import ServicesPage from '@/pages/ServicesPage.vue'
import services from '@/data/services.json'
import { baseRoutes } from '@/router/modules/base'
import { blogRoutes } from '@/router/modules/blog'

// Smoke de render (TESTING.md): a página monta com dados reais e exibe as
// três camadas da oferta. Router + head são necessários porque usePageMeta
// usa useRoute/useSeoMeta.
describe('ServicesPage', () => {
  let wrapper: VueWrapper

  beforeAll(async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [...baseRoutes, ...blogRoutes],
    })
    router.push('/servicos')
    await router.isReady()

    wrapper = mount(ServicesPage, {
      global: { plugins: [router, createHead()] },
    })
  })

  it('renderiza o catálogo completo (cards expansíveis) com âncoras', () => {
    const cards = wrapper.findAll('.svc-item')
    expect(cards).toHaveLength(services.catalog.length)
    for (const service of services.catalog) {
      expect(wrapper.find(`#${service.id}`).exists()).toBe(true)
    }
  })

  it('renderiza os 3 planos com preço sob consulta, sem valores', () => {
    expect(wrapper.findAll('.package-card')).toHaveLength(3)
    expect(wrapper.text()).toContain('Sob consulta')
    expect(wrapper.text()).not.toContain('R$')
  })

  it('renderiza os projetos pontuais', () => {
    expect(wrapper.text()).toContain(services.projects.title)
    expect(wrapper.findAll('.service-card')).toHaveLength(services.projects.items.length)
  })
})
