/**
 * Static server over the built `dist/`, with SPA fallback — the thing the
 * prerender points a headless browser at.
 *
 * The shell is read once, up front, and kept in memory. Reading it per request
 * would hand the browser whatever `dist/index.html` holds at that moment, and
 * the prerender rewrites that very file when it snapshots `/`: every later
 * route would then boot on top of the home's frozen `<head>`. Tags the app
 * manages get replaced on mount (unhead deduplicates `canonical`, OG and
 * `description` by key), but an inline `<script>` has no key to match — so the
 * home's JSON-LD would survive and ship alongside the route's own.
 */
import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
}

// Vite emits an empty mount point; a snapshot has the rendered app inside it.
const EMPTY_APP_ROOT = '<div id="app"></div>'

const readShell = async dist => {
  const indexFile = join(dist, 'index.html')

  if (!existsSync(indexFile)) {
    throw new Error('dist/index.html não existe. Rode `yarn build` antes.')
  }

  const shell = await readFile(indexFile, 'utf-8')

  // Reusing a snapshot as the shell duplicates whatever the app re-emits on
  // top of it, so refuse instead of quietly publishing corrupted <head>s.
  if (!shell.includes(EMPTY_APP_ROOT)) {
    throw new Error('dist/index.html já é um snapshot de uma execução anterior. Rode `yarn build` antes do prerender.')
  }

  return shell
}

export const createDistServer = async ({ dist, port }) => {
  const shell = await readShell(dist)

  const server = http.createServer(async (req, res) => {
    const path = decodeURIComponent((req.url ?? '/').split('?')[0])
    const file = join(dist, path)

    // No extension means a client-side route, never a file on disk.
    if (!extname(file) || !existsSync(file)) {
      res.setHeader('Content-Type', MIME['.html'])
      res.end(shell)
      return
    }

    try {
      const buf = await readFile(file)
      res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream')
      res.end(buf)
    } catch {
      res.statusCode = 404
      res.end('not found')
    }
  })

  await new Promise(resolve => server.listen(port, resolve))

  return server
}
