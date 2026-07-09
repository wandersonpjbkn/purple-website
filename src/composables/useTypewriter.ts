import { computed, onMounted, onUnmounted, ref, watch, type Ref } from 'vue'

import { useDocumentVisibility, useIntersectionObserver } from '@vueuse/core'

export interface TypewriterSpeeds {
  type: number
  delete: number
  pauseAfter: number
  pauseEmpty: number
}

const DEFAULT_SPEEDS: TypewriterSpeeds = {
  type: 85,
  delete: 35,
  pauseAfter: 4500,
  pauseEmpty: 350,
}

const START_DELAY = 600

/**
 * Types/deletes `phrases` into `target`, letter by letter, in a loop.
 *
 * The loop only runs while the element is on screen AND the tab is visible —
 * otherwise the pending timeout is cleared so nothing runs in the background.
 * State survives the pause, so it resumes mid-word instead of restarting.
 * `prefers-reduced-motion` renders the first phrase statically.
 */
export const useTypewriter = (
  target: Ref<HTMLElement | null>,
  phrases: string[],
  speeds: Partial<TypewriterSpeeds> = {}
) => {
  const SPEEDS: TypewriterSpeeds = { ...DEFAULT_SPEEDS, ...speeds }

  let phraseIndex = 0
  let charIndex = 0
  let isDeleting = false
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let reduced = false

  const targetVisible = ref(true)
  // Degrades safely: without IntersectionObserver support the callback never
  // fires and `targetVisible` stays true (loop paced only by tab visibility).
  useIntersectionObserver(target, entries => {
    const entry = entries[entries.length - 1]
    if (entry) targetVisible.value = entry.isIntersecting
  })

  const documentVisibility = useDocumentVisibility()
  const isActive = computed(() => targetVisible.value && documentVisibility.value === 'visible')

  const clearTick = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const schedule = (delay: number) => {
    clearTick()
    timeoutId = setTimeout(tick, delay)
  }

  const tick = () => {
    const el = target.value
    if (!el) return

    const current = phrases[phraseIndex]
    if (current === undefined) return

    if (isDeleting) {
      charIndex -= 1
      el.textContent = current.slice(0, charIndex)
      el.classList.remove('is-complete', 'is-paused')

      if (charIndex === 0) {
        isDeleting = false
        phraseIndex = (phraseIndex + 1) % phrases.length
        schedule(SPEEDS.pauseEmpty)
        return
      }

      schedule(SPEEDS.delete)
    } else {
      charIndex += 1
      el.textContent = current.slice(0, charIndex)

      if (charIndex === current.length) {
        el.classList.add('is-complete', 'is-paused')
        isDeleting = true
        schedule(SPEEDS.pauseAfter)
        return
      }

      schedule(SPEEDS.type)
    }
  }

  watch(isActive, active => {
    if (reduced) return
    if (active) {
      schedule(SPEEDS.pauseEmpty)
    } else {
      clearTick()
    }
  })

  onMounted(() => {
    // Reduced motion: render the first phrase statically, no animation.
    reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    if (reduced) {
      if (target.value) {
        target.value.textContent = phrases[0] ?? ''
        target.value.classList.add('is-complete')
      }
      return
    }
    schedule(START_DELAY)
  })

  onUnmounted(clearTick)
}
