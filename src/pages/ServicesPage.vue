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

    <!-- ── Oferta em validação · cards renderizam placeholders ─ -->
    <section class="section-block">
      <BaseContainer>
        <div class="services-grid">
          <article v-for="(service, i) in SERVICE_OFFER.items" :key="i" class="service-card">
            <div class="service-card__icon">{{ service.icon }}</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
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
import { usePageMeta } from '@/composables'
import { SERVICE_OFFER } from '@/content/placeholders'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'

usePageMeta({
  title: 'Serviços',
  description: 'Conheça as soluções da Purple Comunicação em Employer Branding, Endomarketing e mais.',
})
</script>
