# Project State — Purple (site)

> Observado / decidido até **2026-09-05**. Atualizar conforme avança.
> Histórico de decisões e mudanças anteriores: [`CHANGELOG`](../../CHANGELOG.md).

## Estado atual ✅

- **Arquitetura de camadas:** estratégia → posicionamento → identidade (verbal/visual) → conteúdo+IA → UI → dev. Construir o que **não** depende da aposta; reservar o que depende.
- **Alvo:** empresas de médio porte (40+ colaboradores) sem área estruturada de comunicação/employer branding. Estratégia "entrega prática antes de consultoria" — ver `POSITIONING.md`.
- **Oferta no site:** catálogo de 7 serviços (formato rico: tagline, descrição, benefícios, processo) + 3 planos mensais recorrentes (Essencial, Cultura Ativa, Employer Branding Completo; permanência mínima 3 meses) + 3 projetos pontuais.
- **Sem preços publicados:** todos os planos/projetos são "Sob consulta" — venda consultiva; valores só na proposta.
- **Foco regional discreto:** Americana–SP aparece apenas em contato/footer; o posicionamento não é amarrado à região.
- **Site no ar com snapshot por rota:** as 8 rotas estáticas respondem com o HTML prerenderizado próprio (`<title>`, `canonical` e OG por rota) — verificado em produção em 2026-09-05. O prerender roda no Build Command do Render a cada deploy.

## Em validação 🔬

- **Conversão da oferta publicada** — reação real de compradores aos planos "sob consulta" (primeiro ciclo de prospecção outbound).

## Pendências ⏳

- **JSON-LD duplicado nas rotas prerenderizadas ⚠️:** toda rota que não é a home publica **dois** blocos `application/ld+json` — o `WebPage` da home primeiro, o da rota depois. Causa e conserto proposto em `ARCHITECTURE.md` § "Desvios observados no snapshot em produção" (o fallback SPA de `scripts/prerender.mjs` serve o `dist/index.html` que o próprio laço acabou de sobrescrever). Não quebra `canonical`/OG, mas entrega ao Google uma entidade `WebPage` errada à frente da certa em 7 das 8 rotas.
- **Snapshot de `/` e `/blog` sem posts em produção ⚠️:** o índice do blog não respondeu durante o build do deploy atual, então os dois snapshots foram publicados sem nenhum card (o bloco de erro é removido por design). O Worker está no ar e o build local traz os posts — some no próximo deploy bem-sucedido, mas vale confirmar no log do Render se o aviso `[prerender] AVISO:` está saindo a cada build.
- **Fonte do `+43%` do card do hero:** os três stats do hero **já citam fonte** (61% sem engajamento — VocêRH, 2025 · 14x mais produtivas — Business Moment, 2024 · 23% mais receita — NOZ, 2025). Falta só o card `home.hero.card` (`+43%` de engajamento após 6 meses de endomarketing estruturado), com `source` vazio — é hoje **o único dado publicado no site sem fonte**, o que contradiz o princípio "toda afirmação cita fonte" do `PRODUCT_VISION.md`. Candidata citada no modelo de negócio: redução de custo de atração com EVP estruturada (ESPM / Jornal Empresas & Negócios, 2026). **Preencher `source` assim que confirmada** — e então apertar o teste em `src/data/__tests__/services.spec.ts` de `toHaveProperty('source')` para exigir string não-vazia.
- **Imagens:** slots prontos com fallback; arquivos a subir pela dupla — ver `IMAGES.md` ( **logo definitivo** substituindo o placeholder em `src/assets/brand/logo-ppl.svg`).
- **Política de Privacidade:** `privacy.json` é **texto-base LGPD**; precisa de revisão jurídica antes do go-live.
- **Go-live SEO:** ✅ **robots flipado para `index, follow`** (fonte única em `App.vue`) em 2026-07-09, por decisão explícita — `public/robots.txt` permite crawling e `public/sitemap.xml` (novo) lista as 8 rotas estáticas. **Os outros 2 itens do checklist de go-live seguem pendentes** e o site já está aberto à indexação com eles em aberto: a fonte vazia em `home.hero.card` (item acima) e o logo placeholder em `src/assets/brand/logo-ppl.svg` (ver `IMAGES.md`). Resolver assim que possível para não deixar essas lacunas expostas a visitantes/crawlers reais.
