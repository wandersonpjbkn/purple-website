<template>
  <div>
    <PageHero
      :eyebrow="services.intro.eyebrow"
      :title="services.intro.title"
      :subtitle="services.intro.subtitle"
    >
      <div class="button-row">
        <BaseButton
          tag="a"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="trackServicePageWhatsappClick"
        >
          Falar com uma consultora
        </BaseButton>
      </div>
    </PageHero>

    <div class="svc-subnav">
      <BaseContainer>
        <nav
          class="svc-subnav__pills"
          aria-label="Seções de serviços"
        >
          <a
            href="#catalogo"
            class="svc-subnav__pill"
            :class="{ active: activeSection === 'catalogo' }"
            :aria-current="activeSection === 'catalogo' ? 'true' : undefined"
            >Serviços</a
          >
          <a
            href="#planos"
            class="svc-subnav__pill"
            :class="{ active: activeSection === 'planos' }"
            :aria-current="activeSection === 'planos' ? 'true' : undefined"
            >Planos mensais</a
          >
          <a
            href="#projetos"
            class="svc-subnav__pill"
            :class="{ active: activeSection === 'projetos' }"
            :aria-current="activeSection === 'projetos' ? 'true' : undefined"
            >Projetos pontuais</a
          >
        </nav>
      </BaseContainer>
    </div>

    <section
      id="catalogo"
      class="section-block"
    >
      <BaseContainer>
        <div class="section-header">
          <p class="section-eyebrow">{{ services.homeTeaser.eyebrow }}</p>
          <h2>{{ services.homeTeaser.title }}</h2>
          <p class="lead">Escolha um serviço para ver o que sua empresa ganha e como fazemos.</p>
        </div>

        <div class="svc-catalog">
          <button
            v-for="service in services.catalog"
            :id="service.id"
            :key="service.id"
            type="button"
            class="svc-card"
            :class="{ 'svc-card--active': selectedId === service.id }"
            :aria-current="selectedId === service.id ? 'true' : undefined"
            aria-controls="svc-detail"
            @click="select(service.id)"
          >
            <span class="svc-card__icon"><BaseIcon :name="service.icon" /></span>
            <span class="svc-card__heading">
              <span class="svc-card__title">{{ service.title }}</span>
              <span class="svc-card__tagline">{{ service.tagline }}</span>
            </span>
            <span class="svc-card__summary">{{ service.summary }}</span>
          </button>
        </div>

        <div
          v-if="selectedService"
          id="svc-detail"
          ref="detailRef"
          class="svc-detail"
        >
          <div class="svc-detail__nav">
            <button
              type="button"
              class="svc-detail__nav-arrow"
              :disabled="currentIndex === 0"
              aria-label="Serviço anterior"
              @click="goPrev"
            >
              <BaseIcon name="chevron-left" />
            </button>
            <span class="svc-detail__nav-count">{{ currentIndex + 1 }} de {{ services.catalog.length }}</span>
            <button
              type="button"
              class="svc-detail__nav-arrow"
              :disabled="currentIndex === services.catalog.length - 1"
              aria-label="Próximo serviço"
              @click="goNext"
            >
              <BaseIcon name="chevron-right" />
            </button>
          </div>

          <Transition
            name="svc-detail-fade"
            mode="out-in"
          >
            <div :key="selectedService.id">
              <div class="svc-detail__head">
                <span class="svc-detail__icon"><BaseIcon :name="selectedService.icon" /></span>
                <span class="svc-detail__heading">
                  <h3 class="svc-detail__title">{{ selectedService.title }}</h3>
                  <span class="svc-detail__tagline">{{ selectedService.tagline }}</span>
                </span>
              </div>

              <p class="svc-detail__description">{{ selectedService.description }}</p>

              <div class="svc-detail__cols">
                <div>
                  <h4 class="svc-detail__subtitle">O que sua empresa ganha</h4>
                  <ul class="svc-detail__benefits">
                    <li
                      v-for="benefit in selectedService.benefits"
                      :key="benefit"
                    >
                      <BaseIcon
                        name="check"
                        class="svc-detail__check"
                      />
                      {{ benefit }}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 class="svc-detail__subtitle">Como fazemos</h4>
                  <ol class="svc-detail__process">
                    <li
                      v-for="step in selectedService.process"
                      :key="step"
                    >
                      {{ step }}
                    </li>
                  </ol>
                </div>
              </div>

              <div class="svc-detail__actions">
                <BaseButton
                  tag="RouterLink"
                  :to="`/contato?servico=${encodeURIComponent(selectedService.id)}`"
                  variant="lime"
                  >Pedir proposta</BaseButton
                >
              </div>
            </div>
          </Transition>
        </div>
      </BaseContainer>
    </section>

    <section
      id="planos"
      class="packages-section"
    >
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
              <li
                v-for="item in pkg.includes"
                :key="item"
              >
                <BaseIcon
                  name="check"
                  class="package-card__check"
                />
                {{ item }}
              </li>
            </ul>
            <div class="package-card__footer">
              <span class="package-card__price">{{ services.packages.priceLabel }}</span>
              <BaseButton
                tag="RouterLink"
                :to="`/contato?servico=${encodeURIComponent(pkg.id)}`"
                variant="lime"
              >
                {{ services.packages.ctaLabel }}
              </BaseButton>
            </div>
          </article>
        </div>
      </BaseContainer>
    </section>

    <section
      id="projetos"
      class="section-block"
    >
      <BaseContainer>
        <div class="section-header section-header--center">
          <p class="section-eyebrow">{{ services.projects.eyebrow }}</p>
          <h2>{{ services.projects.title }}</h2>
          <p class="lead lead--narrow lead--center">{{ services.projects.subtitle }}</p>
        </div>
        <div class="services-grid">
          <article
            v-for="project in services.projects.items"
            :key="project.title"
            class="service-card"
          >
            <div class="service-card__icon"><BaseIcon :name="project.icon" /></div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="service-card__links">
              <RouterLink
                class="text-link"
                :to="project.serviceId ? `/contato?servico=${encodeURIComponent(project.serviceId)}` : '/contato'"
                >Pedir proposta</RouterLink
              >
              <a
                v-if="project.serviceId"
                class="svc-detail-link"
                :href="`#${project.serviceId}`"
                @click="select(project.serviceId)"
              >
                Ver detalhes
              </a>
            </div>
          </article>
        </div>
      </BaseContainer>
    </section>

    <FaqSection alt />

    <CtaBanner
      title="Pronto para transformar sua comunicação interna?"
      description="Vamos entender o contexto da sua empresa e construir juntos uma estratégia que faz sentido para o seu time."
      whatsapp-message="Olá! Vi os serviços da Purple e quero saber mais sobre como contratar."
      content-to="/abordagem"
      content-label="Ver nossa abordagem"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import { usePageMeta, useWhatsappUrl, useCtaTracking } from '@/composables'
