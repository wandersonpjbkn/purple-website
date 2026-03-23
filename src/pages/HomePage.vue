<template>
  <section class="hero">
    <BaseContainer>
      <div class="hero__grid">

        <!-- Coluna texto -->
        <div>
          <div class="hero__kicker">
            <span class="dot"></span>
            {{ site.home.hero.eyebrow }}
          </div>

          <h1 class="hero__title">
            <span v-html="site.home.hero.titlePrefix" />
            <br>
            <span ref="typewriterEl" class="hero__typewriter" />
          </h1>

          <p class="lead">{{ site.home.hero.subtitle }}</p>

          <div class="hero__actions">
            <BaseButton class="button--lg" tag="RouterLink" to="/contato">
              {{ site.home.hero.primaryCta }}
            </BaseButton>
            <BaseButton class="button--lg" tag="RouterLink" to="/servicos" variant="secondary">
              {{ site.home.hero.secondaryCta }}
            </BaseButton>
          </div>

          <!-- 3 stats compactos abaixo das CTAs -->
          <div class="hero__stat">
            <div>
              <div class="hero__stat-number">57<span style="color:var(--lime)">%</span></div>
              <div class="hero__stat-label">sem engajamento no trabalho</div>
            </div>
            <div class="hero__stat-divider"></div>
            <div>
              <div class="hero__stat-number">4<span style="color:var(--lime)">x</span></div>
              <div class="hero__stat-label">mais produtivas com boa cultura</div>
            </div>
            <div class="hero__stat-divider"></div>
            <div>
              <div class="hero__stat-number">17<span style="color:var(--lime)">%</span></div>
              <div class="hero__stat-label">mais receita com engajamento</div>
            </div>
          </div>
        </div>

        <!-- Coluna card visual -->
        <div class="hero__media">
          <div class="hero__card">
            <div class="hero__card-label">Nível de engajamento</div>
            <div class="hero__card-value">+43<span style="color:var(--lime);font-size:1.8rem">%</span></div>
            <div class="hero__card-sub">após 6 meses de endomarketing estruturado</div>
            <div class="hero__card-bar">
              <div class="hero__card-bar-fill" style="width: 78%"></div>
            </div>
            <div class="hero__card-tags">
              <span class="hero__card-tag accent">Employer Branding</span>
              <span class="hero__card-tag">Endomarketing</span>
              <span class="hero__card-tag">Comunicação Interna</span>
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
          <div style="margin-top: 2rem;">
            <BaseButton tag="RouterLink" to="/sobre" variant="secondary">Conheça a Purple</BaseButton>
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>

  <!-- ══════════════════════════════════════════════════
       SERVIÇOS
       Heurística: grid 3+1 mantido. Título mais direto.
       Removido subtítulo redundante com a descrição dos cards.
  ═══════════════════════════════════════════════════ -->
  <section class="section-block" style="background:var(--bg-alt);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow">Soluções</p>
        <h2>O que fazemos pela sua empresa</h2>
      </div>
      <div class="services-grid">
        <article
          v-for="service in site.home.services.filter(s => !s.featured)"
          :key="service.id"
          class="service-card"
        >
          <div class="service-card__icon">{{ service.icon }}</div>
          <h3>{{ service.title }}</h3>
          <p>{{ service.description }}</p>
          <RouterLink class="text-link" :to="`/servicos#${service.id}`">{{ service.cta }}</RouterLink>
        </article>
        <article
          v-for="service in site.home.services.filter(s => s.featured)"
          :key="service.id"
          class="service-card service-card--featured"
        >
          <div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <RouterLink class="text-link" :to="`/servicos#${service.id}`" style="color:var(--lime)">{{ service.cta }}</RouterLink>
          </div>
          <div class="service-card__icon">{{ service.icon }}</div>
        </article>
      </div>
      <div style="text-align:center;margin-top:2.5rem;">
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
          <span class="panorama-card__number">{{ stat.number }}<span>{{ stat.suffix }}</span></span>
          <p class="panorama-card__label">{{ stat.label }}</p>
          <p v-if="stat.comparison" class="panorama-card__body">{{ stat.comparison }}</p>
          <span class="panorama-card__source">{{ stat.source }}</span>
        </div>
      </div>

      <hr class="panorama-divider" />

      <div class="panorama-context">
        <div
          v-for="item in site.home.panorama.context"
          :key="item.strong"
          class="panorama-context__item"
        >
          <span class="panorama-context__dot"></span>
          <p class="panorama-context__text">
            <strong>{{ item.strong }}</strong> — {{ item.text }}
          </p>
        </div>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <div>
          <p class="section-eyebrow">{{ site.home.process.eyebrow }}</p>
          <h2>{{ site.home.process.title }}</h2>
          <p class="lead">Cada empresa tem um contexto único. Antes de propor qualquer ação, entendemos profundamente o seu negócio.</p>
          <div style="margin-top:2rem;">
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

  <section class="section-block" style="background:var(--surface);border-top:1px solid var(--border);">
    <BaseContainer>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;margin-bottom:2.5rem;">
        <div>
          <p class="section-eyebrow">Blog</p>
          <h2 style="margin-bottom:0;">Conteúdos recentes</h2>
        </div>
        <RouterLink class="text-link" to="/blog">Ver todos</RouterLink>
      </div>
      <BlogList :posts="featuredPosts" />
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="section-header section-header--center" style="margin-bottom:2.5rem;">
        <p class="section-eyebrow">Quem somos</p>
        <h2>Um espaço para pessoas,<br>feito por pessoas</h2>
        <p class="lead lead--narrow" style="text-align:center;margin-top:0.75rem;">
          Nascemos inconformados com lideranças que adoecem times e espaços que não integram as pessoas.
        </p>
      </div>
      <div class="team-grid">
        <article v-for="member in site.home.team" :key="member.name" class="team-card">
          <div class="team-card__avatar">{{ member.name.charAt(0) }}</div>
          <h3>{{ member.name }}</h3>
          <p class="team-card__role">{{ member.role }}</p>
          <p style="font-size:0.9rem;">{{ member.bio }}</p>
          <blockquote v-if="member.quote">"{{ member.quote }}"</blockquote>
        </article>
      </div>
    </BaseContainer>
  </section>

  <CtaBanner :title="site.home.cta.title" :description="site.home.cta.description" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import BlogList from '@/components/blog/BlogList.vue'

