<template>
  <div>

    <!-- ── Hero ──────────────────────────────────────── -->
    <section class="about-hero">
      <BaseContainer>
        <div class="about-hero__inner">
          <div class="about-hero__text">
            <p class="section-eyebrow">Sobre nós</p>
            <h1>Um espaço criado por gente que não se conforma</h1>
            <p class="lead">
              Com lideranças abusivas, espaços que adoecem as pessoas e a falta de integração entre times.
              A Purple nasceu para mudar isso.
            </p>
          </div>
          <div class="about-hero__manifesto">
            <p class="about-manifesto-text">
              "Acreditamos que com uma boa cultura, gestão e profissionais engajados, as empresas podem ir cada vez mais longe."
            </p>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── O que nos move ─────────────────────────────── -->
    <section class="section-block">
      <BaseContainer>
        <div class="split-section">
          <div>
            <p class="section-eyebrow">Nossa crença</p>
            <h2>{{ site.about.helpTitle }}</h2>
            <p class="lead">{{ site.about.helpText }}</p>
            <p style="margin-top: 1rem;">
              Por isso, antes de olhar para fora, ajudamos empresas a olharem para dentro —
              para as pessoas que movem o negócio todos os dias.
            </p>
            <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
              <BaseButton tag="RouterLink" to="/servicos">Ver nossos serviços</BaseButton>
              <BaseButton tag="RouterLink" to="/contato" variant="secondary">Falar com a Purple</BaseButton>
            </div>
          </div>
          <div class="visual-block"></div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Pilares ────────────────────────────────────── -->
    <section class="section-block" style="background:var(--bg-alt);border-top:1px solid var(--border);border-bottom:1px solid var(--border);">
      <BaseContainer>
        <div class="section-header section-header--center">
          <p class="section-eyebrow">Como atuamos</p>
          <h2>Nossa abordagem</h2>
          <p class="lead" style="text-align:center;">
            Cada empresa tem um contexto. Antes de propor qualquer ação,
            entendemos o que está acontecendo de verdade.
          </p>
        </div>
        <div class="about-pillars">
          <div v-for="pillar in site.about.pillars" :key="pillar.title" class="about-pillar">
            <div class="about-pillar__icon" aria-hidden="true">
              {{ pillarIcons[pillar.title] ?? '✦' }}
            </div>
            <h3>{{ pillar.title }}</h3>
            <p>{{ pillar.description }}</p>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Time ───────────────────────────────────────── -->
    <section class="section-block">
      <BaseContainer>
        <div class="section-header section-header--center" style="margin-bottom:3rem;">
          <p class="section-eyebrow">Quem somos</p>
          <h2>As pessoas por trás da Purple</h2>
          <p class="lead" style="text-align:center;">
            A união de uma publicitária/marketeira e de um UX/psicólogo que já trabalharam juntos,
            resultou em uma agência focada em Comunicação Interna, Endomarketing e Employer Branding.
          </p>
        </div>

        <div class="about-team">
          <article v-for="member in site.home.team" :key="member.name" class="about-team-card">
            <div class="about-team-card__avatar" aria-hidden="true">
              {{ member.name.charAt(0) }}
            </div>
            <div class="about-team-card__info">
              <h3>{{ member.name }}</h3>
              <p class="about-team-card__role">{{ member.role }}</p>
              <p>{{ member.bio }}</p>
              <blockquote v-if="member.quote">"{{ member.quote }}"</blockquote>
            </div>
          </article>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Dados de mercado ───────────────────────────── -->
    <section class="about-data-section">
      <BaseContainer>
        <div class="section-header section-header--center">
          <p class="section-eyebrow" style="color:var(--lime);">Por que isso importa</p>
          <h2>O problema que viemos resolver</h2>
          <p style="color:rgba(255,255,255,0.6);text-align:center;max-width:56ch;margin:0 auto;">
            Os números mostram que o mercado ainda tem muito a evoluir no cuidado com as pessoas.
          </p>
        </div>
        <div class="about-data-grid">
          <div v-for="stat in dataStats" :key="stat.number" class="about-data-card">
            <span class="about-data-card__number">
              {{ stat.number }}<span>{{ stat.suffix }}</span>
            </span>
            <p class="about-data-card__label">{{ stat.label }}</p>
            <span class="about-data-card__source">{{ stat.source }}</span>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── CTA ────────────────────────────────────────── -->
    <CtaBanner
      title="Tudo começa com uma boa conversa"
      description="Estamos aqui para ouvir, entender seu contexto e construir juntos uma estratégia que faz sentido."
    />

  </div>
