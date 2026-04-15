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
  title: 'Engenheiro de Software Full Stack',
  subtitle: 'Criador de Conteúdo e Video Maker',
  description:
    'Landing pessoal minimalista para apresentar portfólio, criação de conteúdo e o futuro hub de produtos recomendados.',
  eyebrow: 'Landing pessoal',
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
    label: 'Stack principal',
    value: '.NET • Angular • Vue • React',
    note: 'Base técnica alinhada ao portfólio profissional.',
  },
  {
    label: 'Conteúdo',
    value: 'YouTube • Instagram',
    note: 'Presença digital com foco em alcance e consistência.',
  },
  {
    label: 'Video maker',
    value: 'Em crescimento',
    note: 'Frente criativa em consolidação, com espaço para evolução.',
  },
];

export const aboutParagraphs = [
  'Sou engenheiro de software full stack com experiência em produtos web, interfaces ricas e decisões técnicas que equilibram velocidade e manutenção.',
  'Também produzo conteúdo para YouTube e Instagram, transformando conhecimento técnico e bastidores de criação em presença digital consistente.',
  'Minha nova frente como video maker me permite conectar produto, narrativa e estética em uma mesma experiência.',
] as const;

export const experienceCards: ExperienceCard[] = [
  {
    title: 'Engenharia de Software',
    points: ['.NET, Angular, Vue e React', 'Soluções web de produto', 'Foco em clareza, escalabilidade e entrega rápida'],
  },
  {
    title: 'Criador de Conteúdo',
    points: ['YouTube e Instagram', 'Educação, bastidores e rotina criativa', 'Distribuição com identidade própria'],
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

