import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'

// Controlled stand-ins for the visibility sources the composable consumes.
const visibility = ref<'visible' | 'hidden'>('visible')
let intersect: ((entries: { isIntersecting: boolean }[]) => void) | null = null

vi.mock('@vueuse/core', () => ({
  useDocumentVisibility: () => visibility,
  useIntersectionObserver: (_target: unknown, callback: (entries: { isIntersecting: boolean }[]) => void) => {
    intersect = callback
    return { stop: vi.fn() }
  },
}))

import { useTypewriter } from '@/composables/useTypewriter'

const PHRASES = ['abc', 'de']
const START_DELAY = 600
const SPEEDS = { type: 85, delete: 35, pauseAfter: 4500, pauseEmpty: 350 }

const mountTypewriter = () =>
  mount(
    defineComponent({
      setup() {
        const el = ref<HTMLElement | null>(null)
        useTypewriter(el, PHRASES)
        return () => h('span', { ref: el })
      },
    })
  )

beforeEach(() => {
  vi.useFakeTimers()
  visibility.value = 'visible'
  intersect = null
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('useTypewriter', () => {
  it('digita a frase letra a letra e marca is-complete no fim', () => {
    const wrapper = mountTypewriter()
    const el = wrapper.element as HTMLElement

    vi.advanceTimersByTime(START_DELAY)
    expect(el.textContent).toBe('a')

    vi.advanceTimersByTime(SPEEDS.type * 2)
    expect(el.textContent).toBe('abc')
    expect(el.classList.contains('is-complete')).toBe(true)
    expect(el.classList.contains('is-paused')).toBe(true)
  })

  it('pausa quando o elemento sai da viewport e retoma sem resetar', async () => {
    const wrapper = mountTypewriter()
    const el = wrapper.element as HTMLElement

    vi.advanceTimersByTime(START_DELAY + SPEEDS.type)
    expect(el.textContent).toBe('ab')

    intersect?.([{ isIntersecting: false }])
    await nextTick()
    vi.advanceTimersByTime(60_000)
    expect(el.textContent).toBe('ab')

    intersect?.([{ isIntersecting: true }])
    await nextTick()
    vi.advanceTimersByTime(SPEEDS.pauseEmpty)
    expect(el.textContent).toBe('abc')
  })

  it('pausa quando a aba fica oculta e retoma ao voltar', async () => {
    const wrapper = mountTypewriter()
    const el = wrapper.element as HTMLElement

    vi.advanceTimersByTime(START_DELAY)
    expect(el.textContent).toBe('a')

    visibility.value = 'hidden'
    await nextTick()
    vi.advanceTimersByTime(60_000)
    expect(el.textContent).toBe('a')

    visibility.value = 'visible'
    await nextTick()
    vi.advanceTimersByTime(SPEEDS.pauseEmpty)
    expect(el.textContent).toBe('ab')
  })

  it('com prefers-reduced-motion mostra a 1ª frase estática, sem animar', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))
    const wrapper = mountTypewriter()
    const el = wrapper.element as HTMLElement

    expect(el.textContent).toBe(PHRASES[0])
    expect(el.classList.contains('is-complete')).toBe(true)

    vi.advanceTimersByTime(60_000)
    expect(el.textContent).toBe(PHRASES[0])
  })

  it('para o loop ao desmontar o componente', () => {
    const wrapper = mountTypewriter()
    const el = wrapper.element as HTMLElement

    vi.advanceTimersByTime(START_DELAY)
    expect(el.textContent).toBe('a')

    wrapper.unmount()
    vi.advanceTimersByTime(60_000)
    expect(el.textContent).toBe('a')
  })
})
