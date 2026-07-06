<template>
  <header class="site-header" :class="{ scrolled: isScrolled }">
    <BaseContainer>
      <div class="site-header__inner">
        <!-- Logo / Brand -->
        <RouterLink to="/" class="brand" aria-label="Purple Comunicação — Home">
          <BrandLogo />
        </RouterLink>

        <!-- Nav desktop -->
        <nav class="nav" aria-label="Navegação principal">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/sobre">Sobre nós</RouterLink>
          <RouterLink to="/abordagem">Abordagem</RouterLink>
          <RouterLink to="/servicos">Serviços</RouterLink>
          <RouterLink to="/blog">Blog</RouterLink>
          <RouterLink to="/contato">Contato</RouterLink>
        </nav>

        <!-- CTA -->
        <BaseButton tag="RouterLink" to="/contato">Vamos conversar</BaseButton>

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
      <nav v-if="mobileOpen" id="mobile-nav" class="nav-mobile" aria-label="Navegação mobile">
        <RouterLink to="/" @click="mobileOpen = false">Home</RouterLink>
        <RouterLink to="/sobre" @click="mobileOpen = false">Sobre nós</RouterLink>
        <RouterLink to="/abordagem" @click="mobileOpen = false">Abordagem</RouterLink>
        <RouterLink to="/servicos" @click="mobileOpen = false">Serviços</RouterLink>
        <RouterLink to="/blog" @click="mobileOpen = false">Blog</RouterLink>
        <RouterLink to="/contato" @click="mobileOpen = false">Contato</RouterLink>
        <BaseButton tag="RouterLink" to="/contato" @click="mobileOpen = false">Vamos conversar</BaseButton>
      </nav>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'

const isScrolled = ref(false)
const mobileOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
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
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
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
  padding: 0.75rem 0 1.25rem;
  border-top: 1px solid var(--border-subtle);
}

.nav-mobile a {
  padding: 0.75rem 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--muted);
  border-bottom: 1px solid var(--border-subtle);
  transition: color 0.15s;
}

.nav-mobile a:last-child {
  border-bottom: none;
  margin-top: 0.75rem;
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
