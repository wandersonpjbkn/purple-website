<template>
  <div>
    <section class="page-hero">
      <BaseContainer>
        <p class="section-eyebrow">Ajuda</p>
        <h1>Perguntas frequentes</h1>
        <p class="lead lead--narrow">
          Como funciona contratar a Purple, planos, prazos e o que esperar. Se ficar qualquer dúvida, fale com a gente.
        </p>
      </BaseContainer>
    </section>

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

import BaseContainer from '@/components/ui/BaseContainer.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Perguntas frequentes',
  description:
    'Como funciona contratar a Purple Comunicação: planos, permanência mínima, projetos pontuais, prazos de resposta e mais.',
})
</script>
