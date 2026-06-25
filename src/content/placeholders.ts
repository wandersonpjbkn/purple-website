/**
 * Conteúdo EM VALIDAÇÃO — edite somente aqui.
 *
 * O posicionamento (hero) e a oferta de serviços ainda não foram aprovados.
 * Enquanto isso, o site renderiza placeholders no lugar do texto final.
 * Quando o copy estiver definido, substitua as strings abaixo — nenhum outro
 * arquivo precisa ser tocado.
 *
 * Os dados REAIS já validados (estatísticas, time, contato, pilares e
 * processo da Abordagem) seguem em src/data/site.json.
 */

export const POSITIONING_HOOK = {
  eyebrow: '{{POSITIONING_HOOK}}',
  title: '{{POSITIONING_HOOK}}',
  // Frases rotativas do hero (efeito typewriter).
  rotating: ['{{POSITIONING_HOOK}}'],
  subtitle: '{{POSITIONING_HOOK}}',
  // Provas/indicadores exibidos no hero (claims ainda em validação).
  proofPoints: [
    { value: '{{POSITIONING_HOOK}}', label: '{{POSITIONING_HOOK}}' },
    { value: '{{POSITIONING_HOOK}}', label: '{{POSITIONING_HOOK}}' },
    { value: '{{POSITIONING_HOOK}}', label: '{{POSITIONING_HOOK}}' },
  ],
  // Card visual do hero.
  card: {
    label: '{{POSITIONING_HOOK}}',
    value: '{{POSITIONING_HOOK}}',
    sub: '{{POSITIONING_HOOK}}',
    tags: ['{{POSITIONING_HOOK}}', '{{POSITIONING_HOOK}}', '{{POSITIONING_HOOK}}'],
  },
}

/**
 * Oferta de serviços — TODA em validação, inclusive os nomes.
 * Enquanto não for aprovada, renderizamos apenas placeholders.
 * `items` define quantos cards aparecem (conteúdo é sempre placeholder).
 */
export const SERVICE_OFFER = {
  eyebrow: '{{SERVICE_OFFER}}',
  title: '{{SERVICE_OFFER}}',
  subtitle: '{{SERVICE_OFFER}}',
  items: [
    { icon: '', title: '{{SERVICE_OFFER}}', description: '{{SERVICE_OFFER}}' },
    { icon: '', title: '{{SERVICE_OFFER}}', description: '{{SERVICE_OFFER}}' },
    { icon: '', title: '{{SERVICE_OFFER}}', description: '{{SERVICE_OFFER}}' },
  ],
}

/**
 * RASCUNHO-HIPÓTESE — não é renderizado em lugar nenhum.
 *
 * Catálogo de serviços que existia antes da validação. Preservado aqui como
 * ponto de partida: quando a oferta for aprovada, migrar daqui para o formato
 * final (provavelmente de volta ao site.json). NÃO importe isto em telas.
 */
export const SERVICE_OFFER_DRAFT = [
  {
    id: 'employer-branding',
    icon: 'trophy',
    title: 'Employer Branding',
    tagline: 'Como a sua marca é percebida por quem trabalha — e por quem pode trabalhar — nela.',
    description:
      'Conhecido como Employer Branding, trabalhar com a Marca Empregadora significa tratar os atributos e diferenciais que a empresa tem como empregadora e como os colaboradores internos enxergam o negócio e o ambiente de trabalho.',
    benefits: [
      'Atração de novos talentos qualificados',
      'Retenção e fidelização de colaboradores',
      'Agilidade no processo de recrutamento e seleção',
      'Mídia espontânea e reputação de mercado',
      'Satisfação interna e senso de pertencimento',
    ],
    process: [
      'Diagnóstico de Marca Empregadora',
      'Imersão e conhecimento da empresa',
      'Definição dos diferenciais e atributos',
      'Criação de EVP (Employee Value Proposition)',
      'Criação e gestão de canais internos e externos',
    ],
  },
  {
    id: 'endomarketing',
    icon: 'handshake',
    title: 'Endomarketing',
    tagline: 'Como o engajamento dos seus colaboradores impacta diretamente nos resultados.',
    description:
      'Ações para engajar e motivar colaboradores são uma ótima forma de manter a produtividade e um bom clima organizacional. Trabalhar com Endomarketing, além de importante, é essencial na construção de um bom ambiente de trabalho.',
    benefits: [
      'Melhora do clima organizacional',
      'Melhor atendimento aos clientes externos',
      'Menos rotatividade e turnover',
      'Mais produtividade e foco',
      'Maior vínculo entre empresa e colaborador',
    ],
    process: [
      'Diagnóstico da empresa e cultura',
      'Pesquisa interna com colaboradores',
      'Análise dos resultados e identificação de gaps',
      'Planejamento e aplicação das ações',
      'Acompanhamento e análise de impacto',
    ],
  },
  {
    id: 'comunicacao-interna',
    icon: 'megaphone',
    title: 'Comunicação Interna',
    tagline: 'Para que todos possam caminhar na mesma direção, é essencial que estejam informados.',
    description:
      'Planejamos e gerenciamos canais, conteúdos e rituais de comunicação que mantêm times alinhados, lideranças comunicativas e colaboradores conectados ao propósito da empresa.',
    benefits: [
      'Times alinhados com objetivos e estratégia',
      'Redução de ruídos e mal-entendidos',
      'Lideranças mais comunicativas e presentes',
      'Cultura organizacional mais coesa',
      'Senso de pertencimento e engajamento',
    ],
    process: [
      'Briefing e entendimento da empresa',
      'Diagnóstico de comunicação atual',
      'Planejamento de canais e conteúdos',
      'Criação de peças e materiais',
      'Treinamento e alinhamento com equipe interna',
    ],
  },
  {
    id: 'publicidade-online',
    icon: 'chart',
    title: 'Publicidade Online',
    tagline: 'Campanhas de mídia paga para atrair talentos, fortalecer a marca e gerar resultados.',
    description:
      'Estratégias de mídia paga voltadas para employer branding, atração de talentos e fortalecimento da presença digital da marca empregadora. Do planejamento à análise de dados.',
    benefits: [
      'Atração de candidatos mais qualificados',
      'Fortalecimento da marca empregadora no digital',
      'Campanhas com ROI mensurável',
      'Segmentação precisa de público-alvo',
      'Relatórios detalhados de performance',
    ],
    process: [
      'Definição de objetivos e KPIs',
      'Planejamento de mídia e segmentação',
      'Criação de criativos e copys',
      'Ativação e monitoramento de campanhas',
      'Otimização contínua e relatórios',
    ],
  },
  {
    id: 'ux-ui',
    icon: 'design',
    title: 'UX/UI para websites',
    tagline: 'Design de experiências digitais que refletem a identidade e os valores da sua marca.',
    description:
      'Design de interfaces e experiência do usuário para websites institucionais, portais do colaborador e páginas de carreira. Focamos em clareza, acessibilidade e conversão.',
    benefits: [
      'Sites institucionais e portais de carreiras',
      'Experiência do usuário centrada em pessoas',
      'Design alinhado à identidade da marca',
      'Foco em acessibilidade e performance',
      'Prototipagem e validação antes do desenvolvimento',
    ],
    process: [
      'Descoberta e pesquisa de usuários',
      'Arquitetura de informação',
      'Wireframes e prototipagem',
      'Design visual e sistema de componentes',
      'Handoff para desenvolvimento',
    ],
  },
]
