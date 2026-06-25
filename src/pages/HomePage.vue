<template>
  <section class="hero">
    <BaseContainer>
      <div class="hero__grid">
        <!-- Coluna texto · posicionamento em validação (placeholders.ts) -->
        <div>
          <div class="hero__kicker">
            <span class="dot"></span>
            {{ POSITIONING_HOOK.eyebrow }}
          </div>

          <h1 class="hero__title">
            {{ POSITIONING_HOOK.title }}
            <br />
            <span ref="typewriterEl" class="hero__typewriter" />
          </h1>

          <p class="lead">{{ POSITIONING_HOOK.subtitle }}</p>

          <div class="hero__actions">
            <BaseButton class="button--lg" tag="RouterLink" to="/contato">
              {{ site.home.hero.primaryCta }}
            </BaseButton>
            <BaseButton class="button--lg" tag="RouterLink" to="/servicos" variant="secondary">
              {{ site.home.hero.secondaryCta }}
            </BaseButton>
          </div>

          <!-- 3 indicadores compactos · claims em validação -->
          <div class="hero__stat">
            <template v-for="(point, i) in POSITIONING_HOOK.proofPoints" :key="i">
              <div v-if="i > 0" class="hero__stat-divider"></div>
              <div>
                <div class="hero__stat-number">{{ point.value }}</div>
                <div class="hero__stat-label">{{ point.label }}</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Coluna card visual · claims em validação -->
        <div class="hero__media">
          <div class="hero__card">
            <div class="hero__card-label">{{ POSITIONING_HOOK.card.label }}</div>
            <div class="hero__card-value">{{ POSITIONING_HOOK.card.value }}</div>
            <div class="hero__card-sub">{{ POSITIONING_HOOK.card.sub }}</div>
            <div class="hero__card-bar">
              <div class="hero__card-bar-fill" style="width: 78%"></div>
            </div>
            <div class="hero__card-tags">
              <span
                v-for="(tag, i) in POSITIONING_HOOK.card.tags"
                :key="i"
                class="hero__card-tag"
                :class="{ accent: i === 0 }"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="hero__float hero__float--1">
            <div class="icon">🏆</div>
            Marca Empregadora
          </div>
          <div class="hero__float hero__float--2">
            <div class="icon">📣</div>
            Comunicação Interna
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <div class="visual-block"></div>
        <div>
          <p class="section-eyebrow">{{ site.home.highlight.eyebrow }}</p>
          <h2>{{ site.home.highlight.title }}</h2>
          <p class="lead">{{ site.home.highlight.description }}</p>
          <ul class="feature-list">
            <li v-for="benefit in site.home.highlight.benefits" :key="benefit">{{ benefit }}</li>
          </ul>
          <div style="margin-top: 2rem">
            <BaseButton tag="RouterLink" to="/sobre" variant="secondary">Conheça a Purple</BaseButton>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block section-block--alt">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow">{{ SERVICE_OFFER.eyebrow }}</p>
        <h2>{{ SERVICE_OFFER.title }}</h2>
      </div>
      <div class="services-grid">
        <article
          v-for="service in site.home.services.filter((s) => !s.featured)"
          :key="service.id"
          class="service-card"
        >
          <div class="service-card__icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <RouterLink class="text-link" :to="`/servicos#${service.id}`">{{ service.cta }}</RouterLink>
        </article>
        <article
          v-for="service in site.home.services.filter((s) => s.featured)"
          :key="service.id"
          class="service-card service-card--featured"
        >
          <div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <RouterLink class="text-link" :to="`/servicos#${service.id}`" style="color: var(--lime)">{{
              service.cta
            }}</RouterLink>
          </div>
          <div class="service-card__icon">{{ service.icon }}</div>
        </article>
      </div>
      <div style="text-align: center; margin-top: 2.5rem">
        <BaseButton tag="RouterLink" to="/servicos" variant="secondary">Ver todos os serviços</BaseButton>
      </div>
    </BaseContainer>
  </section>

  <section class="panorama-section">
    <BaseContainer>
      <div class="panorama-header">
        <p class="section-eyebrow">{{ site.home.panorama.eyebrow }}</p>
        <h2>{{ site.home.panorama.title }}</h2>
        <p>{{ site.home.panorama.subtitle }}</p>
      </div>

      <!-- Apenas alguns dados mais impactantes -->
      <div class="panorama-grid">
        <div
          v-for="stat in site.home.panorama.stats.slice(0, 3)"
          :key="stat.label"
          class="panorama-card"
          :class="{ 'panorama-card--highlight': stat.highlight }"
        >
          <span class="panorama-card__number"
            >{{ stat.number }}<span>{{ stat.suffix }}</span></span
          >
          <p class="panorama-card__label">{{ stat.label }}</p>
          <p v-if="stat.comparison" class="panorama-card__body">{{ stat.comparison }}</p>
          <span class="panorama-card__source">{{ stat.source }}</span>
        </div>
      </div>

      <hr class="panorama-divider" />

      <div class="panorama-context">
        <div v-for="item in site.home.panorama.context" :key="item.strong" class="panorama-context__item">
          <span class="panorama-context__dot"></span>
          <p class="panorama-context__text">
            <strong>{{ item.strong }}</strong> — {{ item.text }}
          </p>
        </div>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block" style="background: var(--surface); border-top: 1px solid var(--border)">
    <BaseContainer>
      <div
        style="display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; margin-bottom: 2.5rem"
      >
        <div>
          <p class="section-eyebrow">Blog</p>
          <h2 style="margin-bottom: 0">Conteúdos recentes</h2>
        </div>
        <RouterLink class="text-link" to="/blog">Ver todos</RouterLink>
      </div>
      <BlogList :posts="featuredPosts" />
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="section-header section-header--center" style="margin-bottom: 2.5rem">
        <p class="section-eyebrow">Quem somos</p>
        <h2>Um espaço para pessoas,<br />feito por pessoas</h2>
        <p class="lead lead--narrow" style="text-align: center; margin-top: 0.75rem">
          Nascemos inconformados com lideranças que adoecem times e espaços que não integram as pessoas.
        </p>
      </div>
      <div class="team-grid">
        <TeamCard v-for="member in site.home.team" :key="member.name" :member="member" />
      </div>
    </BaseContainer>
  </section>

  <CtaBanner :title="site.home.cta.title" :description="site.home.cta.description" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

