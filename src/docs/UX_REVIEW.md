# UX Review — heurísticas, leis de UX, SOLID e Clean Code

> Auditoria feita em **2026-07-08**, baseada em leitura de código (sem
> ferramenta de navegador disponível no ambiente — nenhum achado depende de
> captura visual não confirmável no código-fonte). Relacionados:
> [`DESIGN_SYSTEM`](DESIGN_SYSTEM.md) · [`CONVENTIONS`](CONVENTIONS.md) ·
> [`ARCHITECTURE`](ARCHITECTURE.md). Histórico: [`CHANGELOG`](../../CHANGELOG.md).

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

### Mobile / telas estreitas (≤360px)

Auditoria estática (sem ferramenta de navegador): nenhum bug estrutural de
largura fixa encontrado — todo `width` fixo ≥200px na base de CSS é blob
decorativo já contido em `overflow: hidden`. Achados reais corrigidos:
`.search-input` (CSS morto, sem uso) removido; tabelas geradas de markdown
(`BlogPostPage.vue` `.prose :deep(table)`) ganharam `overflow-x: auto` para
não arriscar esticar a página com conteúdo real do R2 imprevisível.
Verificação visual final (360×640, 320×568) ainda pendente de confirmação
humana — esta auditoria cobre só "a página ganha scroll horizontal?", não
espaçamento/legibilidade a 280px.

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

## Recomendações — decisão de produto/design ⏳

- **Dois padrões de "ver mais conteúdo" na mesma página** — `BlogPage.vue`
  usa "Carregar mais" na visão padrão e paginação numerada na busca. Unificar
  é uma decisão de navegação, não um bug.
- **`markdownToHtml` não escapa HTML bruto** no corpo do markdown — gap real
  de defesa em profundidade, não corrigido porque não há visibilidade do
  conteúdo já publicado no bucket R2 para confirmar se algum post depende de
  HTML bruto (ex.: `<img>` colado à mão) — escapar cegamente arriscaria
  quebrar imagens de posts já publicados. Checar o conteúdo real do R2 antes
  de agir.
