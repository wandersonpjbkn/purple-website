<template>
  <!-- ── Hero ─────────────────────────────────────────────── -->
  <section class="contact-hero">
    <BaseContainer>
      <div class="contact-hero__inner">
        <div>
          <p class="section-eyebrow">Contato</p>
          <h1>{{ useContact().title }}</h1>
          <p class="lead lead--narrow">{{ useContact().subtitle }}</p>

          <!-- Direct CTAs -->
          <div class="contact-hero__ctas">
            <BaseButton
              tag="a"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="button--lg contact-hero__whatsapp"
              @click="trackWhatsappClick('contact_page_hero')"
            >
              <span class="contact-hero__whatsapp-icon"><BaseIcon name="whatsapp" /></span>
              Falar no WhatsApp
            </BaseButton>
            <BaseButton
              tag="a"
              :href="whatsappHireUrl"
              target="_blank"
              rel="noopener noreferrer"
              variant="lime"
              class="button--lg"
              @click="trackWhatsappClick('contact_page_hero_hire')"
            >
              Contratar agora
            </BaseButton>
          </div>

          <!-- Contact info -->
          <div class="contact-info">
            <a
              :href="`mailto:${useContact().email}`"
              class="contact-info__item"
            >
              <span class="contact-info__icon"><BaseIcon name="mail" /></span>
              <span>{{ useContact().email }}</span>
            </a>
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener"
              class="contact-info__item"
            >
              <span class="contact-info__icon"><BaseIcon name="phone" /></span>
              <span>{{ useContact().tel }}</span>
            </a>
            <div class="contact-info__item">
              <span class="contact-info__icon"><BaseIcon name="pin" /></span>
              <span>{{ useContact().address }}</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="contact-form-wrap">
          <!-- State: success -->
          <div
            v-if="status === 'success'"
            class="form-success"
          >
            <div class="contact-success__icon"><BaseIcon name="check" /></div>
            <h3>Mensagem enviada!</h3>
            <p>Recebemos seu contato e responderemos em breve pelo e-mail informado.</p>
            <BaseButton
              variant="secondary"
              @click="resetForm"
              >Enviar outra mensagem</BaseButton
            >
          </div>

          <!-- Normal form -->
          <form
            v-else
            class="contact-form"
            novalidate
            @submit.prevent="handleSubmit"
          >
            <div class="contact-form__header">
              <h3>Envie uma mensagem</h3>
              <p>Preencha o formulário e entraremos em contato em até 1 dia útil.</p>
            </div>

            <div class="contact-form__fields">
              <label class="field">
                <span class="field__label">Nome <span aria-hidden="true">*</span></span>
                <input
                  ref="nameInput"
                  v-model="form.name"
                  type="text"
                  placeholder="Seu nome"
                  autocomplete="name"
                  required
                  :class="{ 'field__input--error': errors.name }"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                />
                <span
                  v-if="errors.name"
                  id="name-error"
                  class="field__error"
                  role="alert"
                  >{{ errors.name }}</span
                >
              </label>

              <label class="field">
                <span class="field__label">E-mail <span aria-hidden="true">*</span></span>
                <input
                  ref="emailInput"
                  v-model="form.email"
                  type="email"
                  placeholder="voce@empresa.com"
                  autocomplete="email"
                  required
                  :class="{ 'field__input--error': errors.email }"
                  :aria-invalid="!!errors.email"
                  :aria-describedby="errors.email ? 'email-error' : undefined"
                />
                <span
                  v-if="errors.email"
                  id="email-error"
                  class="field__error"
                  role="alert"
                  >{{ errors.email }}</span
                >
              </label>

              <label class="field field--full">
                <span class="field__label">Serviço de interesse <span aria-hidden="true">*</span></span>
                <select
                  ref="subjectSelect"
                  v-model="form.subject"
                  required
                  :class="{ 'field__input--error': errors.subject }"
                  :aria-invalid="!!errors.subject"
                  :aria-describedby="errors.subject ? 'subject-error' : undefined"
                >
                  <option
                    value=""
                    disabled
                  >
                    Selecione um interesse
                  </option>
                  <option
                    v-for="service in services.catalog"
                    :key="service.id"
                    :value="service.title"
                  >
                    {{ service.title }}
                  </option>
                  <option value="Orçamento geral">Orçamento geral</option>
                  <option value="Outro">Outro</option>
                </select>
                <span
                  v-if="errors.subject"
                  id="subject-error"
                  class="field__error"
                  role="alert"
                  >{{ errors.subject }}</span
                >
              </label>

              <label class="field field--full">
                <span class="field__label">Mensagem <span aria-hidden="true">*</span></span>
                <textarea
                  ref="messageTextarea"
                  v-model="form.message"
                  rows="5"
                  placeholder="Conte um pouco sobre o seu desafio ou como podemos ajudar..."
                  required
                  :class="{ 'field__input--error': errors.message }"
                  :aria-invalid="!!errors.message"
                  :aria-describedby="errors.message ? 'message-error' : undefined"
                ></textarea>
                <span
                  v-if="errors.message"
                  id="message-error"
                  class="field__error"
                  role="alert"
                  >{{ errors.message }}</span
                >
              </label>
            </div>

            <TurnstileWidget
              ref="turnstileWidget"
              class="contact-form__turnstile"
              @verified="token => (turnstileToken = token)"
              @expired="turnstileToken = ''"
            />

            <!-- Submit error -->
            <div
              v-if="status === 'error'"
              class="form-send-error"
              role="alert"
            >
              {{ errorMsg }}
            </div>

            <BaseButton
              type="submit"
              class="button--lg contact-form__submit"
              :disabled="status === 'sending'"
            >
              <span
                v-if="status === 'sending'"
                class="form-spinner"
                aria-hidden="true"
              ></span>
              {{ status === 'sending' ? 'Enviando...' : 'Enviar mensagem' }}
            </BaseButton>
          </form>
        </div>
      </div>
    </BaseContainer>
  </section>

  <!-- ── Secondary CTA ────────────────────────────────────── -->
  <section class="contact-alt-cta">
    <BaseContainer>
      <div class="contact-alt-cta__inner">
        <div>
          <p class="section-eyebrow section-eyebrow--lime">Resposta imediata</p>
          <h2>Prefere falar agora?</h2>
          <p>O WhatsApp é o canal mais rápido. Respondemos no mesmo dia.</p>
        </div>
        <div class="contact-alt-cta__actions">
          <BaseButton
            tag="a"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            variant="lime"
            class="button--lg"
            @click="trackWhatsappClick('contact_page_alt_cta')"
          >
            <BaseIcon name="whatsapp" /> Abrir WhatsApp
          </BaseButton>
          <BaseButton
            tag="a"
            :href="whatsappHireUrl"
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            class="button--lg on-dark"
            @click="trackWhatsappClick('contact_page_alt_cta_hire')"
          >
            Contratar um serviço
          </BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import TurnstileWidget from '@/components/forms/TurnstileWidget.vue'
