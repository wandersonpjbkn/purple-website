<template>
  <nav class="blog-pagination" aria-label="Paginação">
    <button
      class="pagination-btn"
      :disabled="page === 1"
      aria-label="Página anterior"
      @click="$emit('change', page - 1)"
    >
      ← Anterior
    </button>

    <div class="pagination-pages">
      <template v-for="n in displayedPages" :key="n">
        <span v-if="n === '...'" class="pagination-ellipsis">…</span>
        <button
          v-else
          class="pagination-btn pagination-btn--page"
          :class="{ active: n === page }"
          :aria-label="`Página ${n}`"
          :aria-current="n === page ? 'page' : undefined"
          @click="$emit('change', n as number)"
        >
          {{ n }}
        </button>
      </template>
    </div>

    <button
      class="pagination-btn"
      :disabled="page === totalPages"
      aria-label="Próxima página"
      @click="$emit('change', page + 1)"
    >
      Próxima →
    </button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  totalPages: number
}>()

defineEmits<{ change: [page: number] }>()

// Exibe no máximo 7 páginas com ellipsis
const displayedPages = computed(() => {
  const { page, totalPages } = props
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)

  const pages: (number | '...')[] = [1]
  if (page > 3) pages.push('...')
  for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
    pages.push(i)
  }
  if (page < totalPages - 2) pages.push('...')
  pages.push(totalPages)
  return pages
})
</script>

<style scoped lang="scss">
.blog-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
}

.pagination-pages {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.pagination-ellipsis {
  color: var(--subtle);
  font-size: 0.875rem;
  padding: 0 0.25rem;
}

.pagination-btn {
  height: 40px;
  padding: 0 1rem;
  border-radius: var(--radius-pill);
  border: 1.5px solid var(--border);
  background: transparent;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) {
    border-color: var(--purple-400);
    color: var(--purple);
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  &--page {
    width: 40px;
    padding: 0;
    display: grid;
    place-items: center;
    font-size: 0.82rem;
  }

  &.active {
    background: var(--purple);
    border-color: var(--purple);
    color: var(--on-dark);
  }
}
</style>
