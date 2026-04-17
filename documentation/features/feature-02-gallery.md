# Feature 02 — Galeria de Mídia

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | .NET Core 10 Minimal API | PostgreSQL
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature implementa a galeria de mídia na landing page, com suporte a múltiplos tipos de conteúdo (imagens, vídeos YouTube, Instagram, CDN). O sistema de renderização de mídia criado aqui será reutilizado pela Loja (Feature 04).

---

## Objetivo

Criar uma seção de galeria na landing page que:

- Exibe imagens e vídeos autorais do Rafael
- Suporta múltiplos formatos de mídia
- Renderiza embeds nativos de YouTube e Instagram
- Reproduz vídeos de CDN via HTML5
- É responsivo e performático

---

## Estrutura de Pastas

### Frontend

```
/src/app/features
  /landing
    /components
      /gallery       → gallery-section.component.ts

/src/app/shared
  /components
    /media-renderer  → media-renderer.component.ts (reutilizável)
  /models
    media.model.ts
  /enums
    media-type.enum.ts
```

---

## Sistema de Mídia (CRÍTICO)

### Tipos de Mídia

```typescript
enum MediaType {
  IMAGE = 'IMAGE',
  YOUTUBE = 'YOUTUBE',
  INSTAGRAM = 'INSTAGRAM',
  VIDEO = 'VIDEO'  // CDN
}
```

### Modelo de Mídia

```typescript
interface Media {
  id: string;
  url: string;
  type: MediaType;
  aspectRatio: '16:9' | '9:16';
  alt?: string;       // para imagens
  thumbnail?: string; // para vídeos
}
```

### Regras de Renderização

#### IMAGE

```html
<img [src]="media.url" [alt]="media.alt" loading="lazy" />
```

#### YOUTUBE

Transformar URL:
- `https://www.youtube.com/watch?v=XXXXX` → `https://www.youtube.com/embed/XXXXX`
- `https://youtu.be/XXXXX` → `https://www.youtube.com/embed/XXXXX`

```html
<iframe
  [src]="embedUrl | safe"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

#### INSTAGRAM

```html
<blockquote
  class="instagram-media"
  [attr.data-instgrm-permalink]="media.url">
</blockquote>
<!-- Carregar script oficial do Instagram -->
<script async src="//www.instagram.com/embed.js"></script>
```

> Chamar `window.instgrm.Embeds.process()` após renderizar.

#### VIDEO (CDN)

```html
<video controls [src]="media.url" preload="metadata">
  Seu navegador não suporta o elemento de vídeo.
</video>
```

### Responsividade de Aspect Ratio

- **16:9** — padrão para vídeos landscape
- **9:16** — para vídeos vertical (Reels, Shorts, Stories)

```css
/* 16:9 */
.media-container.ratio-16-9 {
  aspect-ratio: 16 / 9;
}

/* 9:16 */
.media-container.ratio-9-16 {
  aspect-ratio: 9 / 16;
  max-width: 350px; /* limitar largura em desktop */
}
```

---

## Componente MediaRenderer (Shared)

O componente `MediaRendererComponent` é **reutilizável** e será usado tanto na galeria quanto na loja.

**Input:**
- `media: Media` — objeto com URL, tipo e aspect ratio

**Comportamento:**
- Renderiza o conteúdo correto baseado no `media.type`
- Aplica aspect ratio correto
- Lazy loading para imagens
- Sanitiza URLs de embed (DomSanitizer)

---

## Galeria (Seção da Landing)

### Layout

- Grid responsivo:
  - Desktop: 3-4 colunas
  - Tablet: 2 colunas
  - Mobile: 1 coluna
- Lazy loading dos itens conforme scroll

### Dados

- Nesta fase, os dados da galeria são **hardcoded** em um array no componente
- Futuramente pode ser migrado para o banco de dados

### Interação

- Click em imagem → modal/lightbox com tamanho maior
- Click em vídeo → reproduz no local ou abre modal
- Filtro por tipo de mídia (opcional nesta fase)

---

## Critérios de Aceitação

- [ ] Galeria exibe grid responsivo com imagens e vídeos
- [ ] Vídeos do YouTube renderizam como embed funcional
- [ ] Posts do Instagram renderizam como embed nativo
- [ ] Vídeos de CDN reproduzem via player HTML5
- [ ] Aspect ratios 16:9 e 9:16 são respeitados
- [ ] Lazy loading funciona para imagens
- [ ] Layout responsivo (mobile, tablet, desktop)
- [ ] Componente `MediaRenderer` funciona isoladamente
- [ ] URLs são sanitizadas corretamente (sem erros de segurança)

---

## Dependências

- **Feature 00 (Foundation)** — projeto Angular com estrutura de pastas
- **Feature 01 (Landing)** — landing page onde a galeria será inserida como seção

---

## Observações

- O componente `MediaRenderer` deve ficar em `shared/` pois será reutilizado na Feature 04 (Loja)
- Dados hardcoded nesta fase — backend não necessário ainda
- O script do Instagram embed deve ser carregado dinamicamente (não no index.html)
- Considerar usar `IntersectionObserver` para lazy loading de embeds
