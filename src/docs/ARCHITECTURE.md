# Arquitetura — decisões

Este doc guarda só o que o código não explica: por que as peças estão
montadas assim e o que não pode ser afrouxado. Estrutura, rotas, endpoints,
TTLs e assinaturas se leem no código (`src/router/modules/`,
`src/composables/index.ts`, `workers/*/src/`) e nos READMEs dos Workers.

## Visão geral

SPA em Vue 3 + Vite servida como site estático pelo Render, com prerender das
rotas fixas para SEO. Dois Cloudflare Workers ficam fora do build do site:
`workers/blog` (posts em Markdown num bucket R2 e as páginas `/blog/*` do
domínio principal) e `workers/mail` (formulário de contato). O conteúdo do
blog não está neste repositório.

## Blog

- **Posts em runtime.** O front busca o índice e cada post no Worker; o
  bundle não carrega post nenhum, e post novo aparece sem rebuild no Render.
- **Fonte única.** Todo o blog, inclusive os destaques da Home, lê de
  `useBlogData`. Não criar outra fonte de posts.
- **Falha de rede é silenciosa por design.** O estado mantém o cache (ou a
  lista vazia); a página mostra skeleton durante a carga e só depois o aviso
  de erro. O 404 de post nunca pisca enquanto carrega.
- **O parser é a única barreira contra XSS.** `BlogPostPage` usa `v-html`
  sem sanitizar no front porque `workers/blog/src/markdown.ts` escapa HTML
  cru e só aceita esquemas de link permitidos. Mexer no parser pede a
  regressão de conteúdo descrita em [`TESTING`](TESTING.md).
- **`/deploy` é opcional para quem publica.** O conteúdo aparece quando o
  cache do `/index` expira; o `/deploy` só adianta isso no PoP local e chama
  o hook do Render, que refresca o snapshot SEO de `/blog`. Os TTLs do edge
  são curtos justamente porque a purga do `/deploy` não alcança os outros
  datacenters.
- **Edge cache sem CORS.** As respostas são guardadas sem cabeçalhos CORS, e
  o `Access-Control-Allow-Origin` é anexado a cada pedido.

### Páginas `/blog/*` no domínio principal

O Worker atende `/blog/*` para que crawler receba título, canonical, Open
Graph e JSON-LD do post sem executar JS: ele reescreve o `<head>` do shell do
SPA e deixa o `<body>` intocado.

- **Qualquer falha cai na origem (Render).** O pior caso é o comportamento da
  catch-all do SPA, nunca uma página quebrada.
- **O HTML não vai para o edge cache:** o shell muda a cada deploy, com novos
  hashes de asset.
- **O JSON-LD injetado usa a mesma chave do `usePageMeta`** (`data-hid`), para
  o unhead reaproveitar o bloco ao montar em vez de duplicá-lo.
- **O head do post existe em dois lugares** (Worker e `usePageMeta`), em
  runtimes diferentes: mudar um exige espelhar no outro.
  `og:image:width/height` só saem para a imagem padrão, porque a capa não tem
  dimensão conhecida.
- **`/sitemap-posts.xml` não é um sitemap index** e não lê o `sitemap.xml` da
  origem: isso faria o Worker pedir uma URL da própria rota.

## Formulário de contato e Workers

- **O token do Turnstile é revalidado no servidor** (`siteverify`); o widget
  no navegador sozinho não protege o envio.
- **Todo valor não público é secret.** Variável criada no painel da
  Cloudflare é apagada pelo próximo `wrangler deploy`, que substitui as
  variáveis pelo `[vars]` do `wrangler.toml`. Comandos nos READMEs de
  `workers/mail` e `workers/blog`.
- **Resposta de erro nunca carrega o detalhe da exceção.** O motivo vai para
  o log do Worker, com nome de evento, e para o Sentry pelo mesmo
  `reportFailure` (`workers/shared/monitoring.ts`). Entrada malformada de
  quem chama não é falha: responde `400`/`404` (ou cai na origem) sem
  registrar, para bot não gastar a cota nem levar dado do formulário ao
  Sentry.
