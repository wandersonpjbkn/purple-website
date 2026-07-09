<template>
  <section class="hero">
    <BaseContainer>
      <div class="hero__grid">
        <!-- Coluna texto -->
        <div>
          <div class="hero__kicker">
            <span
              v-for="(eyebrow, index) in home.hero.eyebrow"
              :key="index"
              ><span class="dot" />{{ eyebrow }}</span
            >
          </div>

          <!-- titlePrefix carrega <em> de destaque — conteúdo controlado (home.json), não input de usuário -->
          <h1 class="hero__title">
            <span v-html="home.hero.titlePrefix" />
            <br />
            <!-- Sizers invisíveis reservam a altura/largura da frase mais longa,
                 para o conteúdo abaixo não pular enquanto o typewriter digita -->
            <span class="hero__rotator">
              <span
                v-for="phrase in home.hero.rotating"
                :key="phrase"
                class="hero__rotator-sizer"
                aria-hidden="true"
                >{{ phrase }}</span
              >
              <span
                ref="typewriterEl"
                class="hero__typewriter"
                aria-hidden="true"
              />
            </span>
            <span class="sr-only">{{ home.hero.rotating.join(' · ') }}</span>
          </h1>

          <p class="lead">{{ home.hero.subtitle }}</p>

          <div class="hero__actions">
            <BaseButton
              class="button--lg"
              tag="RouterLink"
              to="/contato"
            >
              {{ home.hero.primaryCta }}
            </BaseButton>
            <BaseButton
              class="button--lg"
              tag="RouterLink"
              to="/servicos"
              variant="secondary"
            >
              {{ home.hero.secondaryCta }}
            </BaseButton>
          </div>

          <!-- 3 indicadores compactos · valor + sinal em lime -->
          <div class="hero__stat">
            <template
              v-for="(stat, i) in home.hero.stats"
              :key="stat.label"
            >
              <div
                v-if="i > 0"
                class="hero__stat-divider"
              ></div>
              <div>
                <div class="hero__stat-number">
                  {{ stat.value }}<span class="hero__stat-sign">{{ stat.sign }}</span>
                </div>
                <div class="hero__stat-label">{{ stat.label }}</div>
              </div>
            </template>
          </div>
        </div>

        <!-- Coluna card visual -->
        <div class="hero__media">
          <div class="hero__card">
            <div class="hero__card-label">{{ home.hero.card.label }}</div>
            <div class="hero__card-value">
              {{ home.hero.card.value }}<span class="hero__card-sign">{{ home.hero.card.sign }}</span>
            </div>
            <div class="hero__card-sub">{{ home.hero.card.sub }}</div>
            <div class="hero__card-bar">
              <div
                class="hero__card-bar-fill"
                :style="{ width: `${home.hero.card.barWidth}%` }"
              />
            </div>
            <div class="hero__card-tags">
              <span
                v-for="(tag, i) in home.hero.card.tags"
                :key="tag"
                class="hero__card-tag"
                :class="{ accent: i === 0 }"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="hero__float hero__float--1">
            <div class="icon"><BaseIcon name="trophy" /></div>
            Marca Empregadora
          </div>
          <div class="hero__float hero__float--2">
            <div class="icon"><BaseIcon name="megaphone" /></div>
            Comunicação Interna
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="split-section">
        <MediaBlock
          :src="useCdnAsset(home.highlight.image)"
          :alt="home.highlight.imageAlt"
        />
        <div>
          <p class="section-eyebrow">{{ home.highlight.eyebrow }}</p>
          <h2>{{ home.highlight.title }}</h2>
          <p class="lead">{{ home.highlight.description }}</p>
          <ul class="feature-list">
            <li
              v-for="benefit in home.highlight.benefits"
              :key="benefit"
            >
              {{ benefit }}
            </li>
          </ul>
          <div class="button-row">
            <BaseButton
              tag="RouterLink"
              to="/sobre"
              variant="secondary"
              >Conheça a Purple</BaseButton
            >
          </div>
        </div>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block section-block--alt">
    <BaseContainer>
      <div class="section-header section-header--center">
        <p class="section-eyebrow">{{ services.homeTeaser.eyebrow }}</p>
        <h2>{{ services.homeTeaser.title }}</h2>
      </div>
      <div class="services-grid">
        <ServiceTeaserCard
          v-for="service in teaserServices"
          :key="service.id"
          :service="service"
        />
        <article
          v-if="featuredService"
          class="service-card service-card--featured"
        >
          <div>
            <h3>{{ featuredService.title }}</h3>
            <p>{{ featuredService.summary }}</p>
            <RouterLink
              class="text-link text-link--lime"
              :to="`/servicos#${featuredService.id}`"
            >
              Saiba mais
            </RouterLink>
          </div>
          <div class="service-card__icon"><BaseIcon :name="featuredService.icon" /></div>
        </article>
      </div>
      <div class="button-row button-row--center">
        <BaseButton
          tag="RouterLink"
          to="/servicos"
          variant="secondary"
          >Ver todos os serviços</BaseButton
        >
      </div>
    </BaseContainer>
  </section>

  <section class="panorama-section">
    <BaseContainer>
      <div class="panorama-header">
        <p class="section-eyebrow">{{ panorama.eyebrow }}</p>
        <h2>{{ panorama.title }}</h2>
        <p>{{ panorama.subtitle }}</p>
      </div>

      <!-- Apenas alguns dados mais impactantes -->
      <div class="stat-grid stat-grid--cols-3">
        <StatCard
          v-for="stat in panorama.stats.slice(0, 3)"
          :key="stat.label"
          :number="stat.number"
          :suffix="stat.suffix"
          :label="stat.label"
          :body="stat.comparison"
          :source="stat.source"
          :highlight="stat.highlight"
        />
      </div>

      <hr class="panorama-divider" />

      <div class="panorama-context">
        <div
          v-for="item in panorama.context"
          :key="item.strong"
          class="panorama-context__item"
        >
          <span class="panorama-context__dot"></span>
          <p class="panorama-context__text">
            <strong>{{ item.strong }}</strong> — {{ item.text }}
          </p>
        </div>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block section-block--surface">
    <BaseContainer>
      <div class="section-head-row">
        <div>
          <p class="section-eyebrow">Blog</p>
          <h2>Conteúdos recentes</h2>
        </div>
        <RouterLink
          class="text-link"
          to="/blog"
          >Ver todos</RouterLink
        >
      </div>
      <div
        v-if="featuredPosts.length"
        class="blog-grid"
      >
        <PostCard
          v-for="post in featuredPosts"
          :key="post.slug"
          :post="post"
          variant="grid"
        />
      </div>
      <!-- Só mostra o vazio após a carga terminar — sem flash de erro -->
      <div
        v-else-if="blogReady"
        class="home-blog-empty"
      >
        <p>Não conseguimos carregar os posts do blog no momento.</p>
      </div>
    </BaseContainer>
  </section>

  <section class="section-block">
    <BaseContainer>
      <div class="section-header section-header--center section-header--tight">
        <p class="section-eyebrow">Quem somos</p>
        <h2>Um espaço para pessoas,<br />feito por pessoas</h2>
        <p class="lead lead--narrow lead--center">
          Nascemos inconformados com lideranças que adoecem times e espaços que não integram as pessoas.
        </p>
      </div>
      <div class="team-grid">
        <TeamCard
          v-for="member in team"
          :key="member.name"
          :member="member"
        />
      </div>
    </BaseContainer>
  </section>

  <CtaBanner
    :title="home.cta.title"
    :description="home.cta.description"
    whatsapp-message="Olá! Vim pela página inicial do site da Purple e quero saber mais. [mensagem provisória — copy final pendente]"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import home from '@/data/home.json'
