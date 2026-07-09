<template>
  <footer class="site-footer">
    <BaseContainer>
      <div class="footer-grid">
        <div class="footer-brand">
          <RouterLink
            to="/"
            class="footer-brand__logo"
            aria-label="Purple Comunicação — Home"
          >
            <BrandLogo />
          </RouterLink>
          <p>{{ footer.aboutText }}</p>
          <ul
            v-if="footer.social?.length"
            class="footer-social"
            aria-label="Redes sociais"
          >
            <li
              v-for="item in footer.social"
              :key="item.label"
            >
              <SocialLink
                :href="item.url"
                :icon="item.icon"
                :label="item.label"
              />
            </li>
          </ul>
        </div>
        <div>
          <h3>Navegação</h3>
          <ul>
            <li
              v-for="(page, index) in pages"
              :key="index"
            >
              <RouterLink :to="{ name: page.routeName }">{{ page.label }}</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h3>Tópicos</h3>
          <ul>
            <li
              v-for="topic in footer.topics"
              :key="topic"
            >
              <RouterLink to="/servicos">{{ topic }}</RouterLink>
            </li>
          </ul>
        </div>
        <address>
          <h3>Contato</h3>
          <p>{{ useContact().address }}</p>
          <p>
            <a :href="`tel:${useContact().phone}`">{{ useContact().tel }}</a>
          </p>
          <p>
            <a :href="`mailto:${useContact().email}`">{{ useContact().email }}</a>
          </p>
        </address>
      </div>

      <div class="footer-bottom">
        <span>Copyright © {{ currentYear }} Purple Comunicação</span>
        <ul class="footer-legal">
          <li>
            <button
              type="button"
              class="footer-legal__link"
              @click="consent.reopen()"
            >
              Preferências de cookies
            </button>
          </li>
          <li
            v-for="(item, index) in footer.legal"
            :key="index"
          >
            <RouterLink
              class="footer-legal__link"
              :to="{ name: item.routeName }"
              >{{ item.label }}</RouterLink
            >
          </li>
        </ul>
      </div>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

import pages from '@/data/pages.json'
import footer from '@/data/footer.json'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import SocialLink from '@/components/ui/SocialLink.vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useContact } from '@/composables'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
const currentYear = new Date().getFullYear()
</script>
