export interface HeroContent {
  eyebrow?: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta?: string
}

export interface ServiceItem {
  title: string
  description: string
  cta: string
}

export interface TestimonialItem {
  name: string
  role: string
  text: string
}

export interface TeamMember {
  name: string
  bio: string
  quote?: string
}
