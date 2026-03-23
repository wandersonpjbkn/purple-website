<template>
  <div>

    <!-- ── Hero ──────────────────────────────────────── -->
    <section class="contact-hero">
      <BaseContainer>
        <div class="contact-hero__inner">
          <div>
            <p class="section-eyebrow">Contato</p>
            <h1>{{ site.contact.title }}</h1>
            <p class="lead lead--narrow">{{ site.contact.subtitle }}</p>

            <!-- CTAs diretos -->
            <div class="contact-hero__ctas">
              <a
                :href="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="button primary button--lg contact-hero__whatsapp"
              >
                <span class="contact-hero__whatsapp-icon" aria-hidden="true">💬</span>
                Falar no WhatsApp
              </a>
              <a
                :href="whatsappHireUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="button lime button--lg"
              >
                Contratar agora
              </a>
            </div>

            <!-- Info de contato -->
            <div class="contact-info">
              <a :href="`mailto:${site.contact.email}`" class="contact-info__item">
                <span class="contact-info__icon" aria-hidden="true">✉️</span>
                <span>{{ site.contact.email }}</span>
              </a>
              <a :href="whatsappUrl" target="_blank" rel="noopener" class="contact-info__item">
                <span class="contact-info__icon" aria-hidden="true">📱</span>
                <span>{{ site.contact.phone }}</span>
              </a>
              <div class="contact-info__item">
                <span class="contact-info__icon" aria-hidden="true">📍</span>
                <span>{{ site.contact.address }}</span>
              </div>
            </div>
          </div>

          <!-- Formulário -->
          <div class="contact-form-wrap">
            <!-- Estado: sucesso -->
            <div v-if="status === 'success'" class="contact-success">
              <div class="contact-success__icon" aria-hidden="true">✅</div>
              <h3>Mensagem enviada!</h3>
              <p>Recebemos seu contato e responderemos em breve pelo e-mail informado.</p>
              <button class="button secondary" @click="resetForm">Enviar outra mensagem</button>
            </div>

            <!-- Formulário normal -->
            <form v-else class="contact-form" novalidate @submit.prevent="handleSubmit">
              <div class="contact-form__header">
                <h3>Envie uma mensagem</h3>
                <p>Preencha o formulário e entraremos em contato em até 1 dia útil.</p>
              </div>

              <div class="contact-form__fields">
                <label class="field">
                  <span class="field__label">Nome <span aria-hidden="true">*</span></span>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Seu nome"
                    autocomplete="name"
                    required
                    :class="{ 'field__input--error': errors.name }"
                  />
                  <span v-if="errors.name" class="field__error" role="alert">{{ errors.name }}</span>
                </label>

                <label class="field">
                  <span class="field__label">E-mail <span aria-hidden="true">*</span></span>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="voce@empresa.com"
                    autocomplete="email"
                    required
                    :class="{ 'field__input--error': errors.email }"
                  />
                  <span v-if="errors.email" class="field__error" role="alert">{{ errors.email }}</span>
                </label>

                <label class="field field--full">
                  <span class="field__label">Assunto <span aria-hidden="true">*</span></span>
                  <select
                    v-model="form.subject"
                    required
                    :class="{ 'field__input--error': errors.subject }"
                  >
                    <option value="" disabled>Selecione um assunto</option>
                    <option value="Employer Branding">Employer Branding</option>
                    <option value="Endomarketing">Endomarketing</option>
                    <option value="Comunicação Interna">Comunicação Interna</option>
                    <option value="Publicidade Online">Publicidade Online</option>
                    <option value="UX/UI para websites">UX/UI para websites</option>
                    <option value="Orçamento geral">Orçamento geral</option>
                    <option value="Outro">Outro</option>
                  </select>
                  <span v-if="errors.subject" class="field__error" role="alert">{{ errors.subject }}</span>
                </label>

                <label class="field field--full">
                  <span class="field__label">Mensagem <span aria-hidden="true">*</span></span>
                  <textarea
                    v-model="form.message"
                    rows="5"
                    placeholder="Conte um pouco sobre o seu desafio ou como podemos ajudar..."
                    required
                    :class="{ 'field__input--error': errors.message }"
                  ></textarea>
                  <span v-if="errors.message" class="field__error" role="alert">{{ errors.message }}</span>
                </label>
              </div>

              <!-- Erro de envio -->
              <div v-if="status === 'error'" class="contact-form__send-error" role="alert">
                {{ errorMsg }}
              </div>

              <button
                type="submit"
                class="button primary button--lg contact-form__submit"
                :disabled="status === 'sending'"
              >
                <span v-if="status === 'sending'" class="contact-form__spinner" aria-hidden="true"></span>
                {{ status === 'sending' ? 'Enviando...' : 'Enviar mensagem' }}
              </button>
            </form>
          </div>
        </div>
      </BaseContainer>
    </section>

    <!-- ── CTA secundário ─────────────────────────────── -->
    <section class="contact-alt-cta">
      <BaseContainer>
        <div class="contact-alt-cta__inner">
          <div>
            <p class="section-eyebrow" style="color: var(--lime);">Resposta imediata</p>
            <h2>Prefere falar agora?</h2>
            <p>O WhatsApp é o canal mais rápido. Respondemos no mesmo dia.</p>
          </div>
          <div class="contact-alt-cta__actions">
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="button lime button--lg"
            >💬 Abrir WhatsApp</a>
            <a
              :href="whatsappHireUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="button secondary button--lg"
              style="color:#fff;border-color:rgba(255,255,255,0.25)"
            >Contratar um serviço</a>
          </div>
        </div>
      </BaseContainer>
    </section>

  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import BaseContainer from '@/components/ui/BaseContainer.vue'
