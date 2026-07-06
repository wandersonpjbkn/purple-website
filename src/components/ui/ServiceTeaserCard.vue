<template>
  <!--
    Card-resumo de serviço (ícone + título + summary + "Saiba mais" → âncora do
    catálogo). Estrutura idêntica reusada no teaser da Home e na ponte da
    Abordagem. Mantém a classe `.service-card` (primitivo global de _cards.scss).
  -->
  <article class="service-card">
    <div class="service-card__icon"><BaseIcon :name="service.icon" /></div>
    <h3>{{ service.title }}</h3>
    <p>{{ service.summary }}</p>
    <RouterLink class="text-link" :to="`/servicos#${service.id}`">Saiba mais</RouterLink>
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseIcon from '@/components/ui/BaseIcon.vue'

defineProps<{
  service: { id: string; icon: string; title: string; summary: string }
}>()
</script>
