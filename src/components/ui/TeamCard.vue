<template>
  <article v-if="member && member.isVisibleTeamMember" class="team-card-member">
    <AuthorAvatar :name="member.name" size="lg" />

    <div class="team-card-member__info">
      <h3>{{ member.name }}</h3>
      <p class="team-card-member__role">{{ member.role }}</p>
      <p>{{ member.bio }}</p>
      <blockquote v-if="member.quote">"{{ member.quote }}"</blockquote>
    </div>
  </article>
</template>

<script setup lang="ts">
import AuthorAvatar from '@/components/ui/AuthorAvatar.vue'

defineProps<{
  member?: {
    name: string
    role: string
    bio: string
    isVisibleTeamMember: boolean
    quote?: string
  }
}>()
</script>

<style scoped lang="scss">
.team-card-member {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  padding: 2.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
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
    margin: 1rem 0 0;
    padding: 1rem 1.25rem;
    background: var(--bg-alt);
    border-left: 3px solid var(--lime);
    border-radius: 0 var(--radius) var(--radius) 0;
    font-size: 0.875rem;
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
  margin-bottom: 0.5rem;
}
</style>