import panorama from '@/data/panorama.json'
import services from '@/data/services.json'
import team from '@/data/team.json'

import { usePageMeta, useCdnAsset, useTypewriter, useBlogData } from '@/composables'

import BaseContainer from '@/components/ui/BaseContainer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseIcon from '@/components/ui/BaseIcon.vue'
import MediaBlock from '@/components/ui/MediaBlock.vue'
import StatCard from '@/components/ui/StatCard.vue'
import ServiceTeaserCard from '@/components/ui/ServiceTeaserCard.vue'
import CtaBanner from '@/components/sections/CtaBanner.vue'
import PostCard from '@/components/blog/PostCard.vue'
import TeamCard from '@/components/ui/TeamCard.vue'

usePageMeta({
  // usePageMeta já anexa "| Purple Comunicação"; não repetir a marca aqui.
  title: 'A mudança é de dentro para fora',
  description:
    'Somos uma empresa que une estratégia e comunicação para transformar o ambiente interno em vantagem competitiva real.',
})

const { posts, isReady: blogReady, loadIndex } = useBlogData()
loadIndex()
const featuredPosts = computed(() => posts.value.slice(0, 3))

// Teaser: 4 cards comuns + 1 destaque (mesma malha 3×2 do develop);
// o catálogo completo vive em /servicos.
const teaserServices = services.catalog.filter(service => !service.featured).slice(0, 4)
const featuredService = services.catalog.find(service => service.featured)

// ── Typewriter ────────────────────────────────────────────
const typewriterEl = ref<HTMLElement | null>(null)
useTypewriter(typewriterEl, home.hero.rotating)
</script>

<style scoped lang="scss">
.home-blog-empty {
  text-align: center;
  padding: var(--space-10) var(--space-8);

  p {
    color: var(--muted);
  }
}
</style>
