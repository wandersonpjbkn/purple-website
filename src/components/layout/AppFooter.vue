<template>
  <footer class="site-footer">
    <BaseContainer>
      <div class="footer-grid">
        <div class="footer-brand">
          <RouterLink to="/" class="footer-brand__logo" aria-label="Purple Comunicação — Home">
            <BrandLogo />
          </RouterLink>
          <p>{{ footer.aboutText }}</p>
          <ul v-if="footer.social?.length" class="footer-social" aria-label="Redes sociais">
            <li v-for="item in footer.social" :key="item.label">
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="item.label"
                class="footer-social__link"
              >
                <BaseIcon :name="item.icon" :label="item.label" />
              </a>
            </li>
          </ul>
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
            <li v-for="topic in footer.topics" :key="topic">
              <RouterLink to="/servicos">{{ topic }}</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <p>{{ contact.address }}</p>
          <p>{{ contact.phone }}</p>
          <p>{{ contact.email }}</p>
          <ul class="footer-legal">
            <li><RouterLink to="/faq">Perguntas frequentes</RouterLink></li>
            <li><RouterLink to="/privacidade">Política de Privacidade</RouterLink></li>
          </ul>
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
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
const currentYear = new Date().getFullYear()
</script>
