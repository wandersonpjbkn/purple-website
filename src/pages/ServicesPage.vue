<template>
  <div>
    <!-- ── Page Hero ──────────────────────────────────── -->
    <section class="page-hero">
      <BaseContainer>
        <p class="section-eyebrow">{{ SERVICE_OFFER.eyebrow }}</p>
        <h1>{{ SERVICE_OFFER.title }}</h1>
        <p class="lead lead--narrow">{{ SERVICE_OFFER.subtitle }}</p>
        <div style="margin-top: 2rem">
          <BaseButton tag="RouterLink" to="/contato">Falar com a Purple</BaseButton>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Detalhamento dos serviços ─────────────────── -->
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

            <div style="margin-top: 2rem">
              <BaseButton tag="RouterLink" to="/contato">Quero este serviço</BaseButton>
            </div>
          </div>

          <div class="service-detail__visual">
            <div class="visual-block" style="min-height: 420px">
              <div class="service-detail__visual-icon">{{ service.icon }}</div>
            </div>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── Diferenciais ───────────────────────────────── -->
    <section class="section-block" style="background: var(--purple-900); border-radius: 0">
      <BaseContainer>
        <div class="section-header section-header--center">
          <p class="section-eyebrow section-eyebrow--lime">Por que a Purple</p>
          <h2 style="color: var(--on-dark)">Uma comunicação saudável começa dentro</h2>
          <p class="lead" style="color: var(--on-dark-muted); text-align: center">
            Acreditamos que uma comunicação eficaz é aquela que começa dentro para então ir para fora.
          </p>
        </div>

        <!-- Usa FeaturePillar com variante dark -->
        <div class="differentials-grid">
          <FeaturePillar
            v-for="diff in site.services.differentials"
            :key="diff.title"
            :icon="diff.icon"
            :title="diff.title"
            :description="diff.description"
            :dark="true"
          />
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
import { usePageMeta } from '@/composables'
import site from '@/data/site.json'
import { SERVICE_OFFER } from '@/content/placeholders'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FeaturePillar from '@/components/ui/FeaturePillar.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Serviços',
  description: 'Conheça as soluções da Purple Comunicação em Employer Branding, Endomarketing e mais.',
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Detalhamento alternado ─────────────────────────────────
.service-detail {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  padding: 4rem 0;
  border-bottom: 1px solid var(--border);

  &:last-child {
    border-bottom: none;
  }

  &--reverse {
    .service-detail__content {
      order: 2;
    }
    .service-detail__visual {
      order: 1;
    }
  }

  @include respond-to(md) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 0;

    &--reverse .service-detail__content,
    &--reverse .service-detail__visual {
      order: unset;
    }
  }
}

.service-detail__icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: inline-block;
}

.service-detail__visual-icon {
  font-size: 4rem;
  opacity: 0.4;
  position: relative;
  z-index: 1;
}

.service-detail__cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;

  @include respond-to(sm) {
    grid-template-columns: 1fr;
  }
}

.detail-heading {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--subtle);
  margin-bottom: 1rem;
}

.process-inline {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;

  li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.875rem;
    color: var(--muted);
    line-height: 1.55;
  }
}

.process-inline__num {
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--purple);
  min-width: 22px;
  margin-top: 0.05rem;
}

// ── Grid de diferenciais ───────────────────────────────────
.differentials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  margin-top: 3rem;

  @include respond-to(md) {
    grid-template-columns: repeat(2, 1fr);
  }
  @include respond-to(sm) {
    grid-template-columns: 1fr;
  }
}
</style>
