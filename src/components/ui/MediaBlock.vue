<template>
  <!--
    Slot de imagem com fallback: enquanto o arquivo não existir (ou falhar o
    carregamento), mantém o visual-block decorativo — nunca o "broken image"
    do navegador. Para ativar a foto, basta subir o arquivo no caminho
    esperado (ver src/docs/IMAGES.md); nenhuma mudança de código.
  -->
  <div class="media-block" :class="{ 'media-block--loaded': loaded }">
    <img
      v-if="src && !failed"
      class="media-block__img"
      :src="src"
      :alt="alt"
      loading="lazy"
      @load="loaded = true"
      @error="failed = true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

withDefaults(
  defineProps<{
    /** Caminho público da imagem (ex.: '/images/sections/about.jpg'). Vazio = só o fallback. */
    src?: string
    /** Texto alternativo — obrigatório quando a imagem existir. */
    alt?: string
  }>(),
  { src: '', alt: '' },
)

const loaded = ref(false)
const failed = ref(false)
</script>

<style scoped lang="scss">
// Mesmo tratamento do .visual-block global (_grid.scss), que segue existindo
// para usos sem imagem; aqui ele é a base do fallback.
.media-block {
  border-radius: var(--radius-xl);
  background: var(--bg-alt);
  border: 1px solid var(--border);
  min-height: 380px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 80%, rgba(var(--lime-rgb), 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(var(--purple-rgb), 0.12) 0%, transparent 50%);
  }
}

.media-block__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.4s var(--ease);
}

.media-block--loaded .media-block__img {
  opacity: 1;
}
</style>
