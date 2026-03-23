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

export interface StatItem {
  number: string
  suffix: string
  label: string
}

export interface ProcessStep {
  title: string
  description: string
}

export interface ServiceItem {
  id: string
  icon: string
  title: string
  tagline: string
  description: string
  benefits: string[]
  process: string[]
  featured?: boolean
}