import { usePageMeta, useContact, useMail, useContactForm } from '@/composables'
import { useWhatsappUrl } from '@/composables/useWhatsapp'
import { useCtaTracking } from '@/composables/useCtaTracking'
import services from '@/data/services.json'

usePageMeta({
  title: 'Contato',
  description: 'Entre em contato com a Purple Comunicação. Formulário, WhatsApp e e-mail disponíveis.',
})

// ── WhatsApp URLs ──────────────────────────────────────────
const whatsappUrl = useWhatsappUrl('Olá! Vim pelo site da Purple e gostaria de saber mais.')
const whatsappHireUrl = useWhatsappUrl('Olá! Gostaria de contratar um serviço da Purple Comunicação.')
const { trackWhatsappClick, trackContactFormSubmit } = useCtaTracking()

// ── Form ───────────────────────────────────────────────────
const { status, errorMsg, send, reset } = useMail()
const { form, errors, validate, clearForm } = useContactForm()

const turnstileToken = ref('')
const turnstileWidget = ref<InstanceType<typeof TurnstileWidget> | null>(null)

const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const subjectSelect = ref<HTMLSelectElement | null>(null)
const messageTextarea = ref<HTMLTextAreaElement | null>(null)

const focusFirstError = () => {
  if (errors.name) nameInput.value?.focus()
  else if (errors.email) emailInput.value?.focus()
  else if (errors.subject) subjectSelect.value?.focus()
  else if (errors.message) messageTextarea.value?.focus()
}

