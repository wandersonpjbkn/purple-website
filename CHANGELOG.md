# Changelog — site Purple

Histórico de decisões e mudanças relevantes do projeto. Os docs em
[`src/docs/`](src/docs/README.md) descrevem **só o estado atual**; qualquer
menção ao que já mudou/foi decidido pertence aqui, não lá — ver a regra em
[`src/docs/README.md`](src/docs/README.md).

## 2026-07-09

- **Regra 60/30/10 de cor formalizada + `yarn color-audit`** — a proporção
  neutro/roxo/lima já existia na prática mas não estava escrita em nenhum
  doc; nova seção em `DESIGN_SYSTEM.md` formaliza os números e
  `scripts/color-audit.mjs` (relatório, não teste) confere por screenshot
  full-page de cada rota, classificando pixels por matiz (HSL) sem depender
  de lib de imagem nova. `scripts/prerender.mjs` teve `ROUTES` e
  `resolveChromium` extraídos para `scripts/shared.mjs`, reaproveitados
  pelos dois scripts.
- **Blog migrado de build-time para runtime (worker + cache)** — o
  `vite-plugin-blog.ts` baixava **todos** os posts (já com HTML) durante o
  build e os embutia no bundle JS via `virtual:blog-posts`: com o catálogo
  crescendo, todo visitante baixaria todos os posts, e publicar exigia rebuild
  no Render. Removidos o plugin e o módulo virtual; o Worker ganhou
  `GET /index` (metadados sem HTML) e `GET /posts/:slug` (post completo), com
  edge cache (`caches.default`), `Cache-Control` (300s/3600s), ETag fraco +
  `304`, CORS anexado por request e listagem R2 paginada por cursor (>1000
  objetos). As rotas legadas `GET /` e `GET /posts` seguem no ar durante a
  transição. `POST /deploy` passou a purgar o cache do índice; o hook do
  Render virou opcional (só refresca o snapshot SEO prerenderizado).
- **Cache client-side em IndexedDB (stale-while-revalidate)** — novos
  `useBlogData` (singleton reativo: índice compartilhado, dedupe, throttle de
  revalidação de 60s) e `useBlogCache` (DB `purple-blog`, stores `meta` e
  `posts`, invalidação por stamp = ETag do índice; sem IndexedDB degrada para
  network-only). Visitas repetidas praticamente não geram requests — relevante
  no free tier do Cloudflare/Render. Tipos do blog agora em
  `src/types/blog.ts`; `BlogPage` ganhou skeleton de carregamento e
  `BlogPostPage` estados `loading | ready | not-found` (sem flash de 404).
- **Barra de categorias virou filtro de verdade (`CategoryFilter.vue`)** — a
  barra sticky renderizava todas as categorias como pills, crescendo sem
  limite conforme os posts. Agora: "Todos" + até 4 quick pills + botão
  "Filtrar" com dropdown acessível (aria-expanded/haspopup, Escape devolve o
  foco, click-outside) listando todas as categorias com contagem; no mobile
  (≤640px) as quick pills somem e a barra vira uma linha só. Novo ícone
  `chevron-down` no registry.
- **Typewriter do hero pausa fora de vista e não derruba mais o layout** —
  extraído para `useTypewriter` (composable): `IntersectionObserver` +
  `visibilitychange` pausam o loop quando o hero sai da viewport ou a aba
  fica oculta (retoma do ponto exato); no template, sizers invisíveis em
  `inline-grid` (`hero__rotator`) reservam a altura/largura da frase mais
  longa — o conteúdo abaixo não pula quando uma frase quebra em 2 linhas.
- **Título do hero não corta mais em 360px** — o piso do clamp global de h1
  (2.5rem) + `white-space: nowrap` no `<em>` estouravam a largura. Override
  local no tier `xs` (`clamp(1.9rem, 9vw, 2.5rem)`) e, se ainda precisar
  quebrar, o sublinhado lime vira `background` clonado por fragmento
  (`box-decoration-break`), já que o `::before` absoluto não acompanha quebra
  de linha. Removida regra morta `.hero__typewriter.is-complete::before`.
