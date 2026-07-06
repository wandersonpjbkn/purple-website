# Purple Comunicação

Site institucional em Vue 3 + Vite + TypeScript, com blog em Markdown e prerender estático para SEO.

## Requisitos

- Node `^20.19.0` ou `>=22.12.0`
- [Yarn](https://yarnpkg.com/) (o projeto usa `yarn.lock` — não use `npm install`)

## Instalação

```bash
yarn install
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores:

```bash
cp .env.example .env
```

| Variável                   | Uso                                                    |
| -------------------------- | ------------------------------------------------------ |
| `VITE_SITE_URL`            | URL canônica do site, usada em SEO/meta tags           |
| `VITE_EMAILJS_SERVICE_ID`  | Envio do formulário de contato via EmailJS             |
| `VITE_EMAILJS_TEMPLATE_ID` | Envio do formulário de contato via EmailJS             |
| `VITE_EMAILJS_PUBLIC_KEY`  | Envio do formulário de contato via EmailJS             |
| `VITE_GTM_ID`              | Google Tag Manager (só carrega após opt-in de cookies) |
| `VITE_BASE_PHONE`          | Número de WhatsApp (formato internacional, só dígitos) |
| `VITE_BASE_TEL`            | Telefone exibido na página de Contato                  |
| `VITE_BASE_EMAIL`          | E-mail exibido na página de Contato                    |
| `VITE_BASE_ADDRESS`        | Endereço exibido na página de Contato                  |
| `VITE_CDN_URL`             | Base da CDN para imagens de blog/time                  |

O site sobe sem essas variáveis, mas contato, WhatsApp, imagens via CDN e analytics ficam degradados.

## Rodando o projeto

```bash
yarn dev
```

## Scripts disponíveis

| Script              | Comando                        | O que faz                                                                 |
| ------------------- | ------------------------------ | ------------------------------------------------------------------------- |
| `yarn dev`          | `vite`                         | Sobe o servidor de desenvolvimento                                        |
| `yarn build`        | `run-p ts "build:only {@}" --` | Checa tipos e gera o build de produção em paralelo                        |
| `yarn build:only`   | `vite build`                   | Só o build de produção (sem checar tipos)                                 |
| `yarn build:static` | `run-s build prerender`        | Build + prerender das rotas estáticas                                     |
| `yarn prerender`    | `node scripts/prerender.mjs`   | Gera HTML prerenderizado (`dist/<rota>/index.html`) via Chromium headless |
| `yarn preview`      | `vite preview`                 | Serve o build de produção localmente                                      |
| `yarn ts`           | `vue-tsc --build`              | Só checagem de tipos                                                      |
| `yarn test`         | `vitest run`                   | Roda os testes uma vez                                                    |
| `yarn test:watch`   | `vitest`                       | Roda os testes em modo watch                                              |
| `yarn lint`         | `eslint . --fix --cache`       | Lint com autofix                                                          |
| `yarn format`       | `prettier --write src/`        | Formata o código-fonte                                                    |

## Documentação

O guia completo de arquitetura, modelo de conteúdo, design system, convenções de código e testes está em [`src/docs/README.md`](src/docs/README.md).
