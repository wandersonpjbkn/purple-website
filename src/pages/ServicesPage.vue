<template>
  <div>
    <!-- ── Page Hero ──────────────────────────────────── -->
    <section class="page-hero">
      <BaseContainer>
        <p class="section-eyebrow">{{ services.intro.eyebrow }}</p>
        <h1>{{ services.intro.title }}</h1>
        <p class="lead lead--narrow">{{ services.intro.subtitle }}</p>
        <div style="margin-top: 2rem">
          <BaseButton tag="RouterLink" to="/contato">Falar com a Purple</BaseButton>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Catálogo detalhado ─────────────────────────── -->
    <section class="section-block">
      <BaseContainer>
        <article v-for="service in services.catalog" :id="service.id" :key="service.id" class="service-detail">
          <header class="service-detail__header">
            <div class="service-detail__icon"><BaseIcon :name="service.icon" /></div>
            <div>
              <h2 class="service-detail__title">{{ service.title }}</h2>
              <p class="service-detail__tagline">{{ service.tagline }}</p>
            </div>
          </header>

          <p class="service-detail__description">{{ service.description }}</p>

          <div class="service-detail__columns">
            <div>
              <h3 class="service-detail__subtitle">O que sua empresa ganha</h3>
              <ul class="service-detail__benefits">
                <li v-for="benefit in service.benefits" :key="benefit">
                  <BaseIcon name="check" class="service-detail__check" />
                  {{ benefit }}
                </li>
              </ul>
            </div>
            <div>
              <h3 class="service-detail__subtitle">Como fazemos</h3>
              <ol class="service-detail__process">
                <li v-for="step in service.process" :key="step">{{ step }}</li>
              </ol>
            </div>
          </div>
        </article>
      </BaseContainer>
    </section>

    <!-- ── Planos recorrentes ─────────────────────────── -->
    <section class="packages-section">
      <BaseContainer>
        <div class="section-header section-header--center">
          <p class="section-eyebrow section-eyebrow--lime">{{ services.packages.eyebrow }}</p>
          <h2 class="packages-section__title">{{ services.packages.title }}</h2>
          <p class="packages-section__subtitle">{{ services.packages.subtitle }}</p>
        </div>

        <div class="packages-grid">
          <article
            v-for="pkg in services.packages.items"
            :key="pkg.id"
            class="package-card"
            :class="{ 'package-card--featured': pkg.featured }"
          >
            <span class="package-card__audience">{{ pkg.audience }}</span>
            <h3 class="package-card__name">{{ pkg.name }}</h3>
            <p class="package-card__summary">{{ pkg.summary }}</p>
            <ul class="package-card__includes">
              <li v-for="item in pkg.includes" :key="item">
                <BaseIcon name="check" class="package-card__check" />
                {{ item }}
              </li>
            </ul>
            <div class="package-card__footer">
              <span class="package-card__price">{{ services.packages.priceLabel }}</span>
              <BaseButton tag="RouterLink" to="/contato" variant="lime">
                {{ services.packages.ctaLabel }}
              </BaseButton>
            </div>
          </article>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Projetos pontuais ──────────────────────────── -->
    <section class="section-block">
      <BaseContainer>
        <div class="section-header section-header--center">
          <p class="section-eyebrow">{{ services.projects.eyebrow }}</p>
          <h2>{{ services.projects.title }}</h2>
          <p class="lead lead--narrow" style="text-align: center">{{ services.projects.subtitle }}</p>
        </div>
        <div class="services-grid" style="margin-top: 2.5rem">
          <article v-for="project in services.projects.items" :key="project.title" class="service-card">
            <div class="service-card__icon"><BaseIcon :name="project.icon" /></div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <RouterLink class="text-link" to="/contato">Pedir proposta</RouterLink>
          </article>
        </div>
      </BaseContainer>
    </section>

    <!-- ── CTA ───────────────────────────────────────── -->
    <CtaBanner
      title="Pronto para transformar sua comunicação interna?"
      description="Vamos entender o contexto da sua empresa e construir juntos uma estratégia que faz sentido para o seu time."
    />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { usePageMeta } from '@/composables'