import site from '@/data/site.json'
import posts from '@/data/posts.json'

const featuredPosts = posts.slice(0, 3)

// ── Typewriter ────────────────────────────────────────────
const typewriterEl = ref<HTMLElement | null>(null)
const phrases = site.home.hero.titleRotating

let phraseIndex  = 0
let charIndex    = 0
let isDeleting   = false
let timeoutId: ReturnType<typeof setTimeout> | null = null

/**
 * Velocidades (ms):
 *   typeSpeed   → tempo entre cada letra sendo digitada
 *   deleteSpeed → tempo entre cada letra sendo apagada
 *   pauseAfter  → pausa depois que termina de digitar
 *   pauseEmpty  → pausa quando o campo está vazio
 */
const SPEEDS = {
  type:        65,
  delete:      35,
  pauseAfter: 3500,
  pauseEmpty:  350,
}

function tick() {
  const el = typewriterEl.value
  if (!el) return

  const current = phrases[phraseIndex]

  if (isDeleting) {
    // Apaga uma letra
    charIndex--
    el.textContent = current.slice(0, charIndex)
    el.classList.remove('is-complete', 'is-paused')

    if (charIndex === 0) {
      // Acabou de apagar — pausa antes de digitar a próxima
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      el.classList.remove('is-paused')
      timeoutId = setTimeout(tick, SPEEDS.pauseEmpty)
      return
    }

    timeoutId = setTimeout(tick, SPEEDS.delete)

  } else {
    // Digita uma letra
    charIndex++
    el.textContent = current.slice(0, charIndex)

    if (charIndex === current.length) {
      // Terminou de digitar — acende sublinhado e pausa
      el.classList.add('is-complete', 'is-paused')
      isDeleting = true
      timeoutId = setTimeout(tick, SPEEDS.pauseAfter)
      return
    }

    timeoutId = setTimeout(tick, SPEEDS.type)
  }
}

onMounted(() => {
  // Pequeno delay para não começar imediatamente
  timeoutId = setTimeout(tick, 600)
})

onUnmounted(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>
