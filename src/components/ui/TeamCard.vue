<template>
  <article
    v-if="member && member.isVisibleTeamMember"
    class="team-card-member"
  >
    <div class="team-card-member__header">
      <BaseAvatar
        :name="member.name"
        :src="useCdnAsset(member.avatar)"
        size="lg"
      />
      <div
        v-if="memberSocialLinks.length"
        class="team-card-member__social"
      >
        <SocialLink
          v-for="[key, url] in memberSocialLinks"
          :key="key"
          :href="url"
          :icon="key"
          :label="`${SOCIAL_NETWORK_LABELS[key]} de ${member.name}`"
          size="sm"
        />
      </div>
    </div>

    <div class="team-card-member__info">
      <h3>{{ member.name }}</h3>
      <p class="team-card-member__role">{{ member.role }}</p>
      <p>{{ member.bio }}</p>
      <blockquote v-if="member.quote">"{{ member.quote }}"</blockquote>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useCdnAsset } from '@/composables'

import BaseAvatar from '@/components/ui/avatar/BaseAvatar.vue'
import SocialLink from '@/components/ui/SocialLink.vue'

import { SOCIAL_NETWORK_LABELS, socialLinksOf, type TeamMember } from '@/types/team'

const props = defineProps<{
  member?: TeamMember
}>()

const memberSocialLinks = computed(() => socialLinksOf(props.member?.social))
</script>

<style scoped lang="scss">
.team-card-member {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: var(--space-10);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.team-card-member__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.team-card-member__social {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.team-card-member__info {
  h3 {
    font-size: 1.15rem;
    margin-bottom: 0.2rem;
  }
  p {
    font-size: 0.9rem;
    line-height: 1.7;
  }

  blockquote {
    margin: var(--space-4) 0 0;
    padding: var(--space-4) var(--space-5);
    background: var(--bg-alt);
    border-left: 3px solid var(--lime);
    border-radius: 0 var(--radius) var(--radius) 0;
    font-size: var(--text-sm);
    font-style: italic;
    color: var(--muted);
    line-height: 1.65;
  }
}

.team-card-member__role {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--purple);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: var(--space-2);
}
</style>
