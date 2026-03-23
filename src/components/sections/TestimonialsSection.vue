<template>
  <section class="section-block">
    <BaseContainer>
      <div class="section-heading">
        <p class="section-eyebrow">Equipe</p>
        <h2>Também somos pessoas</h2>
      </div>

      <div class="testimonials-grid">
        <article v-for="member in members" :key="member.name" class="testimonial-card">
          <div class="avatar-placeholder">{{ member.name.charAt(0) }}</div>
          <h3>{{ member.name }}</h3>
          <p>{{ member.bio }}</p>
          <blockquote v-if="member.quote">“{{ member.quote }}”</blockquote>
        </article>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import type { TeamMember } from '@/types/site'

import BaseContainer from '@/components/ui/BaseContainer.vue'

defineProps<{
  members: TeamMember[]
}>()
</script>
