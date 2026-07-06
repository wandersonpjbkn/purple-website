<template>
  <!-- ── Hero ──────────────────────────────────────── -->
  <section class="about-hero">
    <BaseContainer>
      <div class="about-hero__inner">
        <div>
          <p class="section-eyebrow">Sobre nós</p>
          <h1>Um espaço criado por gente que não se conforma</h1>
          <p class="lead">
            Com lideranças abusivas, espaços que adoecem as pessoas e a falta de integração entre times. A Purple nasceu
            para mudar isso.
          </p>
        </div>
        <div class="about-hero__manifesto">
          <p class="about-manifesto-text">
            "Acreditamos que com uma boa cultura, gestão e profissionais engajados, as empresas podem ir cada vez mais
            longe."
          </p>
        </div>
      </div>
    </BaseContainer>
  </section>

  <!-- ── Nossa crença ───────────────────────────────── -->
  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <div>
          <p class="section-eyebrow">Nossa crença</p>
          <h2>{{ about.helpTitle }}</h2>
          <p class="lead">{{ about.helpText }}</p>
          <p style="margin-top: 1rem">
            Por isso, antes de olhar para fora, ajudamos empresas a olharem para dentro — para as pessoas que movem o
            negócio todos os dias.
          </p>
          <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap">
            <BaseButton tag="RouterLink" to="/servicos">Ver nossos serviços</BaseButton>
            <BaseButton tag="RouterLink" to="/contato" variant="secondary">Falar com a Purple</BaseButton>
          </div>
        </div>
        <MediaBlock :src="about.image" :alt="about.imageAlt" />
      </div>
    </BaseContainer>
  </section>

  <!-- ── Time ───────────────────────────────────────── -->
  <section class="section-block">
    <BaseContainer>
      <div class="section-header section-header--center" style="margin-bottom: 3rem">
        <p class="section-eyebrow">Quem somos</p>
        <h2>As pessoas por trás da Purple</h2>
        <p class="lead" style="text-align: center">
          A união de uma publicitária/marketeira e de um UX/psicólogo que já trabalharam juntos, resultou em uma
          consultoria focada em Comunicação Interna, Endomarketing e Employer Branding.
        </p>
      </div>
      <div class="team-grid">
        <TeamCard v-for="member in team" :key="member.name" :member="member" />
      </div>
    </BaseContainer>
  </section>

  <!-- ── Dados de mercado ───────────────────────────── -->
  <section class="about-data-section">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow section-eyebrow--lime">Por que isso importa</p>
        <h2>O problema que viemos resolver</h2>
        <p style="color: var(--on-dark-muted); text-align: center; max-width: 56ch; margin: 0 auto">
          Os números mostram que o mercado ainda tem muito a evoluir no cuidado com as pessoas.
        </p>
      </div>
      <!-- data-stat-grid + data-stat-card vêm de _stats.scss -->
      <div class="data-stat-grid" style="margin-top: 3rem; position: relative; z-index: 1">
        <div
          v-for="stat in about.dataStats"
          :key="stat.number"
          class="data-stat-card"
          style="background: var(--section-dark-2)"
        >
          <span class="data-stat-card__number">
            {{ stat.number }}<span>{{ stat.suffix }}</span>
          </span>
          <p class="data-stat-card__label">{{ stat.label }}</p>
          <span class="data-stat-card__source">{{ stat.source }}</span>
        </div>
      </div>
    </BaseContainer>
  </section>

  <!-- ── CTA ────────────────────────────────────────── -->
  <CtaBanner
    title="Tudo começa com uma boa conversa"
    description="Estamos aqui para ouvir, entender seu contexto e construir juntos uma estratégia que faz sentido."
  />
</template>

<script setup lang="ts">
import { usePageMeta } from '@/composables'
import about from '@/data/about.json'
import team from '@/data/team.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MediaBlock from '@/components/ui/MediaBlock.vue'
import TeamCard from '@/components/ui/TeamCard.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Sobre Nós',
  description:
    'Conheça a Purple Comunicação — consultoria especializada em Employer Branding, Endomarketing e Comunicação Interna, criada por quem acredita em espaços de trabalho mais humanos.',
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.about-hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 4.5rem 0 4rem;
}

.about-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;

  @include respond-to(md) {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3.4rem);
  }
}

.about-hero__manifesto {
  background: var(--section-dark);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '"';
    position: absolute;
    top: -0.5rem;
    left: 1.5rem;
    font-size: 8rem;
    font-weight: 800;
    color: var(--lime);
    opacity: 0.15;
    line-height: 1;
    font-family: var(--font);
    pointer-events: none;
  }
}

.about-manifesto-text {
  font-size: 1.15rem;
  font-weight: 500;
  color: var(--on-dark);
  line-height: 1.7;
  font-style: italic;
  position: relative;
  z-index: 1;
}

.about-data-section {
  background: var(--section-dark);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: -20%;
    right: -5%;
    width: 400px;
    aspect-ratio: 1;
    background: radial-gradient(ellipse, rgba(var(--lime-rgb), 0.08) 0%, transparent 65%);
    pointer-events: none;
  }
}
</style>
