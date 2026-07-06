export interface TeamMember {
  slug: string
  name: string
  role: string
  bio: string
  quote?: string
  avatar?: string
  linkedin: string
  isAuthor: boolean // Whether this member also authors blog posts (used to resolve bylines).
  isVisibleTeamMember: boolean // Whether this member it's not to be shown.
}
