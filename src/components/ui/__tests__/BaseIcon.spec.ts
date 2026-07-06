import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BaseIcon from '@/components/ui/BaseIcon.vue'
import { ICONS } from '@/components/ui/icons'

describe('BaseIcon', () => {
  it('nome conhecido renderiza os paths reais do mapa', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'check' } })
    const paths = wrapper.findAll('path')
    expect(paths).toHaveLength(ICONS.check.paths.length)
    expect(paths[0]?.attributes('d')).toBe(ICONS.check.paths[0])
    // O comentário no topo do template torna o componente multi-root;
    // os atributos vivem no <svg>, não na raiz do wrapper.
    expect(wrapper.find('svg').attributes('data-icon')).toBe('check')
  })

  it('glifo de marca (fill) renderiza preenchido, sem stroke', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'linkedin' } })
    const path = wrapper.find('path')
    expect(path.attributes('fill')).toBe('currentColor')
    expect(path.attributes('stroke')).toBe('none')
  })

  it('nome desconhecido cai no placeholder (degradação graciosa)', () => {
    const wrapper = mount(BaseIcon, { props: { name: 'nao-existe' } })
    expect(wrapper.findAll('path')).toHaveLength(0)
    expect(wrapper.find('rect').exists()).toBe(true)
    expect(wrapper.find('circle').exists()).toBe(true)
  })

  it('label alterna papel acessível (img) vs decorativo (aria-hidden)', () => {
    const decorative = mount(BaseIcon, { props: { name: 'check' } }).find('svg')
    expect(decorative.attributes('aria-hidden')).toBe('true')
    expect(decorative.attributes('role')).toBeUndefined()

    const labeled = mount(BaseIcon, { props: { name: 'check', label: 'Confirmado' } }).find('svg')
    expect(labeled.attributes('role')).toBe('img')
    expect(labeled.attributes('aria-label')).toBe('Confirmado')
    expect(labeled.attributes('aria-hidden')).toBeUndefined()
  })
})