- **Prerender espera o conteúdo do blog** — `scripts/prerender.mjs` aguarda os
  cards (ou o estado vazio) nas rotas `/` e `/blog` antes do snapshot, com
  timeout tolerante; CORS do Worker ganhou `localhost:4180` (prerender) e
  `localhost:4173` (vite preview).
- **Testes** — suíte da raiz foi de 46 para 66 (novos specs: `useBlogData`,
  `useBlogCache` com `fake-indexeddb` dev-only, `useTypewriter`,
  `CategoryFilter`; `vite-plugin-blog.spec.ts` removido junto do plugin);
  `workers/blog` foi de 14 para 26 (rotas, cache/ETag/304, CORS, deploy).

## 2026-07-08

- **Testes corrigidos pós-migração do blog para R2** — a suíte quebrou (12/49
  falhando) porque `src/plugins/vite-plugin-blog.spec.ts` ainda testava
  funções de parsing (`slugify`, `parseFrontmatter`, `markdownToHtml`,
  `countWords`) que foram movidas para `workers/blog/src/index.ts`, e
  `useBlog.spec.ts` dependia de rede (`virtual:blog-posts` fazia fetch real
  para `localhost:8787`). Reescrito para testar o comportamento atual do
  plugin (fetch mockado) e mockar `virtual:blog-posts` com fixture
  determinística, respectivamente.
- **Cobertura de teste adicionada em `workers/blog`** — as funções de parsing
  de markdown, movidas para lá sem nenhum teste, ganharam `vitest` + suíte
  própria (`workers/blog/src/__tests__/index.spec.ts`).
- **`workers/shared/http.ts` extraído** — `json()` e a lista de origens
  permitidas (CORS) estavam duplicados entre `workers/mail` e `workers/blog`;
  consolidados num módulo compartilhado.
- **IP de LAN de desenvolvimento removido do código** — `192.168.15.12:5173`
  estava hardcoded no CORS de ambos os Workers; a origem local extra agora é
  opcional via env (`ALLOWED_ORIGIN_LAN`), não commitada.
- **Mapeamento categoria de blog → serviço movido para `services.json`** —
  antes vivia como uma tabela hardcoded (`CATEGORY_TO_SERVICE`) dentro de
  `BlogPostPage.vue`, acoplando blog e catálogo de serviços sem que nenhum dos
  dois soubesse do outro. Agora cada serviço declara suas `blogCategories`.
- **Dead code removido** — `language` era computado em
  `workers/mail/src/emailTemplate.ts` e nunca usado no template do e-mail.
- **Estado vazio/erro adicionado ao blog** — se o fetch para `workers/blog`
  falhar, `vite-plugin-blog.ts` já caía graciosamente para `posts = []`, mas a
  Home e a página de Blog não sinalizavam nada ao usuário (grade vazia,
  silenciosa). Ambas passaram a mostrar uma mensagem quando não há posts.
- **Docs de `src/docs/` revisadas** — histórico misturado ao estado atual foi
  extraído para este arquivo; `ARCHITECTURE.md`, `CONTENT_MODEL.md` e
  `TESTING.md` foram atualizadas para descrever a arquitetura real
  pós-migração do blog (estavam desatualizadas, ainda descrevendo
  `content/posts/*.md` local).
- **Hierarquia de CTA corrigida (funil macro/micro)** — o botão de marca
  (primário) levava ao formulário `/contato` e o link discreto (terciário)
  levava ao WhatsApp — invertido em relação ao funil real (macro conversão =
  WhatsApp; micro I = formulário; micro II = navegação de conteúdo).
  `CtaBanner.vue` redesenhado com os 3 níveis, novos composables
  `useWhatsapp.ts`/`useCtaTracking.ts`, botão fixo do `AppHeader` também
  aponta para WhatsApp, e cliques/envios agora disparam eventos GTM
  (`whatsapp_click`, `contact_form_submit`) — antes só existia pageview
  automático, sem medir a origem de cada conversão.
