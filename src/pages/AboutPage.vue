<template>
  <section class="about-hero">
    <BaseContainer>
      <div class="about-hero__inner">
        <div>
          <p class="section-eyebrow">Sobre nós</p>
          <h1>Criada por gente que se importa</h1>
          <p class="lead">
            Lideranças abusivas, espaços que adoecem as pessoas e a falta de integração entre times. A Purple nasceu
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

  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <div>
          <p class="section-eyebrow">Nossa crença</p>
          <h2>{{ about.helpTitle }}</h2>
          <p class="lead">{{ about.helpText }}</p>
          <p class="about-belief__note">
            Por isso, antes de olhar para fora, ajudamos empresas a olharem para dentro — para as pessoas que movem o
            negócio todos os dias.
          </p>
          <div class="button-row">
            <BaseButton
              tag="RouterLink"
              to="/servicos"
              >Ver nossos serviços</BaseButton
            >
            <BaseButton
              tag="RouterLink"
              to="/contato"
              variant="secondary"
              >Falar com a Purple</BaseButton
            >
          </div>
        </div>
        <MediaBlock
          :src="useCdnAsset(about.image)"
          :alt="about.imageAlt"
          size="sm"
        />
      </div>
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow">Quem somos</p>
        <h2>As pessoas por trás da Purple</h2>
        <p class="lead lead--center">
          A união de uma comunicóloga e de um UX/psicólogo que já trabalharam juntos, resultou em uma consultoria focada
          em Comunicação Interna, Endomarketing e Employer Branding.
        </p>
      </div>
      <div class="team-grid">
        <TeamCard
          v-for="member in team"
          :key="member.name"
          :member="member"
        />
      </div>
    </BaseContainer>
  </section>

  <section class="about-data-section">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow section-eyebrow--lime">Por que isso importa</p>
        <h2>O problema que viemos resolver</h2>
        <p class="about-data-section__intro">
          Os números mostram que o mercado ainda tem muito a evoluir no cuidado com as pessoas.
        </p>
      </div>
      <div class="stat-grid">
        <StatCard
          v-for="stat in about.dataStats"
          :key="stat.number"
          :number="stat.number"
          :suffix="stat.suffix"
          :label="stat.label"
          :source="stat.source"
        />
      </div>
    </BaseContainer>
  </section>

  <CtaBanner
    title="Tudo começa com uma boa conversa"
    description="Estamos aqui para ouvir, entender seu contexto e construir juntos uma estratégia que faz sentido."
    whatsapp-message="Olá! Conheci a Purple pela página Sobre e quero conversar."
    content-to="/abordagem"
    content-label="Conhecer nossa abordagem"
  />
</template>

<script setup lang="ts">
import { usePageMeta, useCdnAsset } from '@/composables'
import about from '@/data/about.json'
import team from '@/data/team.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import MediaBlock from '@/components/ui/MediaBlock.vue'
import StatCard from '@/components/ui/StatCard.vue'
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
  padding: 4.5rem 0 var(--space-16);
}

.about-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-20);
  align-items: center;

  @include respond-to(md) {
    grid-template-columns: 1fr;
    gap: var(--space-10);
  }

  h1 {
    font-size: clamp(2rem, 4vw, 3.4rem);
  }
}

.about-hero__manifesto {
  background: var(--section-dark);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  position: relative;
  overflow: hidden;

  &::before {
    content: '"';
    position: absolute;
    top: calc(var(--space-2) * -1);
    left: var(--space-6);
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

.about-belief__note {
  margin-top: var(--space-4);
}

.about-data-section {
  background: var(--section-dark);
  padding: var(--space-20) 0;
  position: relative;
  overflow: hidden;

  h2 {
    color: var(--on-dark);
  }

  &::before {
    @include radial-glow($vpos: bottom);
  }
}

.about-data-section__intro {
  color: var(--on-dark-muted);
  text-align: center;
  max-width: 56ch;
  margin-inline: auto;
}
</style>