import site from '@/data/site.json'
import posts from '@/data/posts.json'
import { POSITIONING_HOOK, SERVICE_OFFER } from '@/content/placeholders'

import { usePageMeta } from '@/composables'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import BlogList from '@/components/blog/BlogList.vue'
import TeamCard from '@/components/ui/TeamCard.vue'

usePageMeta({
  title: 'Purple Comunicação | A mudança é de dentro para fora',
  description:
    'Somos uma empresa que une estratégia e comunicação para transformar o ambiente interno em vantagem competitiva real.',
})

const featuredPosts = posts.slice(0, 3)

// ── Typewriter ────────────────────────────────────────────
const typewriterEl = ref<HTMLElement | null>(null)
const phrases = POSITIONING_HOOK.rotating

let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let timeoutId: ReturnType<typeof setTimeout> | null = null

const SPEEDS = {
  type: 85,
  delete: 35,
  pauseAfter: 4500,
  pauseEmpty: 350,
}

function tick() {
  const el = typewriterEl.value
  if (!el) return

  const current = phrases[phraseIndex]
  if (current === undefined) return

  if (isDeleting) {
    charIndex -= 1
    el.textContent = current.slice(0, charIndex)
    el.classList.remove('is-complete', 'is-paused')

    if (charIndex === 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      el.classList.remove('is-paused')
      timeoutId = setTimeout(tick, SPEEDS.pauseEmpty)
      return
    }

    timeoutId = setTimeout(tick, SPEEDS.delete)
  } else {
    charIndex += 1
    el.textContent = current.slice(0, charIndex)

    if (charIndex === current.length) {
      el.classList.add('is-complete', 'is-paused')
      isDeleting = true
      timeoutId = setTimeout(tick, SPEEDS.pauseAfter)
      return
    }

    timeoutId = setTimeout(tick, SPEEDS.type)
  }
}

onMounted(() => {
  timeoutId = setTimeout(tick, 600)
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>
