<template>
  <section class="section-block">
    <BaseContainer>
      <div class="contact-grid">
        <div>
          <p class="section-eyebrow">Contato</p>
          <h1>{{ title }}</h1>
          <p class="lead">{{ subtitle }}</p>
          <ul class="contact-list">
            <li>{{ phone }}</li>
            <li>{{ email }}</li>
            <li>{{ address }}</li>
          </ul>
        </div>

        <form class="contact-form" @submit.prevent>
          <label>
            Nome
            <input type="text" placeholder="Seu nome" />
          </label>
          <label>
            E-mail
            <input type="email" placeholder="voce@empresa.com" />
          </label>
          <label>
            Assunto
            <input type="text" placeholder="Como podemos ajudar?" />
          </label>
          <label>
            Mensagem
            <textarea rows="5" placeholder="Nos conte um pouco sobre sua dúvida"></textarea>
          </label>
          <button type="submit" class="button primary">Enviar</button>
        </form>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  phone: string
  email: string
  address: string
}>()
</script>
