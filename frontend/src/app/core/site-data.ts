export type NavLink = Readonly<{
  label: string;
  path: string;
  description: string;
}>;

export type SocialLink = Readonly<{
  label: string;
  url: string;
  icon: string;
}>;

export const brand = {
  name: 'Rafael Xavier',
  title: 'Engenheiro de Software Full Stack',
  subtitle: 'Criador de Conteúdo e Video Maker',
  description:
    'Landing pessoal minimalista para apresentar portfólio, criação de conteúdo e o futuro hub de produtos recomendados.',
} as const;

export const navigationLinks: NavLink[] = [
  { label: 'Início', path: '/landing', description: 'Voltar para a landing' },
  { label: 'Links', path: '/linktree', description: 'Página rápida de acesso' },
  { label: 'Loja', path: '/store', description: 'Módulo reservado para a loja' },
  { label: 'Admin', path: '/admin', description: 'Área administrativa' },
];

export const socialLinks: SocialLink[] = [
  { label: 'YouTube', url: 'https://www.youtube.com/', icon: '▶' },
  { label: 'Instagram', url: 'https://www.instagram.com/', icon: '◎' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/', icon: 'in' },
  { label: 'GitHub', url: 'https://github.com/', icon: '{}' },
];

export const quickHighlights = [
  {
    eyebrow: 'Portfólio',
    title: 'Arquitetura enxuta, foco em entrega rápida.',
    body: 'Base preparada para evoluir sem Clean Architecture desnecessária.',
  },
  {
    eyebrow: 'Conteúdo',
    title: 'Presença digital com links, mídia e distribuição.',
    body: 'Estrutura pronta para destacar redes sociais e materiais autorais.',
  },
  {
    eyebrow: 'Video Maker',
    title: 'Uma frente criativa em crescimento.',
    body: 'Espaço reservado para evoluir storytelling visual e projetos em vídeo.',
  },
] as const;

