<template>
  <section class="hero">
    <BaseContainer>
      <div class="hero__grid">
        <div>
          <p class="section-eyebrow">{{ eyebrow }}</p>
          <h1>{{ title }}</h1>
          <p class="lead">{{ subtitle }}</p>
          <div class="hero__actions">
            <BaseButton tag="RouterLink" to="/contato">{{ primaryCta }}</BaseButton>
            <BaseButton v-if="secondaryCta" tag="RouterLink" to="/sobre" variant="secondary">{{ secondaryCta }}</BaseButton>
          </div>
        </div>
        <div class="hero__media" aria-hidden="true">
          <span>Imagem / destaque do projeto</span>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'

defineProps<{
  eyebrow?: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta?: string
}>()
</script>
