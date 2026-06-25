<template>
  <!-- ── Page Hero ──────────────────────────────────── -->
  <section class="page-hero">
    <BaseContainer>
      <p class="section-eyebrow">Como atuamos</p>
      <h1>Nossa abordagem</h1>
      <p class="lead lead--narrow">
        Cada empresa tem um contexto. Antes de propor qualquer ação, entendemos o que está acontecendo de verdade.
      </p>
    </BaseContainer>
  </section>

  <!-- ── Pilares da abordagem ───────────────────────── -->
  <section class="section-block section-block--alt">
    <BaseContainer>
      <div class="approach-pillars">
        <FeaturePillar
          v-for="pillar in site.about.pillars"
          :key="pillar.title"
          :icon="pillar.icon"
          :title="pillar.title"
          :description="pillar.description"
        />
      </div>
    </BaseContainer>
  </section>

  <!-- ── Processo ───────────────────────────────────── -->
  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <div>
          <p class="section-eyebrow">{{ site.home.process.eyebrow }}</p>
          <h2>{{ site.home.process.title }}</h2>
          <p class="lead">
            Cada empresa tem um contexto único. Antes de propor qualquer ação, entendemos profundamente o seu negócio.
          </p>
          <div style="margin-top: 2rem">
            <BaseButton tag="RouterLink" to="/contato">Quero começar</BaseButton>
          </div>
        </div>
        <div class="process-list">
          <div v-for="(step, index) in site.home.process.steps" :key="step.title" class="process-item">
            <div class="process-item__number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="process-item__content">
              <h3>{{ step.title }}</h3>
              <p>{{ step.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>

  <!-- ── CTA ────────────────────────────────────────── -->
  <CtaBanner
    title="Vamos entender o seu contexto?"
    description="Cada estratégia começa por ouvir. Conte o seu desafio e construímos o caminho junto com o seu time."
  />
</template>

<script setup lang="ts">
import { usePageMeta } from '@/composables'
import site from '@/data/site.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FeaturePillar from '@/components/ui/FeaturePillar.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Abordagem',
  description:
    'Como a Purple Comunicação trabalha: diagnóstico antes da ação, foco nas pessoas e um processo claro do briefing ao acompanhamento.',
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.approach-pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @include respond-to(md) {
    grid-template-columns: 1fr;
  }
}
</style>
