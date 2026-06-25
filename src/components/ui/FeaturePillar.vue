<template>
  <div class="feature-pillar" :class="{ 'feature-pillar--dark': dark }">
    <span class="feature-pillar__icon" aria-hidden="true">{{ icon }}</span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
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

  // ── Variante dark (ServicesPage diferenciais) ───────────
  &--dark {
    background: var(--on-dark-surface);
    border-color: var(--on-dark-border);

    &:hover {
      background: var(--on-dark-border);
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
