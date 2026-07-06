const CDN = import.meta.env.VITE_CDN_URL

export const useCdnAsset = (path: string | undefined) => {
  if (!path) return
  return `${CDN}/${path}`
}
