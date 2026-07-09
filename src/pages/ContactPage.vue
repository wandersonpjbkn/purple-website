<template>
  <section class="contact-hero">
    <BaseContainer>
      <div class="contact-hero__inner">
        <div>
          <p class="section-eyebrow">Contato</p>
          <h1>{{ useContact().title }}</h1>
          <p class="lead lead--narrow">{{ useContact().subtitle }}</p>

          <div class="contact-info">
            <div class="contact-info__row">
              <a
                :href="`mailto:${useContact().email}`"
                class="contact-info__item"
              >
                <span class="contact-info__icon"><BaseIcon name="mail" /></span>
                <span>{{ useContact().email }}</span>
              </a>
            </div>
            <div class="contact-info__row">
              <a
                :href="whatsappUrl"
                target="_blank"
                rel="noopener"
                class="contact-info__item"
              >
                <span class="contact-info__icon"><BaseIcon name="phone" /></span>
                <span>{{ useContact().tel }}</span>
              </a>
            </div>
            <div class="contact-info__row">
              <div class="contact-info__item">
                <span class="contact-info__icon"><BaseIcon name="pin" /></span>
                <span>{{ useContact().address }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="contact-form-wrap">
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

              <label class="field">
                <span class="field__label">Serviço de interesse <span aria-hidden="true">*</span></span>
                <BaseCombobox
                  ref="subjectSelect"
                  v-model="form.subject"
                  :options="SERVICE_INTEREST_OPTIONS"
                  placeholder="Selecione um interesse"
                  :error="!!errors.subject"
                  :described-by="errors.subject ? 'subject-error' : undefined"
                />
                <span
                  v-if="errors.subject"
                  id="subject-error"
                  class="field__error"
                  role="alert"
                  >{{ errors.subject }}</span
                >
              </label>

              <label class="field">
                <span class="field__label">Mensagem <span aria-hidden="true">*</span></span>
                <textarea
                  ref="messageTextarea"
                  v-model="form.message"
                  rows="5"
                  placeholder="Nos conte um pouco sobre o seu desafio"
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

  <section class="contact-alt-cta">
    <BaseContainer>
      <div class="contact-alt-cta__inner">
        <div>
          <p class="section-eyebrow section-eyebrow--lime">Comunicação eficiente</p>
          <h2>Prefere falar agora?</h2>
          <p>Nos envie uma mensagem. Responderemos rapidamente.</p>
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
            Fale com uma consultora
          </BaseButton>
        </div>
      </div>
    </BaseContainer>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import BaseCombobox from '@/components/ui/BaseCombobox.vue'
import TurnstileWidget from '@/components/forms/TurnstileWidget.vue'
import {
  usePageMeta,
  useContact,
  useMail,
  useContactForm,
  useWhatsappUrl,
  useCtaTracking,
  resolveServiceInterest,
  SERVICE_INTEREST_OPTIONS,
} from '@/composables'

usePageMeta({
  title: 'Contato',
  description: 'Entre em contato com a Purple Comunicação. Formulário de contato ou por mensagem.',
})

const route = useRoute()
const router = useRouter()

const whatsappUrl = useWhatsappUrl('Olá! Vim pelo site da Purple e gostaria de saber mais.')
const { trackWhatsappClick, trackContactFormSubmit } = useCtaTracking()

const { status, errorMsg, send, reset } = useMail()
const { form, errors, validate, clearForm } = useContactForm()

// Comes from "Pedir proposta" on the Services page (?servico=<id>) — applied before
// the first render so the field doesn't flash empty before showing the prefilled value.
const prefilledInterest = resolveServiceInterest(route.query.servico)
if (prefilledInterest) form.subject = prefilledInterest

onMounted(() => {
  // Clears the URL so a page reload doesn't reapply this value after the user picks something else.
  if (route.query.servico) router.replace({ query: {} })
})

const turnstileToken = ref('')
const turnstileWidget = ref<InstanceType<typeof TurnstileWidget> | null>(null)

const nameInput = ref<HTMLInputElement | null>(null)
const emailInput = ref<HTMLInputElement | null>(null)
const subjectSelect = ref<InstanceType<typeof BaseCombobox> | null>(null)
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
}

.contact-info {
  margin-top: var(--space-8);

  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  &__row {
    border-bottom: 1px solid var(--border-subtle);
    padding: var(--space-4) 0;
  }

  // inline-flex, not flex: a block-level flex item still stretches to 100% of the
  // row; it needs to shrink to content so the click/hover area doesn't cover the
  // blank space to the right of the text.
  &__item {
    display: inline-flex;
    align-items: center;
    gap: var(--space-3);
    font-size: 0.9rem;
    font-weight: 500;
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
    grid-template-columns: 1fr;
    gap: var(--space-5);
    margin-bottom: var(--space-6);
  }

  &__turnstile {
    margin-bottom: var(--space-4);
  }

  &__submit {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
  }

  textarea {
    resize: vertical;
    min-height: 120px;
  }
}

.contact-alt-cta {
  background: var(--section-dark);
  padding: var(--space-20) 0;
  position: relative;
  overflow: hidden;

  &::before {
    @include radial-glow($opacity: 0.1, $offset: -30%);
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
