<template>
  <div
    ref="rootEl"
    class="combobox"
    @keydown.esc="closeAndRevert"
  >
    <input
      ref="inputEl"
      :value="query"
      type="text"
      class="combobox__input"
      role="combobox"
      autocomplete="off"
      aria-required="true"
      aria-haspopup="listbox"
      aria-autocomplete="list"
      :placeholder="placeholder"
      :aria-expanded="isOpen"
      :aria-controls="listboxId"
      :aria-activedescendant="activeOptionId"
      :aria-invalid="error"
      :aria-describedby="describedBy"
      :class="{ 'field__input--error': error }"
      @focus="onFocus"
      @input="onInput"
      @keydown.down.prevent="highlightNext"
      @keydown.up.prevent="highlightPrev"
      @keydown.enter.prevent="selectHighlighted"
    />
    <BaseIcon
      name="chevron-down"
      class="combobox__chevron"
      :class="{ open: isOpen }"
    />

    <ul
      v-if="isOpen"
      :id="listboxId"
      class="combobox__listbox"
      role="listbox"
    >
      <li
        v-for="(option, index) in filteredOptions"
        :id="optionId(index)"
        :key="option"
        class="combobox__option"
        role="option"
        :aria-selected="option === modelValue"
        :class="{ highlighted: index === highlightedIndex }"
        @mousedown.prevent="select(option)"
        @mouseenter="highlightedIndex = index"
      >
        {{ option }}
      </li>
      <li
        v-if="!filteredOptions.length"
        class="combobox__empty"
      >
        Nenhum resultado
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, useId } from 'vue'
import { onClickOutside } from '@vueuse/core'

import BaseIcon from '@/components/ui/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: string[]
    placeholder?: string
    error?: boolean
    describedBy?: string
  }>(),
  { placeholder: 'Selecione uma opção', error: false, describedBy: undefined }
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)
const listboxId = useId()

const query = ref(props.modelValue)
const isOpen = ref(false)
const hasTyped = ref(false)
const highlightedIndex = ref(-1)

const filteredOptions = computed(() => {
  if (!hasTyped.value) return props.options
  const term = query.value.trim().toLowerCase()
  if (!term) return props.options
  return props.options.filter(option => option.toLowerCase().includes(term))
})

const optionId = (index: number) => `${listboxId}-option-${index}`
const activeOptionId = computed(() =>
  isOpen.value && highlightedIndex.value >= 0 ? optionId(highlightedIndex.value) : undefined
)

const onFocus = () => {
  isOpen.value = true
  hasTyped.value = false
  highlightedIndex.value = Math.max(props.options.indexOf(props.modelValue), 0)
}

const onInput = (event: Event) => {
  query.value = (event.target as HTMLInputElement).value
  hasTyped.value = true
  isOpen.value = true
  highlightedIndex.value = 0
}

const closeAndRevert = () => {
  isOpen.value = false
  hasTyped.value = false
  query.value = props.modelValue
}

// Focus never leaves the input when selecting (mousedown.prevent on the options
// blocks blur), so calling .focus() here is unnecessary — and counterproductive:
// it would re-fire the focus event and reopen the list that just closed.
const select = (option: string) => {
  query.value = option
  isOpen.value = false
  hasTyped.value = false
  emit('update:modelValue', option)
}

const selectHighlighted = () => {
  if (!isOpen.value) {
    onFocus()
    return
  }
  const option = filteredOptions.value[highlightedIndex.value]
  if (option) select(option)
}

const highlightNext = () => {
  if (!isOpen.value) {
    onFocus()
    return
  }
  if (!filteredOptions.value.length) return
  highlightedIndex.value = (highlightedIndex.value + 1) % filteredOptions.value.length
}

const highlightPrev = () => {
  if (!isOpen.value) {
    onFocus()
    return
  }
  if (!filteredOptions.value.length) return
  highlightedIndex.value = (highlightedIndex.value - 1 + filteredOptions.value.length) % filteredOptions.value.length
}

// Syncs with external changes (prefill from the route query, clearForm()).
watch(
  () => props.modelValue,
  value => {
    query.value = value
  }
)

onClickOutside(rootEl, () => {
  if (isOpen.value) closeAndRevert()
})

defineExpose({
  focus: () => inputEl.value?.focus(),
})
</script>

<style scoped lang="scss">
.combobox {
  position: relative;
}

.combobox__input {
  padding-right: var(--space-10);
}

.combobox__chevron {
  position: absolute;
  top: 50%;
  right: var(--space-4);
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--subtle);
  pointer-events: none;
  transition: transform 0.15s var(--ease);

  &.open {
    transform: translateY(-50%) rotate(180deg);
  }
}

.combobox__listbox {
  position: absolute;
  top: calc(100% + var(--space-2));
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: var(--space-2);
  margin: 0;
  list-style: none;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.combobox__option {
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;

  &.highlighted {
    background: var(--bg-alt);
    color: var(--text);
  }

  &[aria-selected='true'] {
    background: var(--purple-100);
    color: var(--purple-700);
  }
}

.combobox__empty {
  padding: 0.55rem 0.75rem;
  font-size: var(--text-sm);
  color: var(--subtle);
}
</style>
