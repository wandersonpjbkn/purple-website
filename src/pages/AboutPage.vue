<template>
  <div>
    <section class="page-hero page-hero--simple">
      <BaseContainer>
        <p class="section-eyebrow">Sobre</p>
        <h1>{{ site.about.title }}</h1>
        <p class="lead narrow">{{ site.about.intro }}</p>
      </BaseContainer>
    </section>

    <TestimonialsSection :members="site.home.team" />

    <section class="section-block">
      <BaseContainer>
        <div class="split-section">
          <div>
            <p class="section-eyebrow">Apoio estratégico</p>
            <h2>{{ site.about.helpTitle }}</h2>
            <p class="lead">{{ site.about.helpText }}</p>
          </div>
          <div class="media-placeholder media-placeholder--circle">Imagem</div>
        </div>

        <div class="cards-grid cards-grid--3 top-gap">
          <article v-for="pillar in site.about.pillars" :key="pillar.title" class="feature-card">
            <div class="icon-placeholder">•</div>
            <h3>{{ pillar.title }}</h3>
            <p>{{ pillar.description }}</p>
          </article>
        </div>
      </BaseContainer>
    </section>

    <CtaBanner
      title="Tudo começa com uma boa conversa"
      description="Estamos aqui para falar, mas também para ouvir. Vamos marcar um café?"
    />
  </div>
</template>

<script setup lang="ts">
import BaseContainer from '@/components/ui/BaseContainer.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import site from '@/data/site.json'
</script>
