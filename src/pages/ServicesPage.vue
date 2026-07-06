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

    <!-- ── Sub-nav fixa: acesso rápido às 3 camadas ───── -->
    <div class="svc-subnav">
      <BaseContainer>
        <nav class="svc-subnav__pills" aria-label="Seções de serviços">
          <a href="#catalogo" class="svc-subnav__pill">Serviços</a>
          <a href="#planos" class="svc-subnav__pill">Planos mensais</a>
          <a href="#projetos" class="svc-subnav__pill">Projetos pontuais</a>
        </nav>
      </BaseContainer>
    </div>

    <!-- ── Catálogo em cards expansíveis ──────────────── -->
    <section id="catalogo" class="section-block">
      <BaseContainer>
        <div class="section-header">
          <p class="section-eyebrow">{{ services.homeTeaser.eyebrow }}</p>
          <h2>{{ services.homeTeaser.title }}</h2>
          <p class="lead" style="margin-top: 0.5rem">
            Clique em um serviço para ver o que sua empresa ganha e como fazemos.
          </p>
        </div>

        <div class="svc-catalog">
          <article
            v-for="service in services.catalog"
            :id="service.id"
            :key="service.id"
            class="svc-item"
            :class="{ 'svc-item--open': isOpen(service.id) }"
          >
            <button
              type="button"
              class="svc-item__head"
              :aria-expanded="isOpen(service.id)"
              :aria-controls="`svc-panel-${service.id}`"
              @click="toggle(service.id)"
            >
              <span class="svc-item__icon"><BaseIcon :name="service.icon" /></span>
              <span class="svc-item__heading">
                <span class="svc-item__title">{{ service.title }}</span>
                <span class="svc-item__tagline">{{ service.tagline }}</span>
              </span>
              <span class="svc-item__chevron" aria-hidden="true"></span>
            </button>

            <p class="svc-item__summary">{{ service.summary }}</p>

            <div v-show="isOpen(service.id)" :id="`svc-panel-${service.id}`" class="svc-item__detail">
              <p class="svc-item__description">{{ service.description }}</p>
              <div class="svc-item__cols">
                <div>
                  <h3 class="svc-item__subtitle">O que sua empresa ganha</h3>
                  <ul class="svc-item__benefits">
                    <li v-for="benefit in service.benefits" :key="benefit">
                      <BaseIcon name="check" class="svc-item__check" />
                      {{ benefit }}
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 class="svc-item__subtitle">Como fazemos</h3>
                  <ol class="svc-item__process">
                    <li v-for="step in service.process" :key="step">{{ step }}</li>
                  </ol>
                </div>
              </div>
              <div class="svc-item__actions">
                <BaseButton tag="RouterLink" to="/contato" variant="lime">Pedir proposta</BaseButton>
              </div>
            </div>

            <button type="button" class="svc-item__more" @click="toggle(service.id)">
              {{ isOpen(service.id) ? 'Fechar' : 'Saiba mais' }}
            </button>
          </article>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Planos recorrentes ─────────────────────────── -->
    <section id="planos" class="packages-section">
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
    <section id="projetos" class="section-block">
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
            <div class="service-card__links">
              <RouterLink class="text-link" to="/contato">Pedir proposta</RouterLink>
              <a v-if="project.serviceId" class="svc-detail-link" :href="`#${project.serviceId}`" @click="open(project.serviceId)">
                Ver detalhes
              </a>
            </div>
          </article>
        </div>
      </BaseContainer>
    </section>

    <!-- ── FAQ ────────────────────────────────────────── -->
    <FaqSection alt />

    <!-- ── CTA ───────────────────────────────────────── -->
    <CtaBanner
      title="Pronto para transformar sua comunicação interna?"
      description="Vamos entender o contexto da sua empresa e construir juntos uma estratégia que faz sentido para o seu time."
      secondary-to="/abordagem"
      secondary-label="Ver nossa abordagem"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { usePageMeta } from '@/composables'
import services from '@/data/services.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Serviços',
  description:
    'Gestão de LinkedIn, comunicação interna, endomarketing, mídia de atração, diagnóstico de cultura e UX — em planos mensais ou projetos pontuais.',
})

