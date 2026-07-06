<template>
  <div>
    <PageHero
      eyebrow="Legal"
      title="Política de Privacidade"
      subtitle="Como a Purple Comunicação trata os seus dados, em conformidade com a LGPD."
    >
      <p class="privacy-updated">Última atualização: {{ formatDate(privacy.updatedAt) }}</p>
    </PageHero>

    <section class="section-block section-block--sm">
      <BaseContainer>
        <div class="privacy-doc">
          <p class="privacy-intro">{{ privacy.intro }}</p>

          <section v-for="block in privacy.sections" :key="block.title" class="privacy-block">
            <h2>{{ block.title }}</h2>
            <p v-for="(para, i) in block.paragraphs" :key="i">{{ para }}</p>
          </section>

          <p class="privacy-contact">
            <RouterLink class="text-link" to="/contato">Falar com a Purple sobre privacidade</RouterLink>
          </p>
        </div>
      </BaseContainer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import { formatDate, usePageMeta } from '@/composables'
import privacy from '@/data/privacy.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import PageHero from '@/components/sections/PageHero.vue'

usePageMeta({
  title: 'Política de Privacidade',
  description: 'Como a Purple Comunicação coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.privacy-updated {
  margin-top: var(--space-4);
  font-size: var(--text-sm);
  color: var(--subtle);
}

.privacy-doc {
  max-width: 760px;
}

.privacy-intro {
  font-size: var(--text-lead);
  color: var(--muted);
  line-height: 1.75;
  margin-bottom: var(--space-10);
}

.privacy-block {
  margin-bottom: var(--space-10);

  h2 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-4);
  }

  p {
    color: var(--muted);
    line-height: 1.75;
    margin-bottom: var(--space-4);
    max-width: 68ch;
  }
}

.privacy-contact {
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 1px solid var(--border);
}
</style>