import services from '@/data/services.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import PageHero from '@/components/sections/PageHero.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Serviços',
  description:
    'Gestão de LinkedIn, comunicação interna, endomarketing, mídia de atração, diagnóstico de cultura e UX, em planos mensais ou projetos pontuais.',
})

const route = useRoute()

const whatsappUrl = useWhatsappUrl('Gostei dos serviços e quero conversar!')
const { trackWhatsappClick } = useCtaTracking()
const trackServicePageWhatsappClick = () => trackWhatsappClick(`header:${String(route.name ?? route.path)}`)

const featuredService = services.catalog.find(s => s.featured)
// Resolved at setup, not onMounted, so first paint already shows the right service.
const initialId =
  route.hash && services.catalog.some(s => s.id === route.hash.slice(1)) ? route.hash.slice(1) : featuredService?.id
const selectedId = ref(initialId)
const selectedService = computed(() => services.catalog.find(s => s.id === selectedId.value) ?? featuredService)
const currentIndex = computed(() => services.catalog.findIndex(s => s.id === selectedId.value))
const detailRef = ref<HTMLElement | null>(null)

const select = (id: string) => {
  selectedId.value = id
  nextTick(() => detailRef.value?.scrollIntoView({ block: 'nearest' }))
}

const goPrev = () => {
  const prev = services.catalog[currentIndex.value - 1]
  if (prev) select(prev.id)
}

const goNext = () => {
  const next = services.catalog[currentIndex.value + 1]
  if (next) select(next.id)
}

