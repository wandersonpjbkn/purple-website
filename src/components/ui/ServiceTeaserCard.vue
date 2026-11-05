<template>
  <article
    class="service-card"
    :class="{ 'service-card--horizontal': horizontal }"
  >
    <div class="service-card__icon"><BaseIcon :name="service.icon" /></div>
    <div class="service-card__body">
      <h3>{{ service.title }}</h3>
      <p>{{ service.summary }}</p>
    </div>
    <RouterLink
      class="text-link service-card__link"
      :to="`/servicos#${service.id}`"
      >Conhecer o serviço</RouterLink
    >
  </article>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseIcon from '@/components/ui/BaseIcon.vue'

defineProps<{
  service: { id: string; icon: string; title: string; summary: string }
  horizontal?: boolean
}>()
</script>
