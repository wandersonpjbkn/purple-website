<template>
  <!--
    Hero padrão de página interna (eyebrow + h1 + lead). Estrutura repetida em
    Abordagem, Serviços, FAQ e Privacidade. O `<slot/>` recebe extras opcionais
    (linha de botões, "última atualização" etc.). Usa a classe global
    `.page-hero` (em _hero.scss), compartilhada com o hero custom do AuthorPage.
  -->
  <section class="page-hero">
    <BaseContainer>
      <p class="section-eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p v-if="subtitle" class="lead lead--narrow">{{ subtitle }}</p>
      <slot />
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseContainer from '@/components/ui/BaseContainer.vue'

withDefaults(
  defineProps<{
    eyebrow: string
    title: string
    subtitle?: string
  }>(),
  { subtitle: '' },
)
</script>
