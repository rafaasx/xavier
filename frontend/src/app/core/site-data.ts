export type NavLink = Readonly<{
  label: string;
  route: string;
  description: string;
  fragment?: string;
}>;

export type SocialLink = Readonly<{
  label: string;
  url: string;
  icon: string;
}>;

export type LandingStat = Readonly<{
  label: string;
  value: string;
  note: string;
}>;

export type ExperienceCard = Readonly<{
  title: string;
  points: readonly string[];
}>;

export const brand = {
  name: 'Rafael Xavier',
  title: 'Engenheiro de Software',
  subtitle: 'Engenheiro de Software • Criador de Conteúdo • Video Maker',
  description:
    'Landing pessoal minimalista para apresentar portfólio, criação de conteúdo e o futuro hub de produtos recomendados.',
  eyebrow: '',
} as const;

export const headerLinks: NavLink[] = [
  { label: 'Início', route: '/', fragment: 'top', description: 'Ir para o topo da landing' },
  { label: 'Sobre', route: '/', fragment: 'about', description: 'Ir para a seção sobre mim' },
  {
    label: 'Experiências',
    route: '/',
    fragment: 'experiences',
    description: 'Ir para a seção de experiências',
  },
  { label: 'Galeria', route: '/', fragment: 'gallery', description: 'Ir para a seção de galeria' },
  { label: 'Redes', route: '/', fragment: 'social', description: 'Ir para a seção de redes sociais' },
  { label: 'Loja', route: '/store', description: 'Abrir a loja' },
];

export const socialLinks: SocialLink[] = [
  {
    label: 'YouTube',
    url: 'https://www.youtube.com/@aventurasobrerodasoficial',
    icon: 'YT',
  },
  {
    label: 'Instagram',
    url: 'https://www.instagram.com/aventurasobrerodasoficial',
    icon: 'IG',
  },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/rafaasx', icon: 'IN' },
  { label: 'GitHub', url: 'https://github.com/rafaasx', icon: 'GH' },
];

export const landingStats: LandingStat[] = [
  {
    label: '👨🏽‍💻Stack principal',
    value: '.NET • Angular • Vue',
    note: 'Mais de 16 anos de experiência com análise e desenvolvimento de sistemas.',
  },
  {
    label: '▶️Conteúdo',
    value: 'YouTube • Instagram',
    note: 'Produção de conteúdo digital de viagens no estilo overland, vlogging, lifestyle e documentários.',
  },
  {
    label: '📹Video maker',
    value: 'Nova Skill',
    note: 'Frente criativa em evolução, explorando novas técnicas e estilos.',
  },
];

export const aboutParagraphs = [
  'Sou um desenvolvedor Full Stack com mais de 15 anos de experiência em análise, desenvolvimento e arquitetura de sistemas, com foco em tecnologias .NET, C#, e frameworks modernos de front-end como Vue.js, Angular e React. Ao longo da minha trajetória, atuei em projetos de diferentes portes, desde o levantamento de requisitos até a entrega de soluções robustas e escaláveis, utilizando práticas de Clean Code, SOLID, DDD e CI/CD.',
  'Também produzo conteúdo para YouTube e Instagram desde 2019, transformando conhecimento técnico e viagens em conteúdo digital.',
  'Minha nova frente como video maker me permite conectar produto, narrativa e estética em uma mesma experiência.',
] as const;

export const experienceCards: ExperienceCard[] = [
  {
    title: 'Engenharia de Software',
    points: ['Linguagens & Frameworks: C#, .NET Core 9/ASP.NET, JavaScript/TypeScript, React, Vue.js, Angular, HTML, JavaScript, CSS, Bootstrap, JQuery, Entity Framework', 
      'Bancos de Dados: SQL Server, PostgreSQL, Oracle, MongoDB', 
      'DevOps & Cloud: Azure, Docker, GitHub, Azure DevOps',
      'Metodologias: Scrum, Git Flow, CI/CD, Domain-Driven Design (DDD), Clean Code, SOLID, Minimal APIs',
      'Testes: XUnit.net, NUnit, MSTest',
      'Outros: REST APIs, Swagger, OData, Entity Framework, mensageria assíncrona, MediatR, Keycloak, FastEndpoints, FluentValidation, Dapper, HangFire, OpenTelemetry, AutoMapper'
    ],
  },
  {
    title: 'Criador de Conteúdo',
    points: ['YouTube e Instagram', 'Educação, bastidores e rotina criativa', 'Viagens, aventuras e lifestyle', 'Documentação de processos e aprendizados', 'Documentários'],
  },
  {
    title: 'Video Maker',
    points: ['Conteúdo visual em evolução', 'Produções autorais e testes de linguagem', 'Narrativa, ritmo e composição'],
  },
];

export const linktreeLinks = [
  { label: 'Site principal', href: '/', description: 'Voltar para a landing' },
  { label: 'Loja', href: '/store', description: 'Visitar a loja' },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@aventurasobrerodasoficial',
    description: 'Assistir ao canal',
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/aventurasobrerodasoficial',
    description: 'Abrir o perfil',
  },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rafaasx', description: 'Abrir o perfil' },
  { label: 'GitHub', href: 'https://github.com/rafaasx', description: 'Abrir o repositório' },
] as const;

