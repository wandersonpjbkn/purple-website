<template>
  <header
    ref="headerRef"
    class="site-header"
    :class="{ scrolled: isScrolled }"
  >
    <BaseContainer>
      <div class="site-header__inner">
        <!-- Logo / Brand -->
        <RouterLink
          to="/"
          class="brand"
          aria-label="Purple Comunicação — Home"
        >
          <BrandLogo />
        </RouterLink>

        <!-- Nav desktop -->
        <nav
          class="nav"
          aria-label="Navegação principal"
        >
          <RouterLink
            v-for="(page, index) in pages"
            :key="index"
            :to="{ name: page.routeName }"
            >{{ page.label }}</RouterLink
          >
        </nav>

        <!-- CTA -->
        <BaseButton
          tag="a"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="trackHeaderWhatsappClick"
          >Vamos conversar</BaseButton
        >

        <!-- Hamburger mobile -->
        <button
          class="nav-toggle"
          :aria-label="mobileOpen ? 'Fechar menu' : 'Abrir menu'"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-nav"
          @click="mobileOpen = !mobileOpen"
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Mobile nav -->
      <nav
        v-if="mobileOpen"
        id="mobile-nav"
        class="nav-mobile"
        aria-label="Navegação mobile"
      >
        <RouterLink
          v-for="(page, index) in pages"
          :key="index"
          :to="{ name: page.routeName }"
          @click="mobileOpen = false"
          >{{ page.label }}</RouterLink
        >
      </nav>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { onClickOutside } from '@vueuse/core'

import pages from '@/data/pages.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useWhatsappUrl } from '@/composables/useWhatsapp'
import { useCtaTracking } from '@/composables/useCtaTracking'

const route = useRoute()
const isScrolled = ref(false)
const mobileOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)

const whatsappUrl = useWhatsappUrl(
  'Olá! Estou no site da Purple e gostaria de conversar. [mensagem provisória — copy final pendente]'
)
const { trackWhatsappClick } = useCtaTracking()
const trackHeaderWhatsappClick = () => trackWhatsappClick(`header:${String(route.name ?? route.path)}`)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 24
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && mobileOpen.value) {
    mobileOpen.value = false
  }
}

onClickOutside(headerRef, () => {
  mobileOpen.value = false
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  line-height: 1;
  /* Altura do logo consumida pelo BrandLogo (var --brand-logo-height). */
  --brand-logo-height: 32px;
}

/* Nav toggle (mobile) */
.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: var(--tap-target-min);
  height: var(--tap-target-min);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.nav-toggle span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: all 0.2s;
}

/* Mobile nav */
.nav-mobile {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: var(--space-3) 0 var(--space-5);
  border-top: 1px solid var(--border-subtle);
}

.nav-mobile a {
  padding: var(--space-3) 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--muted);
  border-bottom: 1px solid var(--border-subtle);
  transition: color 0.15s;
}

.nav-mobile a:last-child {
  border-bottom: none;
  margin-top: var(--space-3);
  text-align: center;
}

.nav-mobile .router-link-active {
  color: var(--purple);
  font-weight: 600;
}

@media (max-width: 900px) {
  .nav-toggle {
    display: flex;
  }

  .site-header__inner > .button {
    display: none;
  }
}
</style>
