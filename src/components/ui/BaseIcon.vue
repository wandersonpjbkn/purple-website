<template>
  <!--
    Ícone EM VALIDAÇÃO — estrutura SVG provisória.

    A iconografia final (sistema de ícones SVG próprio) ainda será montada.
    Até lá, renderizamos um placeholder SVG e preservamos o `name` semântico
    de cada ícone, para que a conversão futura seja name → SVG (sem passar
    por emoji ou texto). Quando o set existir, troque o conteúdo abaixo por
    um <use> / mapa de paths por `name`.
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
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" stroke-width="1.5" opacity="0.4" />
    <circle cx="12" cy="12" r="2.25" fill="currentColor" opacity="0.55" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Nome semântico do ícone (ex.: 'target', 'megaphone'). Mapeará para o SVG final. */
    name?: string
    /** Rótulo acessível. Vazio = ícone decorativo (aria-hidden). */
    label?: string
    /** Tamanho; por padrão acompanha o font-size do contêiner. */
    size?: string | number
  }>(),
  { name: '', label: '', size: '1em' },
)
</script>

<style scoped>
.base-icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
