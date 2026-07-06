<template>
  <section class="notfound">
    <BaseContainer>
      <div class="notfound__inner">
        <p class="notfound__code">404</p>
        <h1>Esta página saiu de cena</h1>
        <p class="lead lead--narrow" style="margin-inline: auto">
          O link pode estar quebrado ou a página foi movida. Mas a conversa continua — veja por onde seguir.
        </p>
        <div class="notfound__actions">
          <BaseButton tag="RouterLink" to="/">Voltar para a Home</BaseButton>
          <BaseButton tag="RouterLink" to="/servicos" variant="secondary">Ver serviços</BaseButton>
          <BaseButton tag="RouterLink" to="/blog" variant="ghost">Ir para o blog</BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { usePageMeta } from '@/composables'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

usePageMeta({
  title: 'Página não encontrada',
  description: 'A página que você procura não existe ou foi movida.',
})
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.notfound {
  padding: var(--space-20) 0;
  text-align: center;
}

.notfound__inner {
  max-width: 640px;
  margin: 0 auto;
}

.notfound__code {
  font-size: clamp(4rem, 12vw, 7rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(120deg, var(--purple), var(--lime));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: var(--space-4);
}

.notfound__actions {
  margin-top: var(--space-8);
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}
</style>
