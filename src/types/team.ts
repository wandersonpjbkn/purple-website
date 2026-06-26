export interface TeamMember {
  slug: string
  name: string
  role: string
  bio: string
  quote?: string
  avatar?: string
  linkedin: string
  /** Whether this member also authors blog posts (used to resolve bylines). */
  isAuthor: boolean
  /** Whether this member it's not to be shown. */
  isVisibleTeamMember: boolean
}
