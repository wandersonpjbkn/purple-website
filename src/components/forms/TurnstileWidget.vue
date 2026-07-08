<template>
  <div class="turnstile">
    <div
      ref="container"
      class="turnstile__widget"
    />

    <p
      v-if="status === 'error'"
      class="turnstile__error"
    >
      Não foi possível validar a proteção contra spam. Atualize a página e tente novamente.
    </p>

    <p
      v-else-if="status === 'expired'"
      class="turnstile__warning"
    >
      A validação expirou. Aguarde um instante...
    </p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue'
import { useTurnstile } from '@/composables'

const emit = defineEmits<{
  (e: 'verified', token: string): void
  (e: 'expired'): void
  (e: 'error'): void
}>()

const container = ref<HTMLElement | null>(null)

const { token, status, render, reset, remove } = useTurnstile()

onMounted(() => {
  if (container.value) {
    render(container.value)
  }
})

onBeforeUnmount(() => {
  remove()
})

watch(token, value => {
  if (value) {
    emit('verified', value)
  }
})

watch(status, value => {
  switch (value) {
    case 'expired':
      emit('expired')
      break

    case 'error':
      emit('error')
      break
  }
})

defineExpose({ reset })
</script>

<style scoped lang="scss">
.turnstile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__widget {
    min-height: 65px;
  }

  &__error,
  &__warning {
    font-size: 0.875rem;
    line-height: 1.4;
  }

  &__error {
    color: var(--danger);
  }

  &__warning {
    color: var(--muted);
  }
}
</style>