import services from '@/data/services.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Serviços',
  description:
    'Gestão de LinkedIn, comunicação interna, endomarketing, mídia de atração, diagnóstico de cultura e UX — em planos mensais ou projetos pontuais.',
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Catálogo detalhado ─────────────────────────────────────
.service-detail {
  padding: 3rem 0;
  border-bottom: 1px solid var(--border);
  // Compensa o header fixo ao navegar por âncora (/servicos#id).
  scroll-margin-top: 96px;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.service-detail__header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-5);
  margin-bottom: var(--space-5);
}

.service-detail__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius);
  background: var(--purple-100);
  color: var(--purple);
  display: grid;
  place-items: center;
  font-size: 24px;
  flex-shrink: 0;
}

.service-detail__title {
  font-size: var(--text-xl);
  margin-bottom: var(--space-1);
}

.service-detail__tagline {
  color: var(--purple);
  font-weight: 600;
  font-size: var(--text-sm);
}

.service-detail__description {
  max-width: 72ch;
  margin-bottom: var(--space-8);
}

.service-detail__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-10);

  @include respond-to(md) {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}

.service-detail__subtitle {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
  margin-bottom: var(--space-4);
}

.service-detail__benefits {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-3);

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    font-size: var(--text-sm);
    line-height: 1.55;
  }
}

.service-detail__check {
  color: var(--lime-dark);
  margin-top: 2px;
}

.service-detail__process {
  list-style: none;
  padding: 0;
  counter-reset: step;
  display: grid;
  gap: var(--space-3);

  li {
    counter-increment: step;
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    font-size: var(--text-sm);
    line-height: 1.55;

    &::before {
      content: counter(step);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1.5px solid var(--border);
      display: grid;
      place-items: center;
      font-size: var(--text-xs);
      font-weight: 800;
      color: var(--purple);
      flex-shrink: 0;
    }
  }
}

// ── Planos recorrentes (fundo escuro) ──────────────────────
.packages-section {
  background: var(--purple-900);
  padding: var(--space-20) 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -5%;
    width: 420px;
    aspect-ratio: 1;
    background: radial-gradient(ellipse, rgba(var(--lime-rgb), 0.08) 0%, transparent 65%);
    pointer-events: none;
  }
}

.packages-section__title {
  color: var(--on-dark);
}

.packages-section__subtitle {
  color: var(--on-dark-muted);
  text-align: center;
  max-width: 56ch;
  margin: var(--space-3) auto 0;
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  margin-top: var(--space-12);
  position: relative;
  z-index: 1;

  @include respond-to(lg) {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }
}

.package-card {
  display: flex;
  flex-direction: column;
  background: var(--on-dark-surface);
  border: 1px solid var(--on-dark-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);

  // Destaque visual do plano intermediário (sem claim de popularidade).
  &--featured {
    border-color: rgba(var(--lime-rgb), 0.5);
    background: rgba(var(--lime-rgb), 0.06);
  }
}

.package-card__audience {
  align-self: flex-start;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--lime);
  border: 1px solid rgba(var(--lime-rgb), 0.35);
  border-radius: var(--radius-pill);
  padding: var(--space-1) var(--space-3);
  margin-bottom: var(--space-4);
}

.package-card__name {
  color: var(--on-dark);
  font-size: var(--text-lg);
  margin-bottom: var(--space-2);
}

.package-card__summary {
  color: var(--on-dark-muted);
  font-size: var(--text-sm);
  margin-bottom: var(--space-5);
}

.package-card__includes {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-3);
  margin-bottom: var(--space-8);

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    color: var(--on-dark-strong);
    font-size: var(--text-sm);
    line-height: 1.5;
  }
}

.package-card__check {
  color: var(--lime);
  margin-top: 2px;
}

.package-card__footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.package-card__price {
  color: var(--on-dark);
  font-weight: 700;
  font-size: var(--text-base);
}
</style>
