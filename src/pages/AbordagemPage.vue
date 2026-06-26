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
          v-for="pillar in approach.pillars"
          :key="pillar.title"
          :icon="pillar.icon"
          :title="pillar.title"
          :description="pillar.description"
        />
      </div>
    </BaseContainer>
  </section>

  <!-- ── Diferenciais (por que a Purple) ────────────── -->
  <section class="section-block" style="background: var(--purple-900); border-radius: 0">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow section-eyebrow--lime">Por que a Purple</p>
        <h2 style="color: var(--on-dark)">Uma comunicação saudável começa dentro</h2>
        <p class="lead" style="color: var(--on-dark-muted); text-align: center">
          Acreditamos que uma comunicação eficaz é aquela que começa dentro para então ir para fora.
        </p>
      </div>
      <div class="differentials-grid">
        <FeaturePillar
          v-for="diff in approach.differentials"
          :key="diff.title"
          :icon="diff.icon"
          :title="diff.title"
          :description="diff.description"
          :dark="true"
        />
      </div>
    </BaseContainer>
  </section>

  <!-- ── Processo ───────────────────────────────────── -->
  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <div>
          <p class="section-eyebrow">{{ approach.process.eyebrow }}</p>
          <h2>{{ approach.process.title }}</h2>
          <p class="lead">
            Cada empresa tem um contexto único. Antes de propor qualquer ação, entendemos profundamente o seu negócio.
          </p>
          <div style="margin-top: 2rem">
            <BaseButton tag="RouterLink" to="/contato">Quero começar</BaseButton>
          </div>
        </div>
        <div class="process-list">
          <div v-for="(step, index) in approach.process.steps" :key="step.title" class="process-item">
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
import approach from '@/data/approach.json'

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

.differentials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 3rem;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond-to(sm) {
    grid-template-columns: 1fr;
  }
}
</style>
