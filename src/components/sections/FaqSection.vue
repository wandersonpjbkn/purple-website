<template>
  <section class="faq-section" :class="{ 'faq-section--alt': alt }">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow">{{ faq.eyebrow }}</p>
        <h2>{{ title || faq.title }}</h2>
        <p v-if="faq.subtitle" class="lead lead--narrow" style="text-align: center; margin: 0.75rem auto 0">
          {{ faq.subtitle }}
        </p>
      </div>

      <ul class="faq-list">
        <li v-for="(item, i) in faq.items" :key="item.question" class="faq-item">
          <h3 class="faq-item__q">
            <button
              :id="`faq-trigger-${i}`"
              type="button"
              class="faq-item__trigger"
              :aria-expanded="open === i"
              :aria-controls="`faq-panel-${i}`"
              @click="toggle(i)"
            >
              <span>{{ item.question }}</span>
              <span class="faq-item__chevron" aria-hidden="true"></span>
            </button>
          </h3>
          <div
            v-show="open === i"
            :id="`faq-panel-${i}`"
            class="faq-item__a"
            role="region"
            :aria-labelledby="`faq-trigger-${i}`"
          >
            <p>{{ item.answer }}</p>
          </div>
        </li>
      </ul>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import faq from '@/data/faq.json'
import BaseContainer from '@/components/ui/BaseContainer.vue'

withDefaults(
  defineProps<{
    /** Sobrescreve o título vindo do JSON (ex.: em página vs. seção). */
    title?: string
    /** Fundo alternativo (--bg-alt) quando embutido em outra página. */
    alt?: boolean
  }>(),
  { title: '', alt: false },
)

// Acordeão de item único aberto por vez; -1 = todos fechados.
const open = ref(-1)
const toggle = (i: number) => {
  open.value = open.value === i ? -1 : i
}
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.faq-section {
  padding: var(--space-16) 0;

  &--alt {
    background: var(--bg-alt);
  }
}

.faq-list {
  list-style: none;
  padding: 0;
  max-width: 760px;
  margin: var(--space-12) auto 0;
  display: grid;
  gap: var(--space-3);
}

.faq-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: border-color 0.15s;

  &:hover {
    border-color: var(--purple-100);
  }
}

.faq-item__q {
  margin: 0;
  font-size: inherit;
}

.faq-item__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--text);

  &:hover {
    color: var(--purple);
  }
}

.faq-item__chevron {
  width: 12px;
  height: 12px;
  border-right: 2px solid var(--purple);
  border-bottom: 2px solid var(--purple);
  transform: rotate(45deg);
  transition: transform 0.2s var(--ease);
  flex-shrink: 0;

  .faq-item__trigger[aria-expanded='true'] & {
    transform: rotate(-135deg);
  }
}

.faq-item__a {
  padding: 0 var(--space-6) var(--space-5);

  p {
    color: var(--muted);
    line-height: 1.7;
    font-size: var(--text-sm);
    margin: 0;
    max-width: 62ch;
  }
}
</style>
