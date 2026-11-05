import { describe, it, expect, vi, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

import PostShare from '@/components/blog/PostShare.vue'
import { SITE_URL } from '@/composables/usePageMeta'

const mountShare = () => mount(PostShare, { props: { path: '/blog/post', title: 'Título do post' } })

const stubNavigator = (props: Record<string, unknown>) => {
  for (const [key, value] of Object.entries(props)) {
    Object.defineProperty(navigator, key, { value, configurable: true })
  }
}

describe('PostShare', () => {
  afterEach(() => {
    stubNavigator({ share: undefined, clipboard: undefined })
    vi.useRealTimers()
  })

  it('lista LinkedIn, X e WhatsApp como links de saída em nova aba', () => {
    const links = mountShare().findAll('a')

    expect(links.map(link => link.attributes('aria-label'))).toEqual([
      'Compartilhar no LinkedIn',
      'Compartilhar no X',
      'Compartilhar no WhatsApp',
    ])
    expect(links.every(link => link.attributes('target') === '_blank')).toBe(true)
  })

  it('copia o link do post com UTM e avisa que copiou', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubNavigator({ clipboard: { writeText } })
    const wrapper = mountShare()

    await wrapper.find('[data-share="copy"]').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith(
      `${SITE_URL}/blog/post?utm_source=copy&utm_medium=social&utm_campaign=blog-share`
    )
    expect(wrapper.find('[data-share="copy"]').text()).toBe('Link copiado')
    expect(wrapper.find('[role="status"]').text()).toBe('Link copiado')
  })

  it('anuncia de novo quando copia uma segunda vez antes do aviso sumir', async () => {
    stubNavigator({ clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    const wrapper = mountShare()
    const status = wrapper.find('[role="status"]')

    await wrapper.find('[data-share="copy"]').trigger('click')
    await flushPromises()
    const announcements: string[] = []
    const observer = new MutationObserver(() => announcements.push(status.text()))
    observer.observe(status.element, { childList: true, characterData: true, subtree: true })

    await wrapper.find('[data-share="copy"]').trigger('click')
    await flushPromises()
    observer.disconnect()

    expect(announcements).toContain('')
    expect(status.text()).toBe('Link copiado')
  })

  it('avisa quando não consegue copiar', async () => {
    stubNavigator({ clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } })
    const wrapper = mountShare()

    await wrapper.find('[data-share="copy"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="status"]').text()).toBe('Não foi possível copiar o link')
  })

  it('volta ao rótulo original depois do aviso', async () => {
    vi.useFakeTimers()
    stubNavigator({ clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } })
    const wrapper = mountShare()

    await wrapper.find('[data-share="copy"]').trigger('click')
    await flushPromises()
    vi.advanceTimersByTime(3000)
    await flushPromises()

    expect(wrapper.find('[data-share="copy"]').text()).toBe('Copiar link')
  })

  it('esconde a gaveta nativa onde o navegador não a oferece', async () => {
    const wrapper = mountShare()
    await flushPromises()

    expect(wrapper.find('[data-share="native"]').exists()).toBe(false)
  })

  it('abre a gaveta nativa com o link do post e UTM própria', async () => {
    const share = vi.fn().mockResolvedValue(undefined)
    stubNavigator({ share })
    const wrapper = mountShare()
    await flushPromises()

    await wrapper.find('[data-share="native"]').trigger('click')

    expect(share).toHaveBeenCalledWith({
      title: 'Título do post',
      url: `${SITE_URL}/blog/post?utm_source=native&utm_medium=social&utm_campaign=blog-share`,
    })
  })
})
