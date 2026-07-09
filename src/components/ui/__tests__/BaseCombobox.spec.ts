import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import BaseCombobox from '@/components/ui/BaseCombobox.vue'

const options = ['Gestão de LinkedIn Corporativo', 'Comunicação Interna', 'Endomarketing', 'Outro']

const mountCombobox = (modelValue = '') =>
  mount(BaseCombobox, {
    props: { modelValue, options },
    attachTo: document.body,
  })

type Wrapper = ReturnType<typeof mountCombobox>

const input = (wrapper: Wrapper) => wrapper.get('input')

// trigger('focus') only dispatches the event — it doesn't move jsdom's real focus,
// which the close handlers (Esc/click outside) and the aria-activedescendant
// assertions need in order to behave like a real browser.
const focusInput = async (wrapper: Wrapper) => {
  input(wrapper).element.focus()
  await wrapper.vm.$nextTick()
}

describe('BaseCombobox', () => {
  it('abre a lista com todas as opções ao focar, sem filtrar', async () => {
    const wrapper = mountCombobox()
    await focusInput(wrapper)

    expect(wrapper.findAll('.combobox__option')).toHaveLength(options.length)

    wrapper.unmount()
  })

  it('filtra a lista conforme o usuário digita', async () => {
    const wrapper = mountCombobox()
    await focusInput(wrapper)

    await input(wrapper).setValue('comuni')

    const rendered = wrapper.findAll('.combobox__option').map(el => el.text())
    expect(rendered).toEqual(['Comunicação Interna'])

    wrapper.unmount()
  })

  it('mostra "Nenhum resultado" quando nada casa com o termo digitado', async () => {
    const wrapper = mountCombobox()
    await focusInput(wrapper)

    await input(wrapper).setValue('xpto-inexistente')

    expect(wrapper.find('.combobox__empty').exists()).toBe(true)
    expect(wrapper.findAll('.combobox__option')).toHaveLength(0)

    wrapper.unmount()
  })

  it('emite a opção clicada e fecha a lista', async () => {
    const wrapper = mountCombobox()
    await focusInput(wrapper)

    await wrapper.findAll('.combobox__option')[2]?.trigger('mousedown')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Endomarketing'])
    expect(wrapper.find('.combobox__listbox').exists()).toBe(false)

    wrapper.unmount()
  })

  it('Esc fecha a lista e reverte o texto digitado, mantendo o foco no campo', async () => {
    const wrapper = mountCombobox('Endomarketing')
    await focusInput(wrapper)

    await input(wrapper).setValue('texto sem correspondência')
    await input(wrapper).trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('.combobox__listbox').exists()).toBe(false)
    expect(input(wrapper).element.value).toBe('Endomarketing')
    expect(document.activeElement).toBe(input(wrapper).element)

    wrapper.unmount()
  })

  it('não emite valor ao digitar texto sem correspondência e clicar fora', async () => {
    const wrapper = mountCombobox('Endomarketing')
    await focusInput(wrapper)

    await input(wrapper).setValue('texto sem correspondência')
    document.body.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(input(wrapper).element.value).toBe('Endomarketing')

    wrapper.unmount()
  })

  it('navega com as setas e seleciona a opção destacada com Enter', async () => {
    const wrapper = mountCombobox()
    await focusInput(wrapper)

    await input(wrapper).trigger('keydown', { key: 'ArrowDown' })
    await input(wrapper).trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Comunicação Interna'])

    wrapper.unmount()
  })

  it('expõe focus() para foco programático', () => {
    const wrapper = mountCombobox()
    ;(wrapper.vm as unknown as { focus: () => void }).focus()

    expect(document.activeElement).toBe(input(wrapper).element)

    wrapper.unmount()
  })
})
