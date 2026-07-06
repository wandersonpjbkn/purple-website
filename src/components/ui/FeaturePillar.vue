<template>
  <div class="feature-pillar" :class="{ 'feature-pillar--dark': dark }">
    <span class="feature-pillar__icon"><BaseIcon :name="icon" /></span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import BaseIcon from '@/components/ui/BaseIcon.vue'

withDefaults(
  defineProps<{
    icon: string
    title: string
    description: string
    dark?: boolean
  }>(),
  { dark: false },
)
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.feature-pillar {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
  transition:
    box-shadow 0.2s var(--ease),
    transform 0.2s var(--ease);

  &:hover {
    box-shadow: var(--shadow-glow);
    transform: translateY(-2px);
  }

  // ── Variante dark (Abordagem "Por que a Purple") ────────
  &--dark {
    background: var(--on-dark-surface);
    border-color: var(--on-dark-border);

    &:hover {
      background: var(--on-dark-border);
    }

    // Ícone em lime sobre fundo escuro — antes herdava --text (escuro
    // sobre escuro). Lime é cor de marca co-titular, usada aqui como destaque.
    .feature-pillar__icon {
      color: var(--lime);
    }

    h3 {
      color: var(--on-dark);
    }
    p {
      color: var(--on-dark-muted);
    }
  }
}

.feature-pillar__icon {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  display: block;
  // Contexto claro (default): ícone em roxo da marca.
  color: var(--purple);
}

h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}
p {
  font-size: 0.875rem;
  line-height: 1.65;
}
</style>
