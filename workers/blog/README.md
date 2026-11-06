# Worker :: Blog

Cloudflare Worker that serves the blog. Posts are Markdown files in the R2
bucket `purple-comunica` (`posts/<slug>.md`). The Worker parses them at request
time, so a new post goes live without rebuilding the site. It is deployed on
its own with Wrangler and is not part of the site's `yarn build`.

It answers on two kinds of routes (`wrangler.toml`):

- **Posts API** on `blog.purplecomunicacao.com.br`, consumed by `useBlogData`
  (`src/composables/useBlogData.ts`) through `VITE_POSTS_API_URL`.
- **Site pages** on `purplecomunicacao.com.br/blog/*` (and `www.`) plus
  `/sitemap-posts.xml`, so crawlers get per-post meta tags without running JS.

## Routes

| Route                    | What it returns                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `GET /index`             | Post metadata without `html`, newest first. Edge cache 300 s, weak `ETag`, `304` on `If-None-Match`           |
| `GET /posts/:slug`       | Full post with rendered `html`, or `404`. Edge cache 3600 s, weak `ETag`                                      |
| `GET /` and `GET /posts` | Full post list with `html` (no front-end consumer)                                                            |
| `POST /deploy`           | Authenticated by `BLOG_DEPLOY_TOKEN`; purges the cached `/index` and calls the Render deploy hook             |
| `GET /sitemap-posts.xml` | One `<url>` per post, `<lastmod>` from the post date                                                          |
| `GET /blog/:slug`        | SPA shell (`spa-shell.html` from Render) with the post's title, meta, Open Graph and JSON-LD; `404` if absent |
| `GET /blog/autor/:slug`  | Prerendered author snapshot from Render, or the SPA shell                                                     |

A malformed slug is not an error: `/posts/:slug` answers `404` and `/blog/*`
serves the Render origin, without logging. Any non-`GET`/`HEAD` request or
error on `/blog/*` is passed through to Render,
so a Worker failure falls back to the plain SPA instead of breaking the page.
API routes check `Origin` against the shared allowlist (`workers/shared/http.ts`).

## Source map

| File              | Responsibility                                                                                                          |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`    | Router, R2 listing, frontmatter parsing, edge cache, `/deploy`, posts sitemap                                           |
| `src/markdown.ts` | Markdown to HTML (`marked`, GFM): heading anchors, tables, CDN images, callouts, escaped raw HTML, URL scheme allowlist |
| `src/postPage.ts` | Per-post meta tags injected into the SPA shell with `HTMLRewriter`                                                      |
| `../shared/`      | JSON/CORS helpers, constant-time token comparison and Sentry options, shared with the mail Worker                       |

The rendered HTML is safe for the front's `v-html` because sanitizing happens
here (`markdown.ts`). The full contract is in `src/docs/ARCHITECTURE.md`
("Blog via Cloudflare Worker + R2") and the post format in
`src/docs/CONTENT_MODEL.md`.

## Configuration

| Name                 | Kind   | Purpose                                                        |
| -------------------- | ------ | -------------------------------------------------------------- |
| `POSTS_BUCKET`       | R2     | Bucket `purple-comunica` holding `posts/<slug>.md`             |
| `ALLOWED_ORIGIN`     | var    | Site origin allowed to call the API                            |
| `ALLOWED_ORIGIN_WWW` | var    | `www` variant of the site origin                               |
| `SITE_ORIGIN`        | var    | Render origin that serves the SPA shell and snapshots          |
| `CDN_URL`            | var    | Image CDN, same value as the site's `VITE_CDN_URL`             |
| `ALLOWED_ORIGIN_LAN` | local  | Optional LAN origin, `.dev.vars` only                          |
| `BLOG_DEPLOY_TOKEN`  | secret | Token expected in the `Authorization` header of `POST /deploy` |
| `RENDER_DEPLOY_HOOK` | secret | Render deploy hook URL, refreshes the prerendered `/blog`      |
| `SENTRY_DSN`         | secret | Sentry project DSN; monitoring off without it                  |

Vars are committed in `wrangler.toml`. **Every other value must be a secret.**
`wrangler deploy` replaces the Worker's variables with the `[vars]` of
`wrangler.toml`, so a variable created in the Cloudflare dashboard is erased by
the next deploy. Local development reads the secrets from `.dev.vars`
(git-ignored).

## Install and deploy

```bash
cd workers/blog

yarn install

yarn wrangler secret put BLOG_DEPLOY_TOKEN
yarn wrangler secret put RENDER_DEPLOY_HOOK
yarn wrangler secret put SENTRY_DSN

yarn wrangler secret list

yarn wrangler deploy
```

## Publishing a post

```bash
yarn wrangler r2 object put purple-comunica/posts/<slug>.md --file <file>.md --remote
curl -X POST https://blog.purplecomunicacao.com.br/deploy -H "Authorization: <BLOG_DEPLOY_TOKEN>"
```

The `/deploy` call is optional for the content itself: `/index` expires in
5 minutes anyway. It speeds up the local edge and refreshes Render's SEO
snapshot.

## Development and tests

```bash
yarn dev
yarn dev --remote
yarn test
yarn ts
```

`yarn dev` uses an empty local R2; `yarn dev --remote` reads the real bucket.
`HTMLRewriter` only exists in the Workers runtime, so `sitePages.spec.ts` stubs
it (see `src/docs/TESTING.md`).

## Monitoring (Sentry)

The Worker is wrapped with `withSentry` (`@sentry/cloudflare`, which needs the
`nodejs_compat` flag in `wrangler.toml`). Options come from
`workers/shared/monitoring.ts`, shared by both Workers: one Sentry project for
the whole site, events tagged `service: blog-worker`, no tracing, and data
collection off (no IP, cookies, headers, request bodies, query strings or
stack-frame variables). Without `SENTRY_DSN` the SDK stays off, which is the
case in `yarn dev` and in tests. `SENTRY_ENVIRONMENT` (optional) tags events,
defaulting to `production`; set it in `.dev.vars` if you test with a DSN
locally.

Every failure listed under Troubleshooting goes through `reportFailure`: it
writes the Worker log and sends the same event to Sentry as an error message
with its details.

## Troubleshooting

Error responses never carry exception details. The Worker logs the reason
instead: `posts_failed` (API routes), `deploy_failed` (`/deploy`) and
`deploy_hook_failed` (Render hook rejected or unreachable; it runs after
`/deploy` already answered `200`) and `site_page_failed` (a `/blog/*` page
fell back to the Render origin). All of them also reach Sentry. Watch the log
live with:

```bash
yarn wrangler tail
```
