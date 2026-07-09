import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import CategoryFilter from '@/components/blog/CategoryFilter.vue'

import type { CategoryCount } from '@/types/blog'

const categories: CategoryCount[] = [
  { category: 'Cultura', count: 8 },
  { category: 'RH', count: 5 },
  { category: 'Endomarketing', count: 4 },
  { category: 'Liderança', count: 3 },
  { category: 'Comunicação', count: 2 },
  { category: 'Employer Branding', count: 1 },
]

const mountFilter = (modelValue = '') =>
  mount(CategoryFilter, {
    props: { categories, modelValue },
    attachTo: document.body,
  })

const trigger = (wrapper: ReturnType<typeof mountFilter>) => wrapper.get('.category-filter__trigger')

describe('CategoryFilter', () => {
  it('renderiza Todos + quick pills limitadas + trigger Filtrar', () => {
    const wrapper = mountFilter()
    const pills = wrapper.findAll('.category-filter__pill')

    // Todos + 4 quick (default) + trigger
    expect(pills).toHaveLength(6)
    expect(pills[0]?.text()).toBe('Todos')
    expect(trigger(wrapper).text()).toContain('Filtrar')
    expect(wrapper.findAll('.category-filter__pill--quick')).toHaveLength(4)
  })

  it('abre e fecha o painel controlando aria-expanded', async () => {
    const wrapper = mountFilter()

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
    expect(wrapper.find('.category-filter__panel').exists()).toBe(false)

    await trigger(wrapper).trigger('click')
    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
    // O painel lista TODAS as categorias
    expect(wrapper.findAll('.category-filter__option')).toHaveLength(categories.length)

    await trigger(wrapper).trigger('click')
    expect(wrapper.find('.category-filter__panel').exists()).toBe(false)
  })

  it('emite a categoria escolhida no painel e fecha', async () => {
    const wrapper = mountFilter()

    await trigger(wrapper).trigger('click')
    const options = wrapper.findAll('.category-filter__option')
    await options[options.length - 1]?.trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Employer Branding'])
    expect(wrapper.find('.category-filter__panel').exists()).toBe(false)
  })

  it('emite string vazia ao clicar em Todos', async () => {
    const wrapper = mountFilter('RH')
    await wrapper.findAll('.category-filter__pill')[0]?.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
  })

  it('fecha com Escape devolvendo o foco ao trigger', async () => {
    const wrapper = mountFilter()

    await trigger(wrapper).trigger('click')
    expect(wrapper.find('.category-filter__panel').exists()).toBe(true)

    await wrapper.get('.category-filter').trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.category-filter__panel').exists()).toBe(false)
    expect(document.activeElement).toBe(trigger(wrapper).element)

    wrapper.unmount()
  })

  it('mostra a categoria ativa no trigger quando ela não é quick pill', () => {
    const wrapper = mountFilter('Employer Branding')
    expect(trigger(wrapper).text()).toContain('Employer Branding')
    expect(trigger(wrapper).classes()).toContain('active')
  })
})