// Scrolls to the card, not the panel — the same target router/index.ts's
// scrollBehavior already uses for this hash; scrolling elsewhere would race it.
const selectFromHash = (hash: string) => {
  const id = hash.replace('#', '')
  if (id && services.catalog.some(s => s.id === id)) {
    selectedId.value = id
    nextTick(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }))
  }
}

const SUBNAV_SECTIONS = ['catalogo', 'planos', 'projetos']
const activeSection = ref(SUBNAV_SECTIONS[0])
let sectionObserver: IntersectionObserver | null = null

onMounted(() => {
  // Only for the scroll side effect — selection itself is already resolved at setup.
  if (route.hash) selectFromHash(route.hash)

  if (typeof IntersectionObserver === 'undefined') return

  sectionObserver = new IntersectionObserver(
    entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) activeSection.value = visible.target.id
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  for (const id of SUBNAV_SECTIONS) {
    const el = document.getElementById(id)
    if (el) sectionObserver.observe(el)
  }
})

onUnmounted(() => {
  sectionObserver?.disconnect()
})

watch(
  () => route.hash,
  hash => hash && selectFromHash(hash)
)
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.svc-subnav {
  position: sticky;
  top: 76px;
  z-index: 20;
  background: rgba(var(--bg-rgb), 0.9);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);

  @include respond-to(md) {
    top: 64px;
  }
}

.svc-subnav__pills {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3) 0;
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

  &.active {
    color: var(--purple-700);
    border-color: var(--purple-400);
    background: var(--purple-100);
  }
}

.svc-catalog {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  align-items: stretch;
  margin-top: var(--space-10);

  @include respond-to(lg) {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to(sm) {
    grid-template-columns: 1fr;
  }
}

// Height must stay constant across every card — anything that lets it vary
// here breaks the grid layout for the whole row.
.svc-card {
  @include top-accent-line;
  @include card-hover;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  scroll-margin-top: 140px;
  cursor: pointer;
  text-align: left;
  font: inherit;

  &.svc-card--active {
    border-color: var(--purple-400);

    &::after {
      transform: scaleX(1);
    }
  }
}

.svc-card__icon,
.svc-detail__icon {
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

.svc-card__heading {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.svc-card__title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.svc-card__tagline {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--purple);
}

.svc-card__summary {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.6;
}

.svc-detail {
  @include card-surface(var(--space-8));

  margin-top: var(--space-8);
  scroll-margin-top: 140px;
}

// Outside the fade transition on purpose — keeps focus on the same button
// across consecutive prev/next clicks instead of losing it on every switch.
.svc-detail__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.svc-detail__nav-arrow {
  width: var(--tap-target-min);
  height: var(--tap-target-min);
  display: grid;
  place-items: center;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--border);
  background: none;
  color: var(--purple);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s;

  &:hover:not(:disabled) {
    border-color: var(--purple-400);
    background: var(--purple-50);
  }

  &:disabled {
    color: var(--subtle);
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.svc-detail__nav-count {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--subtle);
}

.svc-detail-fade-enter-active,
.svc-detail-fade-leave-active {
  transition: opacity 0.15s var(--ease);
}

.svc-detail-fade-enter-from,
.svc-detail-fade-leave-to {
  opacity: 0;
}

.svc-detail__head {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}

.svc-detail__heading {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.svc-detail__title {
  margin: 0;
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.01em;
}

.svc-detail__tagline {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--purple);
}

.svc-detail__description {
  font-size: var(--text-sm);
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: var(--space-6);
}

.svc-detail__cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);

  @include respond-to(lg) {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }
}

.svc-detail__subtitle {
  font-size: var(--text-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
  margin-bottom: var(--space-3);
}

.svc-detail__benefits {
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

.svc-detail__check {
  color: var(--lime-dark);
  margin-top: 2px;
  flex-shrink: 0;
}

.svc-detail__process {
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
      border-radius: var(--radius-pill);
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

.svc-detail__actions {
  margin-top: var(--space-6);
}

.svc-detail-link {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--muted);

  &:hover {
    color: var(--purple);
  }
}

.packages-section {
  background: var(--section-dark);
  padding: var(--space-20) 0;
  position: relative;
  overflow: hidden;
  scroll-margin-top: 120px;

  &::before {
    @include radial-glow($size: 420px);
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
