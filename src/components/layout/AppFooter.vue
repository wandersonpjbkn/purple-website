<template>
  <footer class="site-footer">
    <BaseContainer>
      <section class="newsletter-box">
        <div>
          <p class="section-eyebrow">Newsletter</p>
          <h3>{{ site.footer.newsletterTitle }}</h3>
        </div>
        <form class="newsletter-form" @submit.prevent>
          <input type="email" placeholder="Seu melhor e-mail" aria-label="Seu melhor e-mail" />
          <button type="submit" class="button primary">Quero receber</button>
        </form>
      </section>

      <div class="footer-grid">
        <div>
          <h4>Purple Comunicação</h4>
          <p>{{ site.footer.aboutText }}</p>
        </div>
        <div>
          <h4>Navegação</h4>
          <ul>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/sobre">Sobre</RouterLink></li>
            <li><RouterLink to="/blog">Blog</RouterLink></li>
            <li><RouterLink to="/contato">Contato</RouterLink></li>
          </ul>
        </div>
        <div>
          <h4>Tópicos</h4>
          <ul>
            <li v-for="topic in site.footer.topics" :key="topic">{{ topic }}</li>
          </ul>
        </div>
        <div>
          <h4>Contato</h4>
          <p>{{ site.contact.address }}</p>
          <p>{{ site.contact.phone }}</p>
          <p>{{ site.contact.email }}</p>
        </div>
      </div>

      <div class="footer-bottom">
        <span>Copyright © 2026 Purple Comunicação</span>
        <span>Política de privacidade</span>
      </div>
    </BaseContainer>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import site from '@/data/site.json'
import BaseContainer from '@/components/ui/BaseContainer.vue'
</script>
