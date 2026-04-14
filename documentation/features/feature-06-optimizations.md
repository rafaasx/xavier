# Feature 06 — Otimizações (Performance, SEO, Responsividade)

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | .NET Core 10 Minimal API | PostgreSQL
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature é a fase final de polimento, focada em otimizações de performance, SEO e responsividade para garantir que a aplicação atenda aos padrões de qualidade definidos.

---

## Objetivo

Otimizar a aplicação para:

- Performance (Lighthouse score > 90)
- SEO otimizado para buscadores
- Responsividade total (mobile-first)
- Acessibilidade básica
- Experiência de usuário refinada

---

## 1. Performance

### Lighthouse > 90

**Métricas alvo:**

| Métrica | Alvo |
|---------|------|
| Performance | > 90 |
| Accessibility | > 90 |
| Best Practices | > 90 |
| SEO | > 90 |

### Otimizações Frontend

#### Lazy Loading
- Confirmar que todos os feature modules usam lazy loading
- Rotas: `/store`, `/admin`, `/links` carregam sob demanda
- Imagens: usar `loading="lazy"` em todas as `<img>`
- Embeds: carregar iframes apenas quando visíveis (IntersectionObserver)

#### Bundle Size
- Analisar bundle com `ng build --stats-json` + webpack-bundle-analyzer
- Remover imports desnecessários
- Tree-shaking funcionando
- Evitar importar bibliotecas inteiras (ex: importar apenas módulos necessários)

#### Assets
- Otimizar imagens estáticas (WebP quando possível)
- Usar fontes com `font-display: swap`
- Minificação de CSS/JS (automático no build de produção)
- Comprimir assets com gzip/brotli no servidor

#### Renderização
- Evitar layout shifts (CLS) — definir dimensões de imagens e containers
- Preconnect para domínios externos (YouTube, Instagram, CDNs)
- Prefetch de rotas prováveis