- **`CookieConsent.vue` passou a bloquear a página** — backdrop, `overflow`
  travado, focus trap real (Tab/Shift+Tab), `aria-modal="true"` e Esc
  equivalente a "Recusar" (decisão: ausência de escolha explícita não concede
  analytics). Aplica viés de ancoragem de forma deliberada e documentada
  (comentário permanente no componente — ver `CONVENTIONS.md` § Vieses
  cognitivos, regra nova).
- **Acordeões padronizados** — `FaqSection.vue` (um item por vez) migrado
  para o mesmo modelo multi-aberto de `ServicesPage.vue`.
- **Roteamento consolidado** — `pages.json`/`footer.json` guardavam `path`
  como string literal duplicada dos mesmos paths já declarados em
  `router/modules/base.ts`, sem referência cruzada (renomear um path
  quebraria o menu/rodapé silenciosamente). Agora referenciam rotas por
  `routeName`, resolvido via `RouterLink :to="{ name }"`. `blog.ts`
  simplificado (removida a indireção `${name}-post`/`${name}-author`).
- **Barrel de composables completo** — `useMail`, `useTurnstile`,
  `useContactForm` (+ os novos `useWhatsapp`/`useCtaTracking`) passaram a ser
  reexportados por `src/composables/index.ts`; imports diretos por caminho
  de arquivo removidos.
- **Alvos de toque padronizados** — token `--tap-target-min` (44px) em
  `_tokens.scss`, aplicado no hambúrguer, limpar-busca do blog, rodapé
  (cookies + redes sociais) e "Saiba mais" de Serviços.
- **Menu mobile: Esc e clique-fora** — Esc já fechava; clique-fora passou a
  usar `onClickOutside` do `@vueuse/core` (primeiro uso real dessa
  dependência, que estava instalada e nunca importada).
- **`workers/mail` ganhou suíte de testes e `try/catch`** — o handler não
  tinha nenhum tratamento de erro; um corpo JSON inválido ou falha de rede
  ao Turnstile/Resend propagava exceção sem os headers de CORS, fazendo o
  browser reportar erro de CORS em vez da causa real. Validação de campos
  extraída para função pura testável.
- **`workers/blog`: comparação de token não constant-time** — o endpoint
  `/deploy` comparava o token com `!==` simples; trocado por comparação
  constant-time (`workers/shared/security.ts`).
- **`markdownToHtml` ganhou suporte a imagem** (`![alt](src)`) — antes caía
  na regra de link e quebrava (`!<a href="src">alt</a>`).
- **Turnstile: retry/poll** — `useTurnstile.ts` falhava direto se o script do
  CDN ainda não tivesse carregado (rede lenta); agora tenta por até ~8s antes
  de desistir.
- **`eslint-plugin-sonarjs` adicionado** — achados reais corrigidos: 2
  asserções de teste mais específicas, uma função com complexidade cognitiva
  acima do limite (`workers/blog`'s `fetch`, dividida em
  `handleDeployRequest`/`listPosts`), uma classe de caractere redundante
  (`[\w]` → `\w`); 4 alertas de "regex super-linear" verificados
  empiricamente como falsos positivos (testados com entradas adversariais de
  50k caracteres, <1ms) e suprimidos pontualmente com justificativa.
- **Dead code removido**: `.search-input` (CSS sem uso).
- **Kicker do hero (`home.json`) alinhado a pesquisa de público-alvo** —
  amostra pequena (5 respostas) mas direcional: as palavras mais citadas para
  descrever a dor do dia a dia concentram-se em "comunicação interna" e
  "liderança"; `hero.eyebrow` ajustado de "Comunicação" para "Comunicação
  Interna".

## jul/2026

