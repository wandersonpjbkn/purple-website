<template>
  <div>
    <!-- ── Page Hero ──────────────────────────────────── -->
    <section class="page-hero">
      <BaseContainer>
        <p class="section-eyebrow">Soluções</p>
        <h1>{{ site.services.title }}</h1>
        <p class="lead lead--narrow">{{ site.services.subtitle }}</p>
        <div style="margin-top: 2rem;">
          <BaseButton tag="RouterLink" to="/contato">Falar com a Purple</BaseButton>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Services Detail ───────────────────────────── -->
    <section class="section-block">
      <BaseContainer>
        <div
          v-for="(service, index) in site.services.items"
          :id="service.id"
          :key="service.id"
          class="service-detail"
          :class="{ 'service-detail--reverse': index % 2 !== 0 }"
        >
          <div class="service-detail__content">
            <div class="service-detail__icon">{{ service.icon }}</div>
            <p class="section-eyebrow">{{ service.title }}</p>
            <h2>{{ service.tagline }}</h2>
            <p class="lead">{{ service.description }}</p>

            <div class="service-detail__cols">
              <div>
                <h4 class="detail-heading">Benefícios</h4>
                <ul class="feature-list">
                  <li v-for="benefit in service.benefits" :key="benefit">{{ benefit }}</li>
                </ul>
              </div>
              <div>
                <h4 class="detail-heading">Como trabalhamos</h4>
                <ol class="process-inline">
                  <li v-for="(step, i) in service.process" :key="step">
                    <span class="process-inline__num">{{ String(i + 1).padStart(2, '0') }}</span>
                    {{ step }}
                  </li>
                </ol>
              </div>
            </div>

            <div style="margin-top: 2rem;">
              <BaseButton tag="RouterLink" to="/contato">Quero este serviço</BaseButton>
            </div>
          </div>

          <div class="service-detail__visual">
            <div class="visual-block" style="min-height: 420px;">
              <div class="visual-block__icon">{{ service.icon }}</div>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── FAQ rápido / diferenciais ─────────────────── -->
    <section
      class="section-block"
      style="background: var(--purple-900); border-radius: 0;"
    >
      <BaseContainer>
        <div class="section-header section-header--center">
          <p class="section-eyebrow" style="color: var(--lime);">Por que a Purple</p>
          <h2 style="color: #fff;">Uma comunicação saudável começa dentro</h2>
          <p class="lead" style="color: rgba(255,255,255,0.6); text-align: center;">
            Acreditamos que uma comunicação eficaz é aquela que começa dentro para então ir para fora.
          </p>
        </div>

        <div class="differentials-grid">
          <div v-for="diff in differentials" :key="diff.title" class="differential-card">
            <div class="differential-card__icon">{{ diff.icon }}</div>
            <h3>{{ diff.title }}</h3>
            <p>{{ diff.description }}</p>
          </div>
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
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

import site from '@/data/site.json'

const differentials = [
  {
    icon: '🎯',
    title: 'Foco em pessoas',
    description: 'Nossas soluções são desenhadas colocando os colaboradores no centro de cada decisão estratégica.'
  },
  {
    icon: '🔍',
    title: 'Diagnóstico antes da ação',
    description: 'Não propomos soluções genéricas. Primeiro entendemos profundamente o seu contexto.'
  },
  {
    icon: '📐',
    title: 'Estratégia e execução',
    description: 'Acompanhamos do planejamento à implementação, garantindo consistência em cada etapa.'
  },
  {
    icon: '📊',
    title: 'Resultados mensuráveis',
    description: 'Definimos métricas claras e acompanhamos os indicadores para provar o impacto das ações.'
  },
  {
    icon: '🤝',
    title: 'Parceria de longo prazo',
    description: 'Construímos relações duradouras, adaptando as estratégias conforme a empresa cresce.'
  },
  {
    icon: '💡',
    title: 'Visão multidisciplinar',
    description: 'Unimos marketing, psicologia organizacional e design para soluções mais completas.'
  }
]
</script>

<style scoped>
/* ── Service Detail Alternado ──────────────────────────── */
.service-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  padding: 4rem 0;
  border-bottom: 1px solid var(--border);
}

.service-detail:last-child {
  border-bottom: none;
}

.service-detail--reverse .service-detail__content {
  order: 2;
}

.service-detail--reverse .service-detail__visual {
  order: 1;
}

.service-detail__icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: inline-block;
}

.service-detail__cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.detail-heading {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
  margin-bottom: 1rem;
  font-family: var(--font-body);
}

.process-inline {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.process-inline li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: var(--muted);
  line-height: 1.55;
}

.process-inline__num {
  font-family: var(--font-display);
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--purple);
  min-width: 22px;
  margin-top: 0.05rem;
}

.visual-block__icon {
  font-size: 4rem;
  opacity: 0.4;
  position: relative;
  z-index: 1;
}

/* ── Differentials ──────────────────────────────────────── */
.differentials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 3rem;
}

.differential-card {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  transition: background 0.2s var(--ease);
}

.differential-card:hover {
  background: rgba(255,255,255,0.08);
}

.differential-card__icon {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.differential-card h3 {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.differential-card p {
  color: rgba(255,255,255,0.55);
  font-size: 0.875rem;
  line-height: 1.65;
}

@media (max-width: 900px) {
  .service-detail {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 0;
  }

  .service-detail--reverse .service-detail__content,
  .service-detail--reverse .service-detail__visual {
    order: unset;
  }

  .service-detail__cols {
    grid-template-columns: 1fr;
  }

  .differentials-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .differentials-grid {
    grid-template-columns: 1fr;
  }
}
</style>