- **Sentry sem dado pessoal.** Um projeto só para o site, separado por tag
  `service` (`mail-worker`, `blog-worker`, `frontend`), sem tracing e com a
  coleta do SDK desligada (IP, cookies, cabeçalhos, corpos, query string,
  variáveis da pilha). Por isso fica fora do aviso de cookies, e a Política
  de Privacidade registra o monitoramento de erros. Decisão do dono
  (2026-11-06): "esses dados não são importantes para o fluxo e é bom ter
  isso registrado na politica". No front, a mesma razão tira a sessão por
  visita (`BrowserSession`), porque só erro é enviado e nunca contagem de
  visitas, e as props dos componentes (`attachProps`), que levariam o valor
  de um campo do formulário junto do erro.
- **No front, o Sentry só liga no host de `VITE_SITE_URL`.** O prerender
  roda o build de produção num Chromium em `localhost`; sem essa guarda, o
  erro do snapshot (Worker fora do ar, por exemplo) iria ao Sentry como se
  fosse de visitante. O SDK é importado sob demanda para não pesar no chunk
  de entrada de quem nunca o usa.
- **Source map só com `SENTRY_AUTH_TOKEN`.** `hidden` só tira o comentário
  do bundle; o `.map` em `dist/` seria servido publicamente pelo Render.
  Por isso ele só é gerado quando o plugin vai subi-lo e apagá-lo.
- **"Pedir proposta" chega com o serviço preenchido:** o `id` vai na query da
  rota e `useServiceInterest` o resolve para o rótulo do campo.

## SEO

- **`robots` tem fonte única:** só o `App.vue` define a meta; `usePageMeta`
  não emite, para não haver duas fontes divergentes. O site está aberto à
  indexação por decisão explícita.
- **O `robots.txt` servido não é só o do repo.** A Cloudflare injeta na
  frente um preâmbulo de Content Signals e `Disallow` para crawlers de IA.
  Essa decisão é de negócio e mora no painel da Cloudflare.

## Build, prerender e deploy

- **O prerender fica fora do `yarn build`** porque precisa de um Chromium;
  o Render roda `yarn build:static` no Build Command.
- **Snapshot sem posts não derruba o deploy.** Se o Worker não responde
  durante o prerender, `/` e `/blog` saem sem cards, o bloco de erro é
  removido do HTML (estado de runtime não pode congelar como conteúdo) e o
  script avisa por rota e num resumo final. Autor sem posts não é gravado,
  para não congelar "0 posts publicados".
- **`spa-shell.html` é emitido antes de o prerender sobrescrever o
  `index.html`** com o snapshot da Home; é a base que o Worker reescreve.
- **Render: um rewrite por rota prerenderizada, antes da catch-all.** O Render
  só ignora as regras quando existe um recurso no caminho exato e não resolve
  índice de diretório; uma catch-all sozinha devolveria a Home em toda rota,
  com o head da Home, anulando o prerender. `render.yaml` documenta as regras,
  mas o serviço foi criado pelo painel (não é Blueprint): mudar uma regra
  exige aplicá-la no painel também. `scripts/__tests__/render-routes.spec.ts`
  guarda a correspondência com as rotas. `.node-version` existe porque o
  Render nem sempre respeita só o `engines`.

### O `dist/` é entrada e saída do mesmo laço

O prerender lê e escreve o mesmo diretório. Duas regras fecham esse buraco e
**não devem ser afrouxadas** (`scripts/__tests__/dist-server.spec.ts` prende
as duas):

- **O shell é lido uma vez, antes do laço, e servido de memória.** Servir
  `dist/index.html` a cada pedido entregaria o snapshot recém-gravado da Home
  às rotas seguintes; o unhead deduplica as tags com chave, mas o JSON-LD
  inline da Home sobreviveria junto com o da rota.
- **Rodar o prerender sobre um `dist/` já prerenderizado é recusado.** Sem
  isso, dois `yarn prerender` seguidos fariam o snapshot anterior virar shell.

## Consentimento (LGPD) e GTM

- **Solução própria, sem biblioteca de terceiros.** Uma categoria opcional,
  `analytics`; "necessário" é implícito.
- **O aviso de cookies não bloqueia a página:** é uma região fixa no rodapé,
  sem overlay, sem trava de rolagem e sem roubar o foco. Esc com o foco nele
  equivale a "Recusar". Ele reserva a própria altura no fim da página e rola
  o elemento focado para cima dele, para nunca esconder o foco.
- **O GTM é importado e aguardado antes do `mount`.** `useGtm()` roda de forma
  síncrona no `setup()` dos componentes; registrar o plugin depois do mount
  faria esse `useGtm()` capturar `undefined` para sempre. Sem `VITE_GTM_ID`, o
  pacote nunca é buscado. O script do GTM só carrega depois do aceite.
