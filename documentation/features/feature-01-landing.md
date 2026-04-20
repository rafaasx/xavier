# Feature 01 — Landing Page + Linktree

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | Node.js (TypeScript) em Vercel Functions | Supabase PostgreSQL + Prisma
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature implementa a landing page principal e a página Linktree — ambas são páginas públicas, estáticas (sem dados do banco), e compõem a presença digital do Rafael.

---

## Objetivo

Criar a landing page pessoal que funciona como hub central da presença digital, incluindo:

- Hero Section com apresentação profissional
- Seção "Sobre Mim" com biografia
- Seção de Experiências (3 blocos)
- Seção de Redes Sociais
- Página Linktree separada (estilo link-in-bio)

---

## Estrutura de Pastas

### Frontend

```
/src/app/features
  /landing
    /components
      /hero          → hero-section.component.ts
      /about         → about-section.component.ts
      /experiences   → experiences-section.component.ts
      /social-links  → social-links-section.component.ts
    landing.component.ts
    landing.module.ts (ou standalone)
    landing-routing.module.ts

  /linktree
    linktree.component.ts
    linktree.module.ts (ou standalone)
    linktree-routing.module.ts
```

---

## Especificações

### 1. Hero Section

**Conteúdo:**

- Nome: **Rafael Xavier**
- Headlines (com efeito de typing ou alternância):
  - Engenheiro de Software
  - Criador de Conteúdo
  - Video Maker

**Call to Actions:**

| Botão | Ação |
|-------|------|
| "Ver Portfólio" | Scroll suave para seção de Experiências |
| "Acessar Loja" | Navegar para `/store` |

**Requisitos visuais:**

- Design impactante, minimalista
- Tipografia moderna
- Animações leves (fade-in, typing effect)

---

### 2. Sobre Mim

**Conteúdo (texto institucional):**

- Experiência como desenvolvedor (.NET, Angular, Vue, React)
- Produção de conteúdo (YouTube / Instagram)
- Transição para video maker

**Requisitos:**

- Texto hardcoded no componente (sem CMS por enquanto)
- Permitir edição futura via código
- Layout limpo com boa hierarquia visual

---

### 3. Experiências

**Estrutura — 3 blocos:**

#### Bloco 1: Engenharia de Software
- Tecnologias principais
- Tipos de projetos
- Destaques técnicos

#### Bloco 2: Criador de Conteúdo
- Plataformas (YouTube, Instagram)
- Tipo de conteúdo produzido

#### Bloco 3: Video Maker
- Status: em crescimento
- Projetos iniciais

**Requisitos visuais:**

- Cards ou blocos visuais distintos
- Ícones representativos
- Layout responsivo (empilha em mobile)

---

### 4. Redes Sociais

**Links:**

| Rede | Obrigatório |
|------|-------------|
| YouTube | Sim |
| Instagram | Sim |
| LinkedIn | Opcional |
| GitHub | Opcional |

**Requisitos:**

- Ícones clicáveis
- Abrir em nova aba (`target="_blank"`)
- Hover effects sutis

---

### 5. Página Linktree

**Rota:** `/links`

**Conteúdo:**

- Foto de perfil (circular)
- Nome: Rafael Xavier
- Lista de links com botões:
  - YouTube
  - Instagram
  - Loja (`/store`)
  - Site principal (`/`)

**Requisitos:**

- Design centrado, vertical
- Estilo similar a Linktree/Hopp
- Responsivo (mobile-first)
- Animações leves nos botões
- Não deve aparecer no menu, deve ser acessada apenas através do link `host/linktree`

---

## Diretrizes de Design

- **Minimalista** — espaçamento amplo, poucos elementos
- **Tipografia moderna** — fontes limpas e legíveis
- **UX simples** — foco em clareza e hierarquia visual
- **Animações leves** — fade-in, scroll reveal, hover effects
- **Mobile-first** — responsivo desde o início
- **Cores:** defina dois padrões de cores um dark mode e um light mode, com opção no de alternar no header, não utilize transparências

---

## Rotas

| Rota | Componente |
|------|-----------|
| `/` | LandingComponent |
| `/links` | LinktreeComponent |

---

## Critérios de Aceitação

- [ ] Landing page carrega com todas as seções visíveis
- [ ] Hero section exibe nome, headlines e CTAs funcionais
- [ ] Botão "Ver Portfólio" faz scroll suave até Experiências
- [ ] Botão "Acessar Loja" navega para `/store`
- [ ] Seção "Sobre Mim" exibe texto institucional
- [ ] Seção "Experiências" exibe os 3 blocos
- [ ] Seção "Redes Sociais" exibe links funcionais abrindo em nova aba
- [ ] Página Linktree (`/links`) carrega com foto, nome e links
- [ ] Layout responsivo funciona em mobile, tablet e desktop
- [ ] Animações estão sutis e performáticas

---

## Dependências

- **Feature 00 (Foundation)** — projeto Angular configurado com roteamento e estrutura de pastas

---

## Observações

- Todo conteúdo é estático/hardcoded nesta fase
- Não requer backend
- Não requer banco de dados
- A Galeria será implementada na Feature 02 (separada)
