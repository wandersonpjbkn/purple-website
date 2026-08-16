import { describe, it, expect, beforeAll, vi } from 'vitest'
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
    // jsdom não implementa scrollIntoView — selecionar um card chama esse método.
    Element.prototype.scrollIntoView = vi.fn()

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

  it('renderiza o catálogo completo (grade de seleção) com âncoras', () => {
    const cards = wrapper.findAll('.svc-card')
    expect(cards).toHaveLength(services.catalog.length)
    for (const service of services.catalog) {
      expect(wrapper.find(`#${service.id}`).exists()).toBe(true)
    }
  })

  it('sem hash na URL, mostra o serviço em destaque no painel de detalhe', () => {
    const featured = services.catalog.find(service => service.featured)
    expect(wrapper.find('.svc-detail').text()).toContain(featured?.title)
  })

  it('clicar em outro card troca o conteúdo do painel de detalhe', async () => {
    const other = services.catalog.find(service => !service.featured)
    await wrapper.find(`#${other?.id}`).trigger('click')

    const featured = services.catalog.find(service => service.featured)
    expect(wrapper.find('.svc-detail').text()).toContain(other?.title)
    expect(wrapper.find('.svc-detail').text()).not.toContain(featured?.title)
  })

  it('seta de navegação avança para o próximo serviço da lista', async () => {
    const first = services.catalog[0]
    await wrapper.find(`#${first?.id}`).trigger('click')
    expect(wrapper.find('[aria-label="Serviço anterior"]').attributes('disabled')).toBeDefined()

    await wrapper.find('[aria-label="Próximo serviço"]').trigger('click')
    expect(wrapper.find('.svc-detail').text()).toContain(services.catalog[1]?.title)
  })

  it('no último serviço, a seta de próximo serviço fica desabilitada', async () => {
    const last = services.catalog[services.catalog.length - 1]
    await wrapper.find(`#${last?.id}`).trigger('click')
    expect(wrapper.find('[aria-label="Próximo serviço"]').attributes('disabled')).toBeDefined()
  })

  it('seta de navegação volta para o serviço anterior da lista', async () => {
    const third = services.catalog[2]
    await wrapper.find(`#${third?.id}`).trigger('click')

    await wrapper.find('[aria-label="Serviço anterior"]').trigger('click')
    expect(wrapper.find('.svc-detail').text()).toContain(services.catalog[1]?.title)
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
