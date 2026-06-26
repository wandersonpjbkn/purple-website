<template>
  <footer class="site-footer">
    <BaseContainer>
      <!-- TODO: review implementation -->
      <!-- <section class="newsletter-box">
        <div>
          <p class="section-eyebrow">Newsletter</p>
          <h3>{{ footer.newsletterTitle }}</h3>
        </div>
        <form class="newsletter-form" @submit.prevent>
          <input type="email" placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" />
          <button type="submit" class="button primary">Quero receber</button>
        </form>
      </section> -->

      <div class="footer-grid">
        <div>
          <h4>Purple Comunicação</h4>
          <p>{{ footer.aboutText }}</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/sobre">Sobre</RouterLink></li>
            <li><RouterLink to="/abordagem">Abordagem</RouterLink></li>
            <li><RouterLink to="/servicos">Serviços</RouterLink></li>
            <li><RouterLink to="/blog">Blog</RouterLink></li>
            <li><RouterLink to="/contato">Contato</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Tópicos</h4>
          <ul>
            <li v-for="topic in footer.topics" :key="topic">{{ topic }}</li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <p>{{ contact.address }}</p>
          <p>{{ contact.phone }}</p>
          <p>{{ contact.email }}</p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>Copyright © {{ currentYear }} Purple Comunicação</span>
        <button type="button" class="footer-cookies" @click="consent.reopen()">Preferências de cookies</button>
      </div>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import contact from '@/data/contact.json'
import footer from '@/data/footer.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
const currentYear = new Date().getFullYear()
</script>
