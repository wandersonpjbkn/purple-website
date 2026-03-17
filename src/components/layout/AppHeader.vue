<template>
  <header class="site-header">
    <BaseContainer>
      <div class="site-header__inner">
        <RouterLink to="/" class="brand">Purple Comunicação</RouterLink>

        <nav class="nav">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/sobre">Sobre nós</RouterLink>
          <RouterLink to="/blog">Blog</RouterLink>
          <RouterLink to="/contato">Contato</RouterLink>
        </nav>

        <BaseButton tag="RouterLink" to="/contato">Vamos conversar</BaseButton>
      </div>
    </BaseContainer>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
</script>
