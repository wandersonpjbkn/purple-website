<template>
  <section class="hero">
    <BaseContainer>
      <!-- Posicionamento em validação (rascunho 🟡) — ver placeholders.ts -->
      <div class="hero__content">
        <div class="hero__kicker">
          <span class="dot"></span>
          {{ POSITIONING_HOOK.eyebrow }}
        </div>

        <h1 class="hero__title">{{ headline }}</h1>

        <p class="lead">{{ POSITIONING_HOOK.subhead }}</p>

        <div class="hero__actions">
          <BaseButton class="button--lg" tag="RouterLink" to="/contato">
            {{ home.hero.primaryCta }}
          </BaseButton>
          <BaseButton class="button--lg" tag="RouterLink" to="/servicos" variant="secondary">
            {{ home.hero.secondaryCta }}
          </BaseButton>
        </div>

        <!-- Linha secundária · urgência / porquê-agora (NR-1) — nunca manchete -->
        <p class="hero__nr1">{{ POSITIONING_HOOK.nr1Line }}</p>

        <!-- stats do hero pendentes de fonte real — não inventar. -->
      </div>
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <div class="visual-block"></div>
        <div>
          <p class="section-eyebrow">{{ home.highlight.eyebrow }}</p>
          <h2>{{ home.highlight.title }}</h2>
          <p class="lead">{{ home.highlight.description }}</p>
          <ul class="feature-list">
            <li v-for="benefit in home.highlight.benefits" :key="benefit">{{ benefit }}</li>
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
      <!-- Oferta em validação · cards renderizam placeholders (placeholders.ts) -->
      <div class="services-grid">
        <article v-for="(service, i) in SERVICE_OFFER.items" :key="i" class="service-card">
          <div class="service-card__icon"><BaseIcon :name="service.icon" /></div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <RouterLink class="text-link" to="/servicos">Ver serviços</RouterLink>
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
        <p class="section-eyebrow">{{ panorama.eyebrow }}</p>
        <h2>{{ panorama.title }}</h2>
        <p>{{ panorama.subtitle }}</p>
      </div>

      <!-- Apenas alguns dados mais impactantes -->
      <div class="panorama-grid">
        <div
          v-for="stat in panorama.stats.slice(0, 3)"
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
        <div v-for="item in panorama.context" :key="item.strong" class="panorama-context__item">
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
      <div class="blog-grid">
        <PostCard v-for="post in featuredPosts" :key="post.slug" :post="post" variant="grid" />
      </div>
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
        <TeamCard v-for="member in team" :key="member.name" :member="member" />
      </div>
    </BaseContainer>
  </section>

  <CtaBanner :title="home.cta.title" :description="home.cta.description" />
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import home from '@/data/home.json'
import panorama from '@/data/panorama.json'
import team from '@/data/team.json'
import { posts } from 'virtual:blog-posts'
import { POSITIONING_HOOK, SERVICE_OFFER } from '@/content/placeholders'

import { usePageMeta } from '@/composables'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import PostCard from '@/components/blog/PostCard.vue'
import TeamCard from '@/components/ui/TeamCard.vue'

usePageMeta({
  // usePageMeta já anexa "| Purple Comunicação"; não repetir a marca aqui.
  title: 'A mudança é de dentro para fora',
  description:
    'Somos uma empresa que une estratégia e comunicação para transformar o ambiente interno em vantagem competitiva real.',
})

const featuredPosts = posts.slice(0, 3)

// Manchete do hero: variante ativa do rascunho (A/B em validação — placeholders.ts).
const headline = POSITIONING_HOOK.headlineVariants[POSITIONING_HOOK.activeHeadline]
</script>