import { useEmailJS } from '@/composables/useEmailJS'
import { usePageMeta } from '@/composables'
import site from '@/data/site.json'

usePageMeta({
  title:       'Contato',
  description: 'Entre em contato com a Purple Comunicação. Formulário, WhatsApp e e-mail disponíveis.',
})

// ── WhatsApp URLs ─────────────────────────────────────────
const PHONE = '5519991018383' // sem + e sem espaços

const whatsappUrl = computed(() =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent('Olá! Vim pelo site da Purple e gostaria de saber mais.')}`
)

const whatsappHireUrl = computed(() =>
  `https://wa.me/${PHONE}?text=${encodeURIComponent('Olá! Gostaria de contratar um serviço da Purple Comunicação.')}`
)

// ── Formulário ────────────────────────────────────────────
const { status, errorMsg, send, reset } = useEmailJS()

const form = reactive({
  name:    '',
  email:   '',
  subject: '',
  message: '',
})

const errors = reactive({
  name:    '',
  email:   '',
  subject: '',
  message: '',
})

function validate(): boolean {
  let valid = true

  errors.name    = form.name.trim()    ? '' : 'Informe seu nome.'
  errors.email   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ? '' : 'Informe um e-mail válido.'
  errors.subject = form.subject        ? '' : 'Selecione um assunto.'
  errors.message = form.message.trim().length >= 10
    ? '' : 'A mensagem precisa ter pelo menos 10 caracteres.'

  valid = !errors.name && !errors.email && !errors.subject && !errors.message
  return valid
}

async function handleSubmit() {
  if (!validate()) return

  const ok = await send({ ...form })
  if (ok) {
    // Limpa o form após sucesso
    Object.assign(form, { name: '', email: '', subject: '', message: '' })
  }
}

function resetForm() {
  reset()
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
  Object.assign(errors, { name: '', email: '', subject: '', message: '' })
}
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Hero ───────────────────────────────────────────────────
.contact-hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 4rem 0 5rem;
}

.contact-hero__inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;

  @include respond-to(lg) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

// ── CTAs diretos ───────────────────────────────────────────
.contact-hero__ctas {
  display: flex;
  gap: 0.875rem;
  flex-wrap: wrap;
  margin: 2rem 0 2.5rem;
}

.contact-hero__whatsapp {
  background: #25D366;
  border-color: #25D366;

  &:hover {
    background: #1ebe59;
    border-color: #1ebe59;
  }
}

.contact-hero__whatsapp-icon {
  font-size: 1.1em;
}

// ── Info de contato ────────────────────────────────────────
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.contact-info__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--muted);
  text-decoration: none;
  transition: color 0.15s;

  &:is(a):hover { color: var(--purple); }
}

.contact-info__icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--bg-alt);
  display: grid;
  place-items: center;
  font-size: 0.875rem;
  flex-shrink: 0;
}

// ── Formulário ─────────────────────────────────────────────
.contact-form-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.contact-form {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.contact-form__header {
  margin-bottom: 2rem;

  h3 { font-size: 1.2rem; margin-bottom: 0.25rem; }
  p  { font-size: 0.875rem; color: var(--muted); }
}

.contact-form__fields {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.5rem;

  @include respond-to(sm) { grid-template-columns: 1fr; }
}

// ── Campo ──────────────────────────────────────────────────
.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &--full { grid-column: 1 / -1; }
}

.field__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text);

  span { color: var(--purple); }
}

%input-shared {
  width: 100%;
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  padding: 0.8rem 1rem;
  background: var(--bg);
  color: var(--text);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;

  &::placeholder { color: var(--subtle); }

  &:focus {
    border-color: var(--purple-400);
    box-shadow: 0 0 0 3px rgba(139,47,204,0.1);
  }
}

input[type="text"],
input[type="email"],
select,
textarea {
  @extend %input-shared;
}

select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239c8aad' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.5rem;
}

textarea { resize: vertical; min-height: 120px; }

.field__input--error {
  border-color: #e53e3e !important;
  &:focus { box-shadow: 0 0 0 3px rgba(229,62,62,0.1) !important; }
}

.field__error {
  font-size: 0.75rem;
  color: #e53e3e;
  font-weight: 500;
}

// ── Submit ─────────────────────────────────────────────────
.contact-form__submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.contact-form__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.contact-form__send-error {
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: var(--radius);
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  color: #c53030;
  margin-bottom: 1rem;
}

// ── Sucesso ────────────────────────────────────────────────
.contact-success {
  padding: 3rem 2.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.contact-success__icon { font-size: 3rem; }

.contact-success h3 { font-size: 1.3rem; }

.contact-success p {
  color: var(--muted);
  font-size: 0.9rem;
  max-width: 30ch;
}

// ── CTA dark ──────────────────────────────────────────────
.contact-alt-cta {
  background: var(--purple-900);
  padding: 5rem 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -30%; right: -5%;
    width: 400px; aspect-ratio: 1;
    background: radial-gradient(ellipse, rgba(197,226,46,0.1) 0%, transparent 65%);
    pointer-events: none;
  }
}

.contact-alt-cta__inner {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 1;

  h2 { color: #fff; margin-bottom: 0.5rem; }
  p  { color: rgba(255,255,255,0.6); }

  @include respond-to(md) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.contact-alt-cta__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex-shrink: 0;
}
</style>
