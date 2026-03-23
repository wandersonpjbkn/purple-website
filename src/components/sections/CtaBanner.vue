<template>
  <section class="cta-banner">
    <BaseContainer>
      <div class="cta-banner__box">
        <div>
          <p class="section-eyebrow" style="color: var(--lime);">Próximo passo</p>
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
        <div class="cta-banner__actions">
          <BaseButton class="button lime button--lg" tag="RouterLink" to="/contato">Vamos conversar</BaseButton>
          <a href="https://wa.me/5519991018383" target="_blank" class="text-link" style="color: rgba(255,255,255,0.65); font-size: 0.875rem;">
            ou chame no WhatsApp
          </a>
        </div>
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