const handleSubmit = async () => {
  if (!validate()) {
    focusFirstError()
    return
  }

  if (!turnstileToken.value) {
    status.value = 'error'
    errorMsg.value = 'Confirme que você não é um robô antes de enviar.'
    return
  }

  const ok = await send(
    { name: form.name, email: form.email, service: form.subject, message: form.message },
    turnstileToken.value
  )
  if (ok) {
    trackContactFormSubmit('contact_page_form', { service: form.subject })
    clearForm()
    turnstileToken.value = ''
    turnstileWidget.value?.reset()
  }
}

const resetForm = () => {
  reset()
  turnstileToken.value = ''
  turnstileWidget.value?.reset()
  clearForm()
}
</script>

<style scoped lang="scss">
@use '@/styles/abstracts/mixins' as *;

// ── Hero ───────────────────────────────────────────────────
.contact-hero {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: var(--space-16) 0 var(--space-20);

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-20);
    align-items: start;

    @include respond-to(lg) {
      grid-template-columns: 1fr;
      gap: var(--space-12);
    }
  }

  // ── Direct CTAs ────────────────────────────────────────────
  &__ctas {
    display: flex;
    gap: 0.875rem;
    flex-wrap: wrap;
    margin: var(--space-8) 0 var(--space-10);
  }

  &__whatsapp {
    background: var(--whatsapp);
    border-color: var(--whatsapp);
    color: var(--text);

    &:hover {
      background: var(--whatsapp-dark);
      border-color: var(--whatsapp-dark);
      color: var(--text);
    }

    &-icon {
      font-size: 1.1em;
    }
  }
}

// ── Contact info ───────────────────────────────────────────
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  &__item {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    font-size: 0.9rem;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.15s;

    &:is(a):hover {
      color: var(--purple);
    }
  }

  &__icon {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-sm);
    background: var(--bg-alt);
    display: grid;
    place-items: center;
    font-size: var(--text-sm);
    flex-shrink: 0;
  }
}

// ── Form ───────────────────────────────────────────────────
.contact-form {
  padding: var(--space-10);
  display: flex;
  flex-direction: column;
  gap: 0;

  &-wrap {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
  }

  &__header {
    margin-bottom: var(--space-8);

    h3 {
      font-size: var(--text-lg);
      margin-bottom: var(--space-1);
    }
    p {
      font-size: var(--text-sm);
      color: var(--muted);
    }
  }

  &__fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-5);
    margin-bottom: var(--space-6);

    @include respond-to(sm) {
      grid-template-columns: 1fr;
    }
  }

  &__turnstile {
    margin-bottom: var(--space-4);
  }

  // ── Submit ─────────────────────────────────────────────────
  &__submit {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }

  // ── Field ──────────────────────────────────────────────────
  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239c8aad' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.875rem center;
    padding-right: var(--space-10);
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
}

// ── Dark CTA ───────────────────────────────────────────────
.contact-alt-cta {
  background: var(--section-dark);
  padding: var(--space-20) 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -5%;
    width: 400px;
    aspect-ratio: 1;
    background: radial-gradient(ellipse, rgba(var(--lime-rgb), 0.1) 0%, transparent 65%);
    pointer-events: none;
  }

  &__inner {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-12);
    align-items: center;
    position: relative;
    z-index: 1;

    h2 {
      color: var(--on-dark);
      margin-bottom: var(--space-2);
    }
    p {
      color: var(--on-dark-muted);
    }

    @include respond-to(md) {
      grid-template-columns: 1fr;
      gap: var(--space-8);
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    flex-shrink: 0;
  }
}
</style>
