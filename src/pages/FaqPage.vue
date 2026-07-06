<template>
  <div>
    <PageHero
      eyebrow="Ajuda"
      title="Perguntas frequentes"
      subtitle="Como funciona contratar a Purple, planos, prazos e o que esperar. Se ficar qualquer dúvida, fale com a gente."
    />

    <FaqSection />

    <CtaBanner
      title="Ainda com dúvidas?"
      description="Conte o seu contexto e a gente responde com clareza — sem compromisso."
      secondary-to="/servicos"
      secondary-label="Ver serviços"
    />
  </div>
</template>

<script setup lang="ts">
import { usePageMeta } from '@/composables'

import PageHero from '@/components/sections/PageHero.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Perguntas frequentes',
  description:
    'Como funciona contratar a Purple Comunicação: planos, permanência mínima, projetos pontuais, prazos de resposta e mais.',
})
</script>
