# UX Review — heurísticas, leis de UX, SOLID e Clean Code

> Auditoria de código em **2026-07-08**; auditoria de **navegação real em
> browser** (Playwright/Chromium, dev stack completo) em **2026-07-09** —
> ver seção dedicada abaixo. A ressalva original ("sem ferramenta de
> navegador disponível no ambiente") não vale mais: o ambiente passou a ter
> Chromium via `@playwright/test` (ver [`TESTING`](TESTING.md)).
> Relacionados: [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md) ·
> [`CONVENTIONS`](CONVENTIONS.md) · [`ARCHITECTURE`](ARCHITECTURE.md).
> Histórico: [`CHANGELOG`](../../CHANGELOG.md).

Status: ✅ corrigido · ⏳ recomendação registrada, não implementada (decisão de produto/design ou risco maior).

## Corrigido ✅

### Funil de CTAs

- **Hierarquia de CTA invertida** — o botão de marca (primário) levava ao
  formulário (`/contato`) e o link discreto (terciário) levava ao WhatsApp —
  o inverso do que o dono do produto define como funil (macro conversão =
  WhatsApp = primário; micro I = formulário = secundário; micro II =
  navegação de conteúdo = terciário). Redesenhado em `CtaBanner.vue`
  (composables novos `useWhatsapp.ts`/`useCtaTracking.ts`), no botão fixo do
  `AppHeader.vue` ("Vamos conversar" agora abre WhatsApp) e instrumentado com
  eventos GTM (`whatsapp_click`, `contact_form_submit`) — antes só existia
  pageview automático, sem medir a origem de cada clique.
- **Acordeões com comportamento diferente** — `FaqSection.vue` (um item por
  vez) migrado para o mesmo modelo multi-aberto de `ServicesPage.vue`.
  **Nota (2026-08-16):** `ServicesPage.vue` voltou a ser um-item-por-vez —
  ver "Catálogo de serviços" abaixo. A divergência com `FaqSection.vue`
  (que segue multi-open) passou a ser intencional; motivo detalhado na
  seção seguinte.

**Modelo completo do funil (fonte única — decisão do dono do produto,
2026-07-09):**

- **Cor não é marcador de tipo de conversão.** `purple` é o estilo primário
  padrão; `lime` é primário só quando o fundo não comporta `purple` por
  contraste (ex.: seções escuras do `CtaBanner`). `purple`/`lime` = primário,
  branco = secundário, text-link = terciário — a cor é escolha de
  contraste/identidade de marca, nunca um código para "isto é o link do
  WhatsApp".
- **Padrão por bloco de conversão:** em geral, macro + micro juntos (macro
  em destaque/primário). Micro I + micro II juntos também é aceitável.
  **Nunca** o inverso — micro em destaque com macro subordinado/secundário.
- **Peso, não contagem:** pensar em macro-conversão como peso ~2–3× o de uma
  micro. Uma tela com muitas chamadas macro fica desequilibrada ("se tudo é
  importante, nada é importante") — por isso nem todo bloco precisa de um
  WhatsApp ao lado; às vezes a ausência é a escolha certa.
- **Página-destino não convida à saída.** Contato e Serviços já **são** o
  destino de uma conversão — não competem com CTAs de saída (outra
  micro-conversão) acima da dobra ou dentro do mesmo bloco. Foi por isso que
  os CTAs de topo de Contato foram removidos; pelo mesmo motivo, o hero de
  Serviços ter só o CTA de WhatsApp (sem um par de micro ao lado) e os cards
  de plano/catálogo ("Pedir proposta") terem só micro I (sem WhatsApp em
  cada um dos 3 planos + 7 serviços) são **intencionais**, não gaps — evita
  tanto a navegação cíclica quanto a saturação de peso macro.

### Catálogo de serviços — "buraco" no grid ao expandir um card

- **Achado (feedback direto, 2026-08-16):** `.svc-catalog` é um grid de 2
  colunas e cada `.svc-item` expande individualmente (`v-show` no
  `.svc-item__detail`). Ao abrir só um dos dois cards de uma linha, a altura
  da linha do grid passava a ser ditada pelo card aberto, deixando uma área
  vazia grande ao lado do card vizinho, que continuava com sua altura
  fechada.
- **Primeira tentativa (revertida):** `grid-auto-flow: dense` +
  `.svc-item--open { grid-column: 1 / -1 }` — o card clicado ocupava a linha
  inteira e o packing denso realocava os cards seguintes para preencher o
  espaço, sem deixar buraco. Efeito colateral descoberto em teste manual:
  como a realocação é instantânea e sem nenhuma transição, o card que
  "pulava" para a posição do card recém-aberto ficava exatamente sob o
  cursor — um segundo clique rápido no mesmo ponto (comum ao checar se o
  clique "pegou") acertava esse novo card em vez de repetir o card já
  aberto, e o ciclo se repetia a cada clique acidental, abrindo em cascata
  todos os cards do catálogo sem o usuário perceber a causa.
- **Segunda tentativa:** `ServicesPage.vue` ganhou o computed
  `hasOpenService`, que aplica o modificador `.svc-catalog--stacked`
  (`grid-template-columns: 1fr`) enquanto qualquer card estiver aberto — o
  grid empilha em 1 coluna até fechar de novo. Nenhum card troca de posição
  sob o cursor, então o clique acidental em cascata deixa de ser possível.
  Manteve o multi-open (vários cards abertos ao mesmo tempo). Problema
  encontrado em teste com o dono do produto: o motivo original do grid de 2
  colunas era justamente evitar uma página longa/arrastada ao exibir os 7
  serviços — com multi-open, cada card aberto empilha um painel de detalhe
  completo, então abrir vários cards contradiz esse objetivo (a página cresce
  sem limite).
- **Correção definitiva:** catálogo de serviços passou a ser **single-open**
  (`closeAll()` antes de abrir um novo id, tanto em `toggle` quanto em
  `open`) — abrir um card fecha qualquer outro que estivesse aberto,
  limitando a página a no máximo 1 painel de detalhe expandido por vez.
  `.svc-catalog--stacked` continua evitando o buraco no grid. Divergência
  intencional do multi-open do `FaqSection.vue`: só o catálogo de serviços
  tem o grid de 2 colunas + conteúdo rico por card que motiva esse limite;
  o FAQ é uma lista simples de 1 coluna com respostas curtas, sem esse
  problema. `.svc-catalog` também ganhou
  `transition: grid-template-columns 0.25s var(--ease)` para suavizar a
  troca 2↔1 coluna (antes trocava sem nenhuma transição, o que também
  contribuía para a sensação de comportamento quebrado).
- **Nota (2026-08-16):** a "correção definitiva" acima (single-open +
  `--stacked`) foi revisitada em teste com o dono do produto e substituída
  por **master-detail**: uma grade de cards seletores que nunca mudam de
  altura (ícone + título + tagline + resumo, sem expandir) e um único
  painel de detalhe compartilhado abaixo da grade, que troca de conteúdo
  conforme o card selecionado (`selectedId`/`selectedService` em
  `ServicesPage.vue`, substituindo `openState`/`toggle`/`open`/`closeAll`).
  Motivo: abrir um acordeão por item tem alto custo de interação quando o
  conteúdo por item é longo — cada abertura é uma decisão + reflow — e um
  grid 2D de acordeões é estruturalmente a forma errada para esse conteúdo
  (NN/g, "In-Page Links: When They Work"). O bug de "buraco no grid"/clique
  em cascata descrito acima deixa de ser possível **por construção**: como
  os cards nunca mudam de altura, nenhuma seleção altera a altura de linha
  do grid — não há mais nada para vazar ou realocar sob o cursor.
  `.svc-catalog--stacked` foi removido (o grid agora só colapsa por
  breakpoint de viewport, nunca por estado de seleção).
- **Nota (2026-08-16):** o painel de detalhe ganhou navegação anterior/
  próximo (`.svc-detail__nav`), pedida pelo dono do produto — sem ela, trocar
  de serviço exigia rolar de volta até a grade a cada clique. Segue o mesmo
  padrão de `BlogPagination.vue` (setas desabilitadas nas pontas, sem
  wraparound) por consistência de interação no site. Contador "X de 7"
  aplica a heurística de Nielsen "visibilidade do status do sistema". A
  barra de navegação fica **fora** da `<Transition>` do conteúdo — se
  estivesse dentro, cada clique recriaria os botões e o foco do teclado se
  perderia a cada troca (mesma classe de armadilha do "alvo que se move sob
  o cursor" documentada acima, agora evitada por manter os botões fixos
  fora do bloco que muda de altura).

### Acessibilidade / heurísticas de Nielsen

- **Opções do formulário de contato não batiam com o catálogo real** —
  select agora renderiza `services.catalog` diretamente.
- **Contraste insuficiente** (botão WhatsApp do hero de Contato; 3 vermelhos
  de erro diferentes) — corrigidos; erro unificado em tokens
  `--danger`/`--danger-bg`/`--danger-border`/`--danger-rgb`.
- **`target="_blank"` sem `rel`**, **`tel:`/`mailto:` inconsistentes entre
  rodapé e Contato** — corrigidos.
- **Alvos de toque abaixo de 44×44px** — token `--tap-target-min` criado em
  `_tokens.scss` e aplicado em `AppHeader.vue` (hambúrguer), `BlogPage.vue`
  (limpar busca), `AppFooter.vue` (cookies + redes sociais),
  `ServicesPage.vue` ("Saiba mais").
- **Sem tecla Esc / clique-fora no menu mobile** — Esc fecha o menu;
  clique-fora usa `onClickOutside` do `@vueuse/core` (primeiro uso real da
  dependência no projeto).
- **Sem estado `:disabled` visível em `.button`** — corrigido.
- **Hierarquia de headings quebrada** (`ApproachPage.vue`, `ServicesPage.vue`,
  `BlogPostPage.vue`) — corrigida; "Pilares" ganhou também título visível
  (antes só `sr-only`).
- **Sub-nav de Serviços sem feedback de "você está aqui"** — scroll-spy via
  `IntersectionObserver`.
- **`MediaBlock.vue` com altura mínima fixa sem breakpoint** — corrigido.
- **Typewriter do hero sem alternativa para leitor de tela** — corrigido
  (`aria-hidden` + `span.sr-only`).
- **Sem movimento de foco ao primeiro campo inválido** — corrigido em
  `ContactPage.vue`.
- **Mensagem de estado vazio do blog enganosa e sem ação de recuperação** —
  copy corrigida + botão de recuperação em `BlogPage.vue`.
- **`CookieConsent.vue` não bloqueava a página** — agora tem backdrop, trava
  `overflow` da página, focus trap real (Tab/Shift+Tab cicla só entre os
  elementos do banner), `aria-modal="true"` (agora condiz com o
  comportamento real) e Esc equivale a "Recusar" (decisão de produto:
  ausência de escolha explícita = recusa, padrão seguro sob LGPD). Aplica
  viés de ancoragem deliberadamente (documentado com comentário permanente
  no próprio componente, por regra do projeto — ver `CONVENTIONS.md` §
  Vieses cognitivos).
- **Menu mobile aberto sem fundo opaco próprio** — achado na navegação real
  de 2026-07-09: `.nav-mobile` não definia `background`, herdava o
  `rgba(var(--bg-rgb), 0.88)` + `backdrop-filter: blur(20px)` do
  `.site-header` (`sticky`), deixando o conteúdo da página (inclusive o
  typewriter do hero em animação) visível por trás dos itens do menu — risco
  de contraste caso `backdrop-filter` não renderize (navegadores mais
  antigos, `forced-colors`, alguns webviews). Corrigido: `.site-header`
  ganha o modificador `nav-open` (mesmo padrão de `scrolled`) enquanto o
  menu mobile está aberto, com `background: var(--bg)` opaco só nesse
  estado — o header colapsado/scrollado mantém o frosted-glass normal.

### Mobile / telas estreitas (≤360px)

Auditoria estática (sem ferramenta de navegador): nenhum bug estrutural de
largura fixa encontrado — todo `width` fixo ≥200px na base de CSS é blob
decorativo já contido em `overflow: hidden`. Achados reais corrigidos:
`.search-input` (CSS morto, sem uso) removido; tabelas geradas de markdown
(`BlogPostPage.vue` `.prose :deep(table)`) ganharam `overflow-x: auto` para
não arriscar esticar a página com conteúdo real do R2 imprevisível.
**Verificação visual em browser real feita em 2026-07-09** (375×812, 360×640,
320×568, rotas `/`, `/servicos`, `/blog`, `/contato`): nenhum scroll
horizontal em nenhuma combinação — pendência fechada. Espaçamento/legibilidade
a 320px conferidos visualmente via screenshot, sem achados novos.

### SOLID / Clean Code

Já registrados com detalhe no [`CHANGELOG`](../../CHANGELOG.md): IP de LAN
hardcoded removido dos Workers, `workers/shared/http.ts` extraído (fim da
duplicação `json()`/CORS), mapeamento categoria→serviço movido para
`services.json` (`blogCategories[]`), dead code removido (`language` não
usado, `src/types/post.ts` órfão, `.search-input`), barrel de composables
completo (`useMail`/`useTurnstile`/`useContactForm` + novos), roteamento
consolidado (`pages.json`/`footer.json` referenciam rotas por `routeName`,
não `path` duplicado), `workers/mail` ganhou suíte de testes própria +
`try/catch` (antes não tinha nenhum — body inválido ou falha de rede
propagava exceção sem headers de CORS), `workers/blog` com comparação
constant-time do token de deploy, os 4 warnings de lint
(`@typescript-eslint/no-explicit-any`) corrigidos, `markdownToHtml` ganhou
suporte a sintaxe de imagem (`![alt](src)`, antes quebrava como link), e
retry/poll no Turnstile (`useTurnstile.ts` falhava direto se o script do CDN
ainda não tivesse carregado).

## Navegação real em browser (2026-07-09) ✅

Primeira auditoria com Chromium real (Playwright), rodando contra a stack
completa (`yarn dev` + `workers/blog --remote`, R2 real com os 4 posts hoje
publicados — não a emulação local vazia). Confirma visualmente o que a
auditoria de código só podia inferir:

- **Funil de CTA** (Sobre, Abordagem, Serviços): botão primário → WhatsApp
  (`wa.me`), secundário → `/contato` — confirmado nas 3 páginas.
- **Cookie consent:** Esc fecha o banner (= Recusar), `overflow` da página
  trava enquanto está aberto, foco preso ao banner.
- **Menu mobile:** Esc e clique fora fecham o drawer; item de menu ativo
  ganha destaque visual no header desktop ("você está aqui").
- **Turnstile degradando bem:** com o CDN da Cloudflare inacessível, o
  widget cai em estado de erro visível e legível em ~8s
  (`useTurnstile.ts` `SCRIPT_MAX_WAIT_MS`) — e mesmo com o resto do
  formulário válido, clicar "Enviar mensagem" sem token nunca chama a API
  real (`ContactPage.vue` `handleSubmit` — checa `turnstileToken` antes de
  chamar `send()`), só mostra o erro amigável local. Confirmado também que
  a validação de campo (nome/e-mail/interesse/mensagem) roda **antes** dessa
  checagem, incluindo abrir o combobox de interesse ao focar um erro nele.
- **Estados de erro/vazio:** 404 de rota e de post inexistente sem flicker,
  com CTA de recuperação; busca do blog sem resultado mostra "Ver todos".
- **Imagens** (capas do blog, destaque da Home, avatares do time) carregam
  normalmente do CDN R2.
- **Responsivo 375×812/360×640/320×568** em `/`, `/servicos`, `/blog`,
  `/contato`: sem scroll horizontal em nenhuma combinação (fecha a
  pendência antiga, ver seção Mobile acima).

Dois achados desta auditoria (cor do CTA do hero da Home; hero de Serviços e
cards "Pedir proposta" sem par de WhatsApp) foram revisados com o dono do
produto e fecharam como **intencionais** — o raciocínio completo está
registrado no modelo do funil, acima, em vez de repetido aqui.

## Verificado e correto — não reabrir ✅

Auditoria de **produção** em 2026-08-20 (HTTP cru + navegação real em
Chromium). Três itens que uma leitura do HTML **sem executar JS** acusa como
falha de acessibilidade estão, de fato, corretos — ficam registrados aqui para
uma auditoria futura não gastar ciclo reabrindo:

- **H1 rotativo do hero** — as variantes do typewriter (`.hero__rotator-sizer`,
  `.hero__typewriter`) são todas `aria-hidden="true"` e há um `<span class="sr-only">`
  com a lista completa separada por "·". O nome acessível do H1 é coerente;
  quem lê o HTML achatado é que vê as variantes concatenadas.
- **Links de rede social** (`SocialLink.vue`) — têm `aria-label` descritivo
  ("LinkedIn de Suelen Fernanda"), conteúdo é SVG via `BaseIcon` e texto vazio.
  WCAG 2.4.4 atendido; extrator de texto que imprime a `href` no lugar do texto
  do link dá o falso positivo.
- **"Um espaço para pessoas, feito por pessoas"** — o "espaço duplo" é um
  `<br />` no `HomePage.vue`, não um erro de digitação.

## Recomendações — decisão de produto/design ⏳

- **OG por post do blog** — `/blog/:slug` não tem snapshot prerenderizado (os
  posts são runtime, por decisão de arquitetura), então compartilhar um post no
  LinkedIn renderiza o meta do fallback, não o do post. Resolver exige
  prerender por post (conflita com "conteúdo novo sem rebuild") ou um Worker de
  edge injetando as tags. Decisão de arquitetura, não bug de UI.
- **Soft 404** — rota inexistente responde HTTP 200 com o HTML da home; o
  visitante com JS vê a `NotFoundPage`, o crawler vê a home. Limitação de
  static host no Render.
- **Fontes fracas no `panorama.json`** — "Pesquisa Global, 2024" (em dois
  stats), "Panorama Corporativo 2024", "Mindsight" sem ano e "OMS" sem
  relatório não são rastreáveis por um leitor. Não infringe a regra de `source`
  (o campo existe), mas enfraquece justamente o argumento de decisão baseada em
  evidência. Precisa da dupla.
- **Bio do Wanderson (`team.json`)** — abre com "Desenvolvedor web com vivências
  em experiência do usuário" e fecha com "Especialista em experiências digitais
  centradas em pessoas", duas afirmações de senioridade diferentes em três
  linhas, sob o cargo "UX Design & Estratégia". Escolha editorial.
- **`public/favicon.svg` depende de fonte** — o "p" da marca é um `<text>` com
  `font-family: 'Plus Jakarta Sans'`. Renderizador sem a fonte cai para
  `system-ui`, então desenha, mas diferente do PNG/ICO. Converter o glifo em
  `path` é o conserto definitivo.

- **Dois padrões de "ver mais conteúdo" na mesma página** — `BlogPage.vue`
  usa "Carregar mais" na visão padrão e paginação numerada na busca. Unificar
  é uma decisão de navegação, não um bug. Não pôde ser reconfirmado
  visualmente em 2026-07-09: com só 4 posts reais no R2 hoje, nenhum dos dois
  padrões chega a aparecer (abaixo do tamanho de página).
- **`/blog` (lista) sem nenhum CTA de WhatsApp** — diferente das outras 5
  páginas do menu, a listagem do blog não renderiza `CtaBanner` nem atalho
  de WhatsApp (só os posts individuais têm). Aceito como está por ora —
  decisão de produto, não bug.
- **Categoria "Planejamento" sem serviço associado** — `services.json` não
  tem nenhum `catalog[].blogCategories` contendo `"Planejamento"`, categoria
  real de um dos 4 posts publicados ("Calendário de datas especiais..."),
  que por isso é o único hoje sem o CTA contextual "Como a Purple ajuda".
  Aceito como está por ora — gap de conteúdo/dado, não de código.
- **`markdownToHtml` não escapa HTML bruto** no corpo do markdown — gap real
  de defesa em profundidade, não corrigido porque não há visibilidade do
  conteúdo já publicado no bucket R2 para confirmar se algum post depende de
  HTML bruto (ex.: `<img>` colado à mão) — escapar cegamente arriscaria
  quebrar imagens de posts já publicados. Checar o conteúdo real do R2 antes
  de agir.
