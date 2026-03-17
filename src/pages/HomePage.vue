<template>
  <div>
    <HeroSection v-bind="site.home.hero" />

    <section class="section-block">
      <BaseContainer>
        <div class="split-section">
          <div class="media-placeholder">Imagem circular / destaque</div>
          <div>
            <p class="section-eyebrow">Resultados</p>
            <h2>{{ site.home.highlight.title }}</h2>
            <p class="lead">{{ site.home.highlight.description }}</p>
          </div>
        </div>
      </BaseContainer>
    </section>

    <section class="section-block">
      <BaseContainer>
        <div class="section-heading">
          <p class="section-eyebrow">Soluções</p>
          <h2>Como podemos ajudar</h2>
        </div>

        <div class="cards-grid cards-grid--3">
          <article v-for="service in site.home.services" :key="service.title" class="service-card">
            <div class="service-card__media">Imagem</div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <RouterLink class="text-link" to="/contato">{{ service.cta }}</RouterLink>
          </article>
        </div>
      </BaseContainer>
    </section>

    <section class="section-block">
      <BaseContainer>
        <div class="section-heading">
          <p class="section-eyebrow">Blog</p>
          <h2>Insights e conteúdos recentes</h2>
        </div>
        <BlogList :posts="featuredPosts" />
      </BaseContainer>
    </section>

    <TestimonialsSection :members="site.home.team" />
    <CtaBanner :title="site.home.cta.title" :description="site.home.cta.description" />
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import HeroSection from '@/components/sections/HeroSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import BlogList from '@/components/blog/BlogList.vue'
import site from '@/data/site.json'
import posts from '@/data/posts.json'

const featuredPosts = posts.slice(0, 3)
</script>
