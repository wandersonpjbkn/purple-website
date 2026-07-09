export const SOCIAL_NETWORK_LABELS: Record<string, string> = {
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
  medium: 'Medium',
}

export interface TeamMember {
  slug: string
  name: string
  role: string
  bio: string
  quote?: string
  avatar?: string
  social?: {
    linkedin?: string
    instagram?: string
    medium?: string
  }
  isAuthor: boolean // Whether this member also authors blog posts (used to resolve bylines).
  isVisibleTeamMember: boolean
}

export const socialLinksOf = (social?: TeamMember['social']): [string, string][] =>
  Object.entries(social ?? {}).filter((entry): entry is [string, string] => !!entry[1])
