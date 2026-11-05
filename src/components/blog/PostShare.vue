<template>
  <div class="post-share">
    <ul class="post-share__networks">
      <li
        v-for="link in links"
        :key="link.network"
      >
        <a
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="link.label"
          class="post-share__control post-share__control--icon"
        >
          <BaseIcon
            :name="link.icon"
            size="18"
          />
        </a>
      </li>
    </ul>

    <BaseButton
      v-if="canShareNatively"
      variant="secondary"
      class="post-share__control"
      data-share="native"
      @click="shareNatively"
    >
      <BaseIcon
        name="share"
        size="18"
      />
      Compartilhar
    </BaseButton>

    <BaseButton
      variant="secondary"
      class="post-share__control"
      data-share="copy"
      @click="copyLink"
    >
      <BaseIcon
        name="link"
        size="18"
      />
      {{ copyLabel }}
    </BaseButton>

    <p
      class="sr-only"
      role="status"
    >
      {{ status }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import { useShareLinks, withShareUtm } from '@/composables'

const props = defineProps<{ path: string; title: string }>()

const COPIED = 'Link copiado'
const STATUS_RESET_MS = 2500

const { url, links } = useShareLinks(
  () => props.path,
  () => props.title
)

const canShareNatively = ref(false)
const status = ref('')
const copyLabel = computed(() => (status.value === COPIED ? COPIED : 'Copiar link'))

let resetTimer: ReturnType<typeof setTimeout> | undefined

const announce = async (message: string) => {
  status.value = ''
  await nextTick()
  status.value = message
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => {
    status.value = ''
  }, STATUS_RESET_MS)
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(withShareUtm(url.value, 'copy'))
    await announce(COPIED)
  } catch {
    await announce('Não foi possível copiar o link')
  }
}

const shareNatively = () => {
  navigator.share({ title: props.title, url: withShareUtm(url.value, 'native') }).catch(() => {})
}

onMounted(() => {
  canShareNatively.value = typeof navigator.share === 'function'
})

onUnmounted(() => clearTimeout(resetTimer))
</script>

<style scoped lang="scss">
.post-share {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-2);
}

.post-share__networks {
  display: flex;
  gap: var(--space-2);
  list-style: none;
  margin: 0;
  padding: 0;
}

.post-share__control {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-width: var(--tap-target-min);
  height: var(--tap-target-min);
  padding: 0 var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface);
  color: var(--purple-700);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.15s,
    color 0.15s,
    background 0.15s;

  &:hover {
    border-color: var(--purple);
    color: var(--purple);
    background: var(--purple-50);
  }

  &--icon {
    width: var(--tap-target-min);
    padding: 0;
  }
}
</style>
