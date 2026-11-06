# Estado do projeto — Purple (site)

Decisões de produto em vigor, o que está em validação e o que falta fazer.
Atualizar ao fechar ou abrir uma pendência.

## Decidido

- **Arquitetura de camadas:** estratégia → posicionamento → identidade
  (verbal/visual) → conteúdo+IA → UI → dev. Construir o que **não** depende da
  aposta; reservar o que depende.
- **Sem preços publicados:** planos e projetos são "Sob consulta"; venda
  consultiva, valores só na proposta.
- **Foco regional discreto:** Americana–SP aparece só em contato e rodapé; o
  posicionamento não é amarrado à região.
- **Site aberto à indexação** por decisão explícita, mesmo com as pendências
  de logo e da fonte do card do hero (abaixo) ainda abertas.

## Em validação

- **Conversão da oferta publicada:** reação real de compradores aos planos
  "Sob consulta" (primeiro ciclo de prospecção outbound).

## Pendências

- **Meta tags de post — divulgação.** As páginas `/blog/:slug` já servem
  título, Open Graph e JSON-LD do post sem JS (conferido em produção em
  2026-11-06). Falta: enviar `https://purplecomunicacao.com.br/sitemap-posts.xml`
  no Google Search Console e reprocessar os links já compartilhados no
  [Post Inspector do LinkedIn](https://www.linkedin.com/post-inspector/) e no
  depurador da Meta, que guardam o preview antigo.
- **Snapshot de `/` e `/blog` sem posts em produção.** O HTML servido não
  traz nenhum card de post (conferido em 2026-11-06); o comportamento de
  fallback é o projetado, mas a causa raiz não foi diagnosticada: o Worker
  está no ar e o build local traz os posts. Próximo passo: ler o log de build
  do Render atrás de `[prerender] AVISO:`.
- **Fonte do `+43%` do card do hero** (`home.hero.card.source` vazio): é o
  único dado publicado sem fonte. Candidata citada no modelo de negócio:
  redução de custo de atração com EVP estruturada (ESPM / Jornal Empresas &
  Negócios, 2026). Ao confirmar, preencher e incluir o card em
  `src/data/__tests__/sources.spec.ts`.
- **Logo definitivo** substituindo o placeholder em
  `src/assets/brand/logo-ppl.svg` (ver [`CONTENT_MODEL`](CONTENT_MODEL.md)).
- **Política de Privacidade:** `privacy.json` é texto-base LGPD e precisa de
  revisão jurídica; também falta registrar o monitoramento de erros (Sentry,
  sem dado pessoal — ver [`ARCHITECTURE`](ARCHITECTURE.md)).
- **Testes:** smoke de render das páginas Sobre, Abordagem, Contato e Blog;
  a paginação numerada da busca do blog nunca foi exercitada, porque o R2 tem
  menos posts que o tamanho de página.

## Recomendações abertas (decisão de produto ou design)

- **Soft 404:** rota inexistente responde HTTP 200 com o HTML da Home; quem
  tem JS vê a página 404, o crawler vê a Home. Limitação de site estático no
  Render. `/blog/<slug-inexistente>` já responde 404 de verdade (Worker).
- **Fontes fracas no `panorama.json`:** "Pesquisa Global, 2024" (dois stats)
  e "Panorama Corporativo 2024" são genéricas, e em `context` "Mindsight" está
  sem ano e "OMS" sem relatório. Cumpre a regra de fonte, mas enfraquece o
  argumento de decisão baseada em evidência.
- **`public/favicon.svg` depende de fonte:** o "p" é um `<text>` em Plus
  Jakarta Sans; sem a fonte, desenha diferente do PNG/ICO. Converter o glifo
  em `path` resolve.
- **Dois padrões de "ver mais" no blog:** "Carregar mais" na lista e
  paginação numerada na busca.
- **`/blog` sem CTA de WhatsApp**, diferente das outras páginas do menu.
  Aceito por ora.
- **Categoria "Planejamento" sem serviço associado** em
  `services.json`: o post dessa categoria fica sem o card de serviço no fim.
  Aceito por ora.
- **`vite-plugin-pwa` instalado e sem uso** em `vite.config.ts`: remover a
  dependência ou ativar o PWA.
