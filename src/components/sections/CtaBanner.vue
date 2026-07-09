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
          <BaseButton
            variant="lime"
            class="button--lg"
            tag="a"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click="trackWhatsappClick(origin)"
          >
            {{ primaryLabel }}
          </BaseButton>
          <BaseButton
            variant="secondary"
            class="button--lg on-dark"
            tag="RouterLink"
            to="/contato"
          >
            {{ secondaryLabel }}
          </BaseButton>
          <RouterLink
            v-if="contentTo"
            :to="contentTo"
            class="text-link cta-banner__content-link"
          >
            {{ contentLabel }}
          </RouterLink>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import { useWhatsappUrl, useCtaTracking } from '@/composables'

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    whatsappMessage: string
    eyebrow?: string
    primaryLabel?: string
    secondaryLabel?: string
    contentTo?: string
    contentLabel?: string
    gtmOrigin?: string
  }>(),
  {
    eyebrow: 'Próximo passo',
    primaryLabel: 'Vamos conversar',
    secondaryLabel: 'Enviar mensagem',
    contentTo: '',
    contentLabel: '',
    gtmOrigin: '',
  }
)

const route = useRoute()
const origin = computed(() => props.gtmOrigin || String(route.name ?? route.path))

const whatsappUrl = useWhatsappUrl(computed(() => props.whatsappMessage))
const { trackWhatsappClick } = useCtaTracking()
</script>
