# Worker :: Mail

Cloudflare Worker that receives the site's contact form and delivers it by
e-mail through [Resend](https://resend.com). It is deployed on its own with
Wrangler and is not part of the site's `yarn build`.

- **Domain:** `mail.purplecomunicacao.com.br` (custom domain, `wrangler.toml`).
- **Caller:** `useMail` (`src/composables/useMail.ts`), through
  `VITE_CONTACT_API_URL`.
- **Recipient:** Purple's inbox (`EMAIL_TO`).

## Request flow

`POST /` with a JSON body `{ contact, interest, metadata, turnstileToken }`:

| Step | Check                                                                                      | Failure response |
| ---- | ------------------------------------------------------------------------------------------ | ---------------- |
| 1    | `OPTIONS` preflight answers right away                                                     | n/a              |
| 2    | `Origin` is in the allowlist (`ALLOWED_ORIGIN`, `ALLOWED_ORIGIN_WWW`, local dev ports)     | `403`            |
| 3    | Method is `POST`                                                                           | `405`            |
| 4    | Required fields are present (`src/validate.ts`)                                            | `400`            |
| 5    | Turnstile token is re-validated server-side (`siteverify`, `TURNSTILE_SECRET`)             | `403`            |
| 6    | E-mail is sent through the Resend API, body built by `src/emailTemplate.ts` (HTML-escaped) | `500`            |

On success the response is `{ "success": true }`. The allowed origins live in
`workers/shared/http.ts`, shared with the blog Worker.

## Configuration

| Name                 | Kind   | Purpose                                       |
| -------------------- | ------ | --------------------------------------------- |
| `ALLOWED_ORIGIN`     | var    | Site origin allowed to post                   |
| `ALLOWED_ORIGIN_WWW` | var    | `www` variant of the site origin              |
| `ALLOWED_ORIGIN_LAN` | local  | Optional LAN origin, `.dev.vars` only         |
| `TURNSTILE_SECRET`   | secret | Turnstile server-side validation              |
| `RESEND_API_KEY`     | secret | Resend API authentication                     |
| `EMAIL_FROM`         | secret | Sender address (domain verified in Resend)    |
| `EMAIL_TO`           | secret | Inbox that receives the contact messages      |
| `SENTRY_DSN`         | secret | Sentry project DSN; monitoring off without it |

Vars are committed in `wrangler.toml`. **Every other value must be a secret.**
`wrangler deploy` replaces the Worker's variables with the `[vars]` of
`wrangler.toml`, so a variable created in the Cloudflare dashboard is erased by
the next deploy. Local development reads all of them from `.dev.vars`
(git-ignored).

## Install and deploy

```bash
cd workers/mail

yarn install

yarn wrangler secret put TURNSTILE_SECRET
yarn wrangler secret put RESEND_API_KEY
yarn wrangler secret put EMAIL_FROM
yarn wrangler secret put EMAIL_TO
yarn wrangler secret put SENTRY_DSN

yarn wrangler secret list

yarn wrangler deploy
```

## Development and tests

```bash
yarn dev
yarn test
yarn ts
```

`yarn dev` serves the Worker on `http://localhost:8787`. Tests stub `fetch`, so
neither Turnstile nor Resend is reached (see `src/docs/TESTING.md`).

## Monitoring (Sentry)

The Worker is wrapped with `withSentry` (`@sentry/cloudflare`, which needs the
`nodejs_compat` flag in `wrangler.toml`). Options come from
`workers/shared/monitoring.ts`, shared by both Workers: one Sentry project for
the whole site, events tagged `service: mail-worker`, no tracing, and data
collection off (no IP, cookies, headers, request bodies, query strings or
stack-frame variables). Without `SENTRY_DSN` the SDK stays off, which is the
case in `yarn dev` and in tests.

Every failure listed under Troubleshooting goes through `reportFailure`: it
writes the Worker log and sends the same event to Sentry as an error message
with its details.

## Troubleshooting

When Resend rejects a message, the client gets `500` with
`Erro ao enviar e-mail.` and the Worker logs `resend_failed` with Resend's
status code and the `name` and `message` of its error (never the raw body).
An unexpected error logs `request_failed`. Both also reach Sentry. Watch the
log live with:

```bash
yarn wrangler tail
```