- **Blog migrado de markdown local para Cloudflare Worker + R2** —
  `content/posts/*.md` (lido em build/dev time por `vite-plugin-blog.ts`, com
  `fs.watch` para HMR) foi substituído por um fetch HTTP a um Worker dedicado
  (`workers/blog`), que lê os arquivos de um bucket R2 e devolve os posts já
  processados (frontmatter + markdown→HTML). O conteúdo do blog deixou de
  estar versionado neste repositório.
- **Discovery de negócio concluída** — o modelo de negócio validou alvo
  (empresas de médio porte, 40+ colaboradores, sem área estruturada de
  comunicação/employer branding), oferta (catálogo de 7 serviços + 3 planos
  recorrentes + 3 projetos pontuais, sem preços publicados) e posicionamento
  ("entrega prática antes de consultoria"). Estado validado em
  [`POSITIONING.md`](src/docs/POSITIONING.md).
- **Hipótese de posicionamento via NR-1 descartada como porta de entrada** —
  a aposta inicial de usar a NR-1 (risco psicossocial) como gatilho legal de
  compra não foi o que a discovery confirmou; o modelo validou entrada pelo
  prático (LinkedIn/comunicados). O território "ambientes de trabalho
  saudáveis" seguiu como pano de fundo da marca (panorama de dados, blog); o
  gatilho NR-1 pode voltar como argumento comercial pontual, mas não é o
  produto nem o headline.
- **Placeholders de conteúdo preenchidos** — `src/content/placeholders.ts`
  (dois slots reservados, `{{POSITIONING_HOOK}}` e `{{SERVICE_OFFER}}`) foi
  aposentado: o conteúdo validado passou a viver em `home.json` (hero) e
  `services.json` (oferta); o rascunho `SERVICE_OFFER_DRAFT` foi absorvido no
  catálogo de `services.json`.
- **Stack legado do blog removido** — `src/data/posts.json` → `BlogList` →
  `BlogCard` foi removido; todo o blog, inclusive os destaques da Home,
  passou a ler de `virtual:blog-posts`.
- **Refator do repositório (Grupos 1-7)** — órfãos removidos; tokens
  centralizados em `_tokens.scss`; botão único (`BaseButton`); página
  Abordagem criada; consentimento LGPD autoral implementado; GTM passou a
  carregar só após opt-in.
- **Componentes duplicados consolidados** — o card de estatística duplicado
  entre Home e Sobre virou `StatCard`; o teaser de serviço duplicado entre
  Home e Abordagem virou `ServiceTeaserCard`; o hero de página interna virou
  `PageHero`. Os antigos `.panorama-card*`/`.data-stat-card*`/`.stats-band*`
  foram removidos.
- **Prop morta removida** — `alt` existia em `BaseAvatar` sem nunca chegar a
  `AvImage`/`AvInitials`; removida.
- **Iconografia real implementada** — `BaseIcon` passou a renderizar o
  conjunto próprio de `src/components/ui/icons.ts` (stroke + glifos de marca),
  no lugar de um placeholder.
- **Newsletter do footer removida** — o bloco não tinha backend por trás;
  removido do `AppFooter`.
- **Pass de UX** — correção de ícones escuro-sobre-escuro; rework de paleta
  (novos tokens `--section-dark`, `--lime-ink`, `--bg-rgb`;
  `--muted`/`--subtle`/`--on-dark-*` ajustados para AA); Abordagem e Blog
  passaram a linkar Serviços (fim dos becos sem saída); Serviços ganhou
  sub-nav fixa + catálogo em cards expansíveis; logo passou a renderizar
  inline via `BrandLogo`; footer ganhou redes sociais; páginas FAQ,
  Privacidade (LGPD) e 404 foram criadas; favicons/OG gerados a partir da
  marca; `prefers-reduced-motion`, skip-link e `:focus-visible` implementados.
- **Spec de guarda de placeholders removido** —
  `content/__tests__/placeholders.spec.ts` foi removido junto com os
  placeholders que ele protegia; seu inverso (garantir que o copy final foi
  publicado, sem tokens nem preços) passou a viver em
  `data/__tests__/services.spec.ts`.