```html
<!-- No index.html -->
<link rel="preconnect" href="https://www.youtube.com">
<link rel="preconnect" href="https://www.instagram.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

### Otimizações Backend

- Response compression (gzip/brotli)
- Caching headers para assets estáticos
- Cache de queries frequentes (lista de tags, produtos populares)
- Paginação eficiente (evitar `COUNT(*)` quando possível)
- Índices no banco:
  - `Product.Name` (busca)
  - `Product.CreatedAt` (ordenação)
  - `ProductTag` (composite index)

---

## 2. SEO

### Meta Tags

#### Landing Page
```html
<title>Rafael Xavier — Engenheiro de Software | Criador de Conteúdo | Video Maker</title>
<meta name="description" content="Portfólio de Rafael Xavier: engenheiro de software full stack, criador de conteúdo e video maker. .NET, Angular, Vue, React.">
<meta name="keywords" content="Rafael Xavier, engenheiro de software, full stack, .NET, Angular, criador de conteúdo, video maker">
```

#### Loja
```html
<title>Loja — Produtos Recomendados por Rafael Xavier</title>
<meta name="description" content="Produtos recomendados por Rafael Xavier nas áreas de tecnologia, overlanding, equipamentos e gadgets.">
```

#### Detalhe do Produto (dinâmico)
```html
<title>{nome do produto} — Loja Rafael Xavier</title>
<meta name="description" content="{descrição curta do produto}">
```

### Open Graph / Social Sharing

```html
<meta property="og:title" content="Rafael Xavier — Portfólio & Loja">
<meta property="og:description" content="Engenheiro de Software, Criador de Conteúdo e Video Maker">
<meta property="og:image" content="URL da imagem de preview">
<meta property="og:url" content="URL da página">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Rafael Xavier">
<meta name="twitter:description" content="Portfólio & Loja de Afiliados">
```

### Estrutura

- URLs semânticas (`/store`, `/store/nome-do-produto`, `/links`)
- Heading hierarchy correto (h1 → h2 → h3)
- Alt text em todas as imagens
- Sitemap.xml
- robots.txt
- Canonical URLs

### Angular SSR (Opcional)

- Considerar Angular SSR (Server-Side Rendering) para melhorar SEO
- Alternativa: pre-rendering de rotas estáticas com `ng build --prerender`
- Prioridade: landing page e páginas de produto (importantes para SEO)

---

## 3. Responsividade (Mobile-First)

### Breakpoints

| Breakpoint | Tamanho | Dispositivo |
|-----------|---------|-------------|
| xs | < 576px | Mobile pequeno |
| sm | ≥ 576px | Mobile grande |
| md | ≥ 768px | Tablet |
| lg | ≥ 992px | Desktop |
| xl | ≥ 1200px | Desktop grande |

### Checklist por Página

#### Landing Page
- [ ] Hero section: texto centralizado, CTAs empilhados em mobile
- [ ] Sobre Mim: texto fluido, sem overflow
- [ ] Experiências: cards empilham verticalmente em mobile
- [ ] Redes Sociais: ícones se ajustam ao espaço
- [ ] Galeria: 1 coluna em mobile, 2 em tablet, 3-4 em desktop

#### Loja
- [ ] Sidebar de filtros colapsa em drawer/modal no mobile
- [ ] Grid de produtos: 1 coluna mobile, 2 tablet, 3-4 desktop
- [ ] Busca e ordenação acessíveis em mobile
- [ ] Detalhe: carrossel funciona com touch/swipe
- [ ] Links afiliados: botões full-width em mobile

#### Admin
- [ ] Tabelas responsivas (scroll horizontal ou cards em mobile)
- [ ] Formulários ocupam largura total em mobile
- [ ] Navegação adaptada (hamburger menu ou sidebar colapsável)

#### Linktree
- [ ] Centralizado e bonito em qualquer tamanho
- [ ] Botões com largura adequada

---

## 4. Acessibilidade (A11y)

### Mínimo Necessário

- Contraste de cores adequado (WCAG AA)
- Focus visible em elementos interativos
- Labels em todos os inputs de formulário
- Alt text em imagens
- Aria-labels onde necessário
- Navegação por teclado funcional
- Skip-to-content link

---

## 5. Refinamentos de UX

### Animações
- Scroll reveal suave (fade-in, slide-up)
- Transições de página
- Hover effects consistentes
- Loading states (skeleton screens ou spinners)
- Transições suaves nos filtros da loja

### Feedback Visual
- Estados de loading em botões
- Mensagens de sucesso/erro no admin
- Empty states (loja sem resultados, etc.)
- 404 page customizada

### Micro-interações
- Botão de scroll-to-top
- Indicador de seção ativa no scroll da landing
- Smooth scroll entre seções

---

## Critérios de Aceitação

- [ ] Lighthouse Performance > 90 em todas as páginas públicas
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 90
- [ ] Lighthouse SEO > 90
- [ ] Meta tags corretas em todas as páginas
- [ ] Open Graph tags funcionando (testar com Facebook Debugger)
- [ ] Sitemap.xml e robots.txt presentes
- [ ] Layout funciona em mobile (320px), tablet (768px) e desktop (1200px+)
- [ ] Sem layout shifts visíveis (CLS < 0.1)
- [ ] Lazy loading funciona para imagens e módulos
- [ ] Navegação por teclado funcional
- [ ] Contraste de cores adequado
- [ ] Loading states em todas as operações assíncronas
- [ ] 404 page customizada

---

## Dependências

- **Features 00-05** — todas as features devem estar implementadas antes das otimizações finais

---

## Observações

- Rodar Lighthouse em modo incógnito para resultados mais precisos
- Testar em dispositivos reais além de emuladores
- Angular SSR é opcional nesta fase — avaliar necessidade baseado nos resultados de SEO
- Considerar usar Google Search Console para monitorar indexação
- Performance do backend pode ser monitorada com ferramentas como Application Insights
