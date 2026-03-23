<template>
  <header class="site-header" :class="{ scrolled: isScrolled }">
    <BaseContainer>
      <div class="site-header__inner">

        <!-- Logo / Brand -->
        <RouterLink to="/" class="brand" aria-label="Purple Comunicação — Home">
          <!--
            Quando o logo SVG/PNG estiver disponível, substitua o bloco abaixo:
            <img src="@/assets/logo-ppl.svg" alt="ppl comunicação" class="brand__logo" />

            Por enquanto, usamos a versão tipográfica:
          -->
          <span class="brand__ppl">ppl</span><span class="brand__dot">.</span><span class="brand__sub">comunicação</span>
        </RouterLink>

        <!-- Nav desktop -->
        <nav class="nav" aria-label="Navegação principal">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/servicos">Serviços</RouterLink>
          <RouterLink to="/sobre">Sobre nós</RouterLink>
          <RouterLink to="/blog">Blog</RouterLink>
          <RouterLink to="/contato">Contato</RouterLink>
        </nav>

        <!-- CTA -->
        <BaseButton tag="RouterLink" to="/contato">Vamos conversar</BaseButton>

        <!-- Hamburger mobile (visual only — conectar lógica de menu se necessário) -->
        <button class="nav-toggle" aria-label="Abrir menu" @click="mobileOpen = !mobileOpen">
          <span></span><span></span><span></span>
        </button>
      </div>

      <!-- Mobile nav -->
      <nav v-if="mobileOpen" class="nav-mobile" aria-label="Navegação mobile">
        <RouterLink to="/" @click="mobileOpen = false">Home</RouterLink>
        <RouterLink to="/servicos" @click="mobileOpen = false">Serviços</RouterLink>
        <RouterLink to="/sobre" @click="mobileOpen = false">Sobre nós</RouterLink>
        <RouterLink to="/blog" @click="mobileOpen = false">Blog</RouterLink>
        <RouterLink to="/contato" @click="mobileOpen = false">Contato</RouterLink>
        <RouterLink to="/contato" class="button primary" @click="mobileOpen = false">Vamos conversar</RouterLink>
      </nav>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const isScrolled = ref(false)
const mobileOpen = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
/* Brand tipográfico — substituir pela tag <img> quando o logo for entregue */
.brand {
  display: flex;
  align-items: baseline;
  gap: 0;
  text-decoration: none;
  line-height: 1;
}

.brand__ppl {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 1.35rem;
  color: var(--purple);
  letter-spacing: -0.04em;
}

.brand__dot {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 800;
  font-size: 1.35rem;
  color: var(--lime-dark);
  margin-left: 1px;
}

.brand__sub {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-weight: 500;
  font-size: 0.72rem;
  color: var(--subtle);
  letter-spacing: 0.04em;
  margin-left: 6px;
  text-transform: lowercase;
  align-self: center;
}

/* Para quando o logo imagem for inserido */
.brand__logo {
  height: 32px;
  width: auto;
  display: block;
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
  .nav-toggle { display: flex; }

  /* Esconde o botão CTA do header em mobile (aparece no nav-mobile) */
  .site-header__inner > .button {
    display: none;
  }
}
</style>
