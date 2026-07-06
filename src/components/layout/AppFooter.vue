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
              <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="item.label"
                class="footer-social__link"
              >
                <BaseIcon
                  :name="item.icon"
                  :label="item.label"
                />
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li
              v-for="(route, index) in pages"
              :key="index"
            >
              <RouterLink :to="route.to">{{ route.name }}</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <h4>Tópicos</h4>
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
          <h4>Contato</h4>
          <p>{{ useContact().address }}</p>
          <p>
            <a
              :href="`tel:${useContact().phone}`"
              target="_blank"
              >{{ useContact().tel }}</a
            >
          </p>
          <p>
            <a
              :href="`mailto:${useContact().email}`"
              target="_blank"
              >{{ useContact().email }}</a
            >
          </p>
        </address>
      </div>

      <div class="footer-bottom">
        <span>Copyright © {{ currentYear }} Purple Comunicação</span>
        <ul class="footer-legal">
          <li>
            <button
              type="button"
              class="footer-cookies"
              @click="consent.reopen()"
            >
              Preferências de cookies
            </button>
          </li>
          <li
            v-for="(item, index) in footer.legal"
            :key="index"
          >
            <RouterLink :to="item.to">{{ item.name }}</RouterLink>
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
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BrandLogo from '@/components/ui/BrandLogo.vue'
import { useContact } from '@/composables'
import { useConsentStore } from '@/stores/consent'

const consent = useConsentStore()
const currentYear = new Date().getFullYear()
</script>
