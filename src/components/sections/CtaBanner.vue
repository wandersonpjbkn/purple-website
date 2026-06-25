<template>
  <section class="cta-banner">
    <BaseContainer>
      <div class="cta-banner__box">
        <div>
          <p class="section-eyebrow section-eyebrow--lime">Próximo passo</p>
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
        <div class="cta-banner__actions">
          <BaseButton class="button lime button--lg" tag="RouterLink" to="/contato">Vamos conversar</BaseButton>
          <a
            :href="phoneNumber"
            target="_blank"
            class="text-link"
            style="color: var(--on-dark-muted); font-size: 0.875rem"
          >
            ou chame no WhatsApp
          </a>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'

defineProps<{
  title: string
  description: string
}>()

const phoneNumber = computed(() => `https://wa.me/${import.meta.env.VITE_BASE_PHONE}`)
</script>
