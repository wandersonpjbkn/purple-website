<template>
  <section class="cta-banner">
    <BaseContainer>
      <div class="cta-banner__box">
        <div>
          <p class="section-eyebrow section-eyebrow--lime">{{ eyebrow }}</p>
          <h2>{{ title }}</h2>
          <p>{{ description }}</p>
        </div>
        <div class="cta-banner__actions">
          <BaseButton variant="lime" class="button--lg" tag="RouterLink" :to="primaryTo">
            {{ primaryLabel }}
          </BaseButton>

          <!-- Ação secundária opcional (ex.: → /servicos), para o CTA não ser
               um beco sem saída único. -->
          <BaseButton
            v-if="secondaryTo"
            variant="secondary"
            class="button--lg on-dark"
            tag="RouterLink"
            :to="secondaryTo"
          >
            {{ secondaryLabel }}
          </BaseButton>

          <a :href="phoneNumber" target="_blank" class="text-link cta-banner__whatsapp">
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

// Props opcionais mantêm o comportamento antigo (CTA único → /contato) como
// default; `secondaryTo` destrava a ponte para Serviços em Abordagem e Blog.
withDefaults(
  defineProps<{
    title: string
    description: string
    eyebrow?: string
    primaryTo?: string
    primaryLabel?: string
    secondaryTo?: string
    secondaryLabel?: string
  }>(),
  {
    eyebrow: 'Próximo passo',
    primaryTo: '/contato',
    primaryLabel: 'Vamos conversar',
    secondaryTo: '',
    secondaryLabel: 'Ver serviços',
  },
)

const phoneNumber = computed(() => `https://wa.me/${import.meta.env.VITE_BASE_PHONE}`)
</script>