</template>

<script setup lang="ts">
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton    from '@/components/ui/BaseButton.vue'
import CtaBanner     from '@/components/sections/CtaBanner.vue'
import { usePageMeta } from '@/composables'
import site from '@/data/site.json'

usePageMeta({
  title:       'Sobre Nós',
  description: 'Conheça a Purple Comunicação — agência especializada em Employer Branding, Endomarketing e Comunicação Interna, criada por quem acredita em espaços de trabalho mais humanos.',
})

const pillarIcons: Record<string, string> = {
  'Foco no colaborador': '🎯',
  'Comunicação clara':   '📣',
  'Marca empregadora':   '🏆',
}

const dataStats = [
  {
    number: '57', suffix: '%',
    label:  'dos trabalhadores não estão engajados globalmente',
    source: 'Gallup',
  },
  {
    number: '86', suffix: '%',
    label:  'consideram bem-estar tão importante quanto o salário',
    source: 'Pesquisa Global, 2024',
  },
  {
    number: '14', suffix: '%',
    label:  'das empresas oferecem programas estruturados de bem-estar',
    source: 'Panorama Corporativo 2024',
  },
  {
    number: '32', suffix: '%',
    label:  'da PEA sofre de burnout ou problemas de saúde ocupacional',
    source: 'ISMA-Brasil',
  },
]
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Hero ───────────────────────────────────────────────────
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
}

.about-hero__text {
  h1 { font-size: clamp(2rem, 4vw, 3.4rem); }
}

.about-hero__manifesto {
  background: var(--purple-900);
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
  color: #fff;
  line-height: 1.7;
  font-style: italic;
  position: relative;
  z-index: 1;
}

// ── Pilares ────────────────────────────────────────────────
.about-pillars {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 0.5rem;

  @include respond-to(md) { grid-template-columns: 1fr; }
}

.about-pillar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition: box-shadow 0.2s var(--ease), transform 0.2s var(--ease);

  &:hover {
    box-shadow: var(--shadow-glow);
    transform: translateY(-2px);
  }
}

.about-pillar__icon {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  display: block;
}

// ── Time ───────────────────────────────────────────────────
.about-team {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 820px;
  margin: 0 auto;

  @include respond-to(sm) { grid-template-columns: 1fr; }
}

.about-team-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.about-team-card__avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple-100), var(--lime-light));
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--purple-700);
  border: 2px solid var(--border);
  flex-shrink: 0;
}

.about-team-card__info {
  h3 { font-size: 1.15rem; margin-bottom: 0.2rem; }

  p { font-size: 0.9rem; line-height: 1.7; }

  blockquote {
    margin: 1rem 0 0;
    padding: 1rem 1.25rem;
    background: var(--bg-alt);
    border-left: 3px solid var(--lime);
    border-radius: 0 var(--radius) var(--radius) 0;
    font-size: 0.875rem;
    font-style: italic;
    color: var(--muted);
    line-height: 1.65;
  }
}

.about-team-card__role {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 0.5rem;
}

// ── Dados dark ─────────────────────────────────────────────
.about-data-section {
  background: var(--purple-900);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    bottom: -20%; right: -5%;
    width: 400px; aspect-ratio: 1;
    background: radial-gradient(ellipse, rgba(197,226,46,0.08) 0%, transparent 65%);
    pointer-events: none;
  }
}

.about-data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.08);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: 3rem;
  position: relative;
  z-index: 1;

  @include respond-to(lg) { grid-template-columns: repeat(2, 1fr); }
}

.about-data-card {
  background: var(--purple-900);
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.about-data-card__number {
  font-size: 2.8rem;
  font-weight: 800;
  color: #fff;
  line-height: 1;
  letter-spacing: -0.03em;

  span { color: var(--lime); }
}

.about-data-card__label {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.4;
  max-width: 18ch;
}

.about-data-card__source {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.3);
  font-style: italic;
}
</style>
