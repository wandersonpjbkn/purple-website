# Project State — Purple (site)

> Observado / decidido até **2026-07-08**. Atualizar conforme avança.
> Histórico de decisões e mudanças anteriores: [`CHANGELOG`](../../CHANGELOG.md).

## Estado atual ✅

- **Arquitetura de camadas:** estratégia → posicionamento → identidade (verbal/visual) → conteúdo+IA → UI → dev. Construir o que **não** depende da aposta; reservar o que depende.
- **Alvo:** empresas de médio porte (40+ colaboradores) sem área estruturada de comunicação/employer branding. Estratégia "entrega prática antes de consultoria" — ver `POSITIONING.md`.
- **Oferta no site:** catálogo de 7 serviços (formato rico: tagline, descrição, benefícios, processo) + 3 planos mensais recorrentes (Essencial, Cultura Ativa, Employer Branding Completo; permanência mínima 3 meses) + 3 projetos pontuais.
- **Sem preços publicados:** todos os planos/projetos são "Sob consulta" — venda consultiva; valores só na proposta.
- **Foco regional discreto:** Americana–SP aparece apenas em contato/footer; o posicionamento não é amarrado à região.

## Em validação 🔬

- **Conversão da oferta publicada** — reação real de compradores aos planos "sob consulta" (primeiro ciclo de prospecção outbound).

## Pendências ⏳

- **Aplicar as regras de rota no painel do Render ⚠️:** `render.yaml` já declara um rewrite por rota prerenderizada antes da catch-all (ver `ARCHITECTURE.md`), mas o serviço foi criado pelo painel e **não é gerenciado por Blueprint** — o arquivo não se aplica sozinho. Enquanto as regras não forem adicionadas à mão em Settings → Redirects/Rewrites, toda rota sem barra final continua devolvendo a home, e o `sitemap.xml` continua entregando 8 cópias da home ao Google.

- **Fonte do `+43%` do card do hero:** os três stats do hero **já citam fonte** (61% sem engajamento — VocêRH, 2025 · 14x mais produtivas — Business Moment, 2024 · 23% mais receita — NOZ, 2025). Falta só o card `home.hero.card` (`+43%` de engajamento após 6 meses de endomarketing estruturado), com `source` vazio — é hoje **o único dado publicado no site sem fonte**, o que contradiz o princípio "toda afirmação cita fonte" do `PRODUCT_VISION.md`. Candidata citada no modelo de negócio: redução de custo de atração com EVP estruturada (ESPM / Jornal Empresas & Negócios, 2026). **Preencher `source` assim que confirmada** — e então apertar o teste em `src/data/__tests__/services.spec.ts` de `toHaveProperty('source')` para exigir string não-vazia.
- **Imagens:** slots prontos com fallback; arquivos a subir pela dupla — ver `IMAGES.md` ( **logo definitivo** substituindo o placeholder em `src/assets/brand/logo-ppl.svg`).
- **Política de Privacidade:** `privacy.json` é **texto-base LGPD**; precisa de revisão jurídica antes do go-live.
- **Go-live SEO:** ✅ **robots flipado para `index, follow`** (fonte única em `App.vue`) em 2026-07-09, por decisão explícita — `public/robots.txt` permite crawling e `public/sitemap.xml` (novo) lista as 8 rotas estáticas. **Os outros 2 itens do checklist de go-live seguem pendentes** e o site já está aberto à indexação com eles em aberto: a fonte vazia em `home.hero.card` (item acima) e o logo placeholder em `src/assets/brand/logo-ppl.svg` (ver `IMAGES.md`). Resolver assim que possível para não deixar essas lacunas expostas a visitantes/crawlers reais.
