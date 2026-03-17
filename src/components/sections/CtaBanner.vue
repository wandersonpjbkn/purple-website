<template>
  <section class="cta-banner">
    <BaseContainer>
      <div class="cta-banner__box">
        <div>
          <p class="section-eyebrow">Próximo passo</p>
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
        <BaseButton tag="RouterLink" to="/contato">Vamos conversar</BaseButton>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'

defineProps<{
  title: string
  description: string
}>()
</script>
