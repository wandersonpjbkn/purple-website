<template>
  <nav
    class="category-filter"
    aria-label="Filtrar por categoria"
    @keydown.esc="close(true)"
  >
    <button
      class="category-filter__pill"
      :class="{ active: !modelValue }"
      :aria-pressed="!modelValue"
      @click="select('')"
    >
      Todos
    </button>

    <!-- Quick access: as categorias mais frequentes (já vêm ordenadas) -->
    <button
      v-for="{ category } in quickCategories"
      :key="category"
      class="category-filter__pill category-filter__pill--quick"
      :class="{ active: modelValue === category }"
      :aria-pressed="modelValue === category"
      @click="select(category)"
    >
      {{ category }}
    </button>

    <div
      ref="dropdownEl"
      class="category-filter__dropdown"
    >
      <button
        ref="triggerEl"
        class="category-filter__pill category-filter__trigger"
        :class="{ active: triggerActive || isOpen }"
        :aria-expanded="isOpen"
        aria-haspopup="true"
        :aria-controls="panelId"
        @click="toggle"
      >
        {{ triggerLabel }}
        <BaseIcon
          name="chevron-down"
          class="category-filter__chevron"
          :class="{ open: isOpen }"
        />
      </button>

      <div
        v-if="isOpen"
        :id="panelId"
        class="category-filter__panel"
        role="group"
        aria-label="Todas as categorias"
      >
        <button
          v-for="{ category, count } in categories"
          :key="category"
          class="category-filter__option"
          :class="{ active: modelValue === category }"
          :aria-pressed="modelValue === category"
          @click="select(category, true)"
        >
          <span>{{ category }}</span>
          <span class="category-filter__count">{{ count }}</span>
        </button>
        <p
          v-if="!categories.length"
          class="category-filter__empty"
        >
          Nenhuma categoria ainda.
        </p>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'

import { onClickOutside } from '@vueuse/core'

import BaseIcon from '@/components/ui/BaseIcon.vue'

import type { CategoryCount } from '@/types/blog'

const props = withDefaults(
  defineProps<{
    categories: CategoryCount[]
    modelValue: string
    quickCount?: number
  }>(),
  { quickCount: 4 }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const isOpen = ref(false)
const dropdownEl = ref<HTMLElement | null>(null)
const triggerEl = ref<HTMLButtonElement | null>(null)
const panelId = useId()

const quickCategories = computed(() => props.categories.slice(0, props.quickCount))
const isQuick = (category: string) => quickCategories.value.some(entry => entry.category === category)

// A category picked inside the dropdown has no visible pill — the trigger
// takes over showing the active state and the selected name.
const triggerActive = computed(() => Boolean(props.modelValue) && !isQuick(props.modelValue))
const triggerLabel = computed(() => (triggerActive.value ? props.modelValue : 'Filtrar'))

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = (restoreFocus = false) => {
  if (!isOpen.value) return
  isOpen.value = false
  if (restoreFocus) triggerEl.value?.focus()
}

const select = (category: string, fromPanel = false) => {
  emit('update:modelValue', category)
  if (fromPanel) close(true)
}

onClickOutside(dropdownEl, () => close())
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

.category-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem;

  // Mobile: uma linha só — Todos + Filtrar (o dropdown lista tudo)
  @include respond-to(sm) {
    flex-wrap: nowrap;
  }
}

.category-filter__pill {
  padding: 0.35rem 0.875rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid transparent;
  background: transparent;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    color: var(--text);
    background: var(--bg-alt);
  }

  &.active {
    background: var(--purple-100);
    color: var(--purple-700);
    border-color: var(--purple-100);
  }
}

.category-filter__pill--quick {
  @include respond-to(sm) {
    display: none;
  }
}

.category-filter__dropdown {
  position: relative;
}

.category-filter__trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.category-filter__chevron {
  width: 14px;
  height: 14px;
  transition: transform 0.15s;

  &.open {
    transform: rotate(180deg);
  }
}

.category-filter__panel {
  position: absolute;
  top: calc(100% + var(--space-2));
  left: 0;
  z-index: 20;
  min-width: 230px;
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.category-filter__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  width: 100%;
  padding: 0.45rem 0.75rem;
  border: none;
  border-radius: var(--radius);
  background: transparent;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--muted);
  text-align: left;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    color: var(--text);
    background: var(--bg-alt);
  }

  &.active {
    background: var(--purple-100);
    color: var(--purple-700);
  }
}

.category-filter__count {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--subtle);
}

.category-filter__empty {
  padding: 0.45rem 0.75rem;
  font-size: 0.85rem;
  color: var(--subtle);
  margin: 0;
}
</style>
