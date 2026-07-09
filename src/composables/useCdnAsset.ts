const CDN_URL = import.meta.env.VITE_CDN_URL as string

export const useCdnAsset = (path: string | undefined): string | undefined => {
  if (!path) return undefined
  return `${CDN_URL}/${path}`
}
