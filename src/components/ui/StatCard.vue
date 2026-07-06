<template>
  <!--
    Card de estatística sobre fundo escuro (número + sufixo + label [+ body] +
    fonte). Vive dentro de um `.stat-grid` (layout hairline, em _stats.scss),
    reusado pela Home (panorama) e pela Sobre (dados de mercado).
  -->
  <div class="stat-card" :class="{ 'stat-card--highlight': highlight }">
    <span class="stat-card__number">{{ number }}<span v-if="suffix">{{ suffix }}</span></span>
    <p class="stat-card__label">{{ label }}</p>
    <p v-if="body" class="stat-card__body">{{ body }}</p>
    <span v-if="source" class="stat-card__source">{{ source }}</span>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Valor principal (ex.: "86"). */
    number: string | number
    /** Sinal/sufixo renderizado em lime (ex.: "%", "x"). */
    suffix?: string
    /** Descrição curta do dado. */
    label: string
    /** Texto de contexto opcional (ex.: comparação do panorama). */
    body?: string
    /** Fonte do dado (compromisso editorial). */
    source?: string
    /** Destaca a célula (dado-chave). */
    highlight?: boolean
  }>(),
  { suffix: '', body: '', source: '', highlight: false },
)
</script>

<style scoped lang="scss">
.stat-card {
  background: var(--section-dark-2);
  padding: var(--space-8);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);

  // Célula destacada (ex.: o dado-chave do panorama).
  &--highlight {
    background: rgba(var(--lime-rgb), 0.08);
  }

  &__number {
    font-size: var(--text-3xl);
    font-weight: 800;
    color: var(--on-dark);
    line-height: 1;
    letter-spacing: -0.03em;

    // Convenção de marca: valor em texto padrão, sinal/sufixo em lime.
    span {
      color: var(--lime);
    }
  }

  &__label {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--on-dark-strong);
    line-height: 1.4;
    max-width: 22ch;
  }

  &__body {
    font-size: var(--text-sm);
    color: var(--on-dark-muted);
    line-height: 1.6;
    max-width: 34ch;
  }

  &__source {
    font-size: var(--text-xs);
    color: var(--on-dark-subtle);
    font-style: italic;
    margin-top: var(--space-1);
  }
}
</style>
