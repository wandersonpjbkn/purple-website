import { describe, it, expect, beforeAll } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createHead } from '@unhead/vue/client'

import HomePage from '@/pages/HomePage.vue'
import home from '@/data/home.json'
import { baseRoutes } from '@/router/modules/base'
import { blogRoutes } from '@/router/modules/blog'

// Smoke de render (TESTING.md): hero validado + teaser de serviços montam
// sem erro com os dados reais.
describe('HomePage', () => {
  let wrapper: VueWrapper

  beforeAll(async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [...baseRoutes, ...blogRoutes],
    })
    router.push('/')
    await router.isReady()

    wrapper = mount(HomePage, {
      global: { plugins: [router, createHead()] },
    })
  })

  it('renderiza o hero com o título validado e stats com sinal em destaque', () => {
    // titlePrefix carrega <em>; comparamos com o texto sem markup.
    expect(wrapper.find('.hero__title').text()).toContain('Empresas que')
    const stats = wrapper.findAll('.hero__stat-number')
    expect(stats).toHaveLength(home.hero.stats.length)
    expect(wrapper.findAll('.hero__stat-sign').map(s => s.text())).toEqual(home.hero.stats.map(s => s.sign))
  })

  it('renderiza o card visual com valor + sinal e as tags', () => {
    expect(wrapper.find('.hero__card-value').text()).toBe(`${home.hero.card.value}${home.hero.card.sign}`)
    expect(wrapper.findAll('.hero__card-tag')).toHaveLength(home.hero.card.tags.length)
  })

  it('teaser de serviços: 4 cards comuns + 1 destaque, sem placeholders', () => {
    expect(wrapper.findAll('.service-card')).toHaveLength(5)
    expect(wrapper.find('.service-card--featured').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('{{')
  })
})