const route = useRoute()

// Estado de expansão dos cards do catálogo (vários podem ficar abertos).
const openState = reactive<Record<string, boolean>>({})
const isOpen = (id: string) => !!openState[id]
const toggle = (id: string) => {
  openState[id] = !openState[id]
}
const open = (id: string) => {
  openState[id] = true
}

// Deep-link: /servicos#comunicacao-interna (vindo da Home ou de Projetos) abre
// o card correspondente e rola até ele.
const openFromHash = (hash: string) => {
  const id = hash.replace('#', '')
  if (id && services.catalog.some((s) => s.id === id)) {
    open(id)
    nextTick(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
  }
}

onMounted(() => {
  if (route.hash) openFromHash(route.hash)
})
watch(
  () => route.hash,
  (hash) => hash && openFromHash(hash),
)
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Sub-nav fixa ───────────────────────────────────────────
.svc-subnav {
  position: sticky;
  top: 76px;
  z-index: 20;
  background: rgba(250, 247, 253, 0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);

  @include respond-to(md) {
    top: 64px;
  }
}

.svc-subnav__pills {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 0;
  overflow-x: auto;
}

.svc-subnav__pill {
  white-space: nowrap;
  padding: 0.4rem 0.95rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--border);
  background: var(--surface);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
  transition:
    color 0.15s,
    border-color 0.15s,
    background 0.15s;

  &:hover {
    color: var(--purple-700);
    border-color: var(--purple-100);
    background: var(--purple-50);
  }
}

// ── Catálogo (cards expansíveis) ───────────────────────────
.svc-catalog {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  align-items: start;
  margin-top: var(--space-10);

  @include respond-to(md) {
    grid-template-columns: 1fr;
  }
}

.svc-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  scroll-margin-top: 140px;
  transition:
    box-shadow 0.2s var(--ease),
    border-color 0.2s var(--ease);

  &--open,
  &:hover {
    box-shadow: var(--shadow);
  }
  &--open {
    border-color: var(--purple-100);
  }
}

.svc-item__head {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  font: inherit;
}

.svc-item__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius);
  background: var(--purple-100);
  color: var(--purple);
  display: grid;
  place-items: center;
  font-size: 22px;
  flex-shrink: 0;
}

.svc-item__heading {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.svc-item__title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.svc-item__tagline {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--purple);
}

.svc-item__chevron {
  width: 11px;
  height: 11px;
  border-right: 2px solid var(--subtle);
  border-bottom: 2px solid var(--subtle);
  transform: rotate(45deg);
  transition: transform 0.2s var(--ease);
  flex-shrink: 0;

  .svc-item--open & {
    transform: rotate(-135deg);
  }
}

.svc-item__summary {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.6;
}

.svc-item__detail {
  margin-top: var(--space-5);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border-subtle);
}

.svc-item__description {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: var(--space-6);
}

.svc-item__cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);

  @include respond-to(lg) {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
}

.svc-item__subtitle {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
  margin-bottom: var(--space-3);
}

.svc-item__benefits {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--space-2);

  li {
    display: flex;
    align-items: flex-start;
    gap: var(--space-2);
    font-size: var(--text-sm);
    line-height: 1.5;
  }
}

.svc-item__check {
  color: var(--lime-dark);
  margin-top: 2px;
  flex-shrink: 0;
}

.svc-item__process {
  list-style: none;
  padding: 0;
  counter-reset: step;
  display: grid;
  gap: var(--space-2);

  li {
    counter-increment: step;
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    font-size: var(--text-sm);
    line-height: 1.5;

    &::before {
      content: counter(step);
      width: 22px;
      height: 22px;
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

.svc-item__actions {
  margin-top: var(--space-6);
}

.svc-item__more {
  margin-top: var(--space-4);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--purple);

  &:hover {
    text-decoration: underline;
  }
}

.service-card__links {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.svc-detail-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
  &:hover {
    color: var(--purple);
  }
}

// ── Planos recorrentes (fundo escuro) ──────────────────────
.packages-section {
  background: var(--section-dark);
  padding: var(--space-20) 0;
  position: relative;
  overflow: hidden;
  scroll-margin-top: 120px;

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
