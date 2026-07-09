<template>
  <component
    :is="LogoSvg"
    v-if="LogoSvg"
    class="brand-logo"
    role="img"
    aria-label="Purple Comunicação"
  />
  <span
    v-else
    class="brand-wordmark"
    aria-label="Purple Comunicação"
  >
    <span class="brand-wordmark__ppl">ppl</span><span class="brand-wordmark__dot">.</span
    ><span class="brand-wordmark__sub">comunicação</span>
  </span>
</template>

<script setup lang="ts">
import LogoSvg from '@/assets/brand/logo-ppl.svg?component'
</script>

<style scoped>
.brand-logo {
  height: var(--brand-logo-height, 30px);
  width: auto;
  display: block;
}

.brand-wordmark {
  display: inline-flex;
  align-items: baseline;
  line-height: 1;
  font-family: var(--font);
}
.brand-wordmark__ppl {
  font-weight: 800;
  font-size: 1.35rem;
  color: var(--purple);
  letter-spacing: -0.04em;
}
.brand-wordmark__dot {
  font-weight: 800;
  font-size: 1.35rem;
  color: var(--lime-dark);
  margin-left: 1px;
}
.brand-wordmark__sub {
  font-weight: 500;
  font-size: 0.72rem;
  color: var(--subtle);
  letter-spacing: 0.04em;
  margin-left: 6px;
  text-transform: lowercase;
  align-self: center;
}
</style>
