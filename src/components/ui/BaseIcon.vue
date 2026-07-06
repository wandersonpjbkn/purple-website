<template>
  <!--
    Ícone do sistema — renderiza o SVG mapeado por `name` em icons.ts.

    Nomes desconhecidos (ou vazios) caem num placeholder neutro em vez de
    quebrar: um typo em `src/data/*.json` degrada visualmente, não explode.
  -->
  <svg
    class="base-icon"
    viewBox="0 0 24 24"
    :width="size"
    :height="size"
    fill="none"
    :data-icon="name || undefined"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <template v-if="icon">
      <path
        v-for="(d, i) in icon.paths"
        :key="i"
        :d="d"
        :fill="icon.fill ? 'currentColor' : 'none'"
        :stroke="icon.fill ? 'none' : 'currentColor'"
        :stroke-width="icon.fill ? undefined : 1.75"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>
    <template v-else>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.5" opacity="0.4" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" opacity="0.55" />
    </template>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { ICONS } from './icons'

const props = withDefaults(
  defineProps<{
    /** Nome semântico do ícone (ex.: 'target', 'megaphone') — chave de icons.ts. */
    name?: string
    /** Rótulo acessível. Vazio = ícone decorativo (aria-hidden). */
    label?: string
    /** Tamanho; por padrão acompanha o font-size do contêiner. */
    size?: string | number
  }>(),
  { name: '', label: '', size: '1em' },
)

const icon = computed(() => (props.name ? ICONS[props.name] : undefined))
</script>

<style scoped>
.base-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
