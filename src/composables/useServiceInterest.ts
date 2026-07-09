import services from '@/data/services.json'

export const SERVICE_INTEREST_OPTIONS: string[] = [
  ...services.catalog.map(service => service.title),
  ...services.packages.items.map(pkg => pkg.name),
  'Orçamento geral',
  'Outro',
]

type QueryValue = string | null | undefined

export const resolveServiceInterest = (slug?: QueryValue | QueryValue[]): string => {
  const value = Array.isArray(slug) ? slug[0] : slug
  if (!value) return ''

  return (
    services.catalog.find(service => service.id === value)?.title ??
    services.packages.items.find(pkg => pkg.id === value)?.name ??
    ''
  )
}
