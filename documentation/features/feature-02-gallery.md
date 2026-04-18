# Feature 02 — Galeria de Mídia

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | .NET Core 10 Minimal API | PostgreSQL
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature implementa a galeria de mídia na landing page e em uma aba dedicada (`/gallery`), com suporte a conteúdos embedados (YouTube e Instagram). O sistema de renderização de mídia criado aqui será reutilizado pela Loja (Feature 04).

---

## Objetivo

Criar uma galeria de mídia que:

- Exibe conteúdos autorais embedados do Rafael
- Suporta múltiplos formatos de mídia
- Renderiza embeds nativos de YouTube e Instagram
- É responsivo e performático
- Fica acessível também em uma aba própria fora da loja (`/gallery`)

---

## Estrutura de Pastas

### Frontend

```
/src/app/features
  /landing
    /components
      /gallery       → gallery-section.component.ts
  /gallery
    gallery.component.ts
    gallery.routes.ts
    gallery-content.ts

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

## Galeria (Landing + Aba dedicada)

### Layout

- Grid responsivo:
  - Desktop: 3-4 colunas
  - Tablet: 2 colunas
  - Mobile: 1 coluna
- Lazy loading dos itens conforme scroll

### Dados

- Nesta fase, os dados da galeria são **hardcoded** em `gallery-content.ts`
- Futuramente pode ser migrado para o banco de dados

### Interação

- Click em item da galeria → visualização em destaque com embed responsivo
- Filtro por tipo de mídia (opcional nesta fase)

---

## Critérios de Aceitação

- [ ] Galeria exibe grid responsivo com conteúdos embedados
- [ ] Vídeos do YouTube renderizam como embed funcional
- [ ] Posts do Instagram renderizam como embed nativo
- [ ] Aspect ratios 16:9 e 9:16 são respeitados
- [ ] Lazy loading funciona para imagens
- [ ] Layout responsivo (mobile, tablet, desktop)
- [ ] Componente `MediaRenderer` funciona isoladamente
- [ ] URLs são sanitizadas corretamente (sem erros de segurança)
- [ ] Aba `/gallery` funciona fora da loja e exibe os links embedados do conteúdo da galeria

---

## Rotas

| Rota | Componente |
|------|-----------|
| `/gallery` | GalleryComponent |

---

## Dependências

- **Feature 00 (Foundation)** — projeto Angular com estrutura de pastas
- **Feature 01 (Landing)** — landing page onde a galeria será inserida como seção

---

## Conteúdo da Galeria

https://www.youtube.com/watch?v=TdmLme2IfN8&t=2s
https://www.youtube.com/watch?v=6sYzS4LdiSY&t=2s
https://www.youtube.com/watch?v=LTNlRztvg3k
https://www.youtube.com/watch?v=vNKB4bl7JPc&t=303s
https://www.youtube.com/watch?v=kC6skYsseZ4
https://www.youtube.com/watch?v=4SpXvRqjd1o
https://www.youtube.com/watch?v=hLEXm8QCrgY&t=516s
https://www.instagram.com/reel/DUeNI9FAWH2/?igsh=MXBrNWd1eDhzd2dkYw==
https://www.instagram.com/reel/DHYkqRuMd7Z/?igsh=YjhlOHNmanZsemFs
https://www.instagram.com/reel/CbKw5ZqFfRm/?igsh=eWdhMzFsZnN0anpo
https://www.instagram.com/reel/ChlOJVWlaoW/?igsh=aDVodTM3djBldThz
https://www.instagram.com/reel/C_ocQtLPMu_/?igsh=MXNiOG5jbDQxYWdydA==
https://www.instagram.com/reel/C6ReqaprgEF/?igsh=YW5sY28xODQ4cHlx
https://www.instagram.com/reel/CidkxVqpR96/?igsh=M2s5cDIzbmFheW9u
https://www.instagram.com/reel/CkGaVKHuBpI/?igsh=NmJyNWVpNmllanF2
https://www.instagram.com/reel/ChMsTmnFGbq/?igsh=MW8xYnRoYWd3eHA2dg==
https://www.instagram.com/reel/DNmM31iPDo4/?igsh=MTRldHdsajk1eGN4bw==
https://www.instagram.com/reel/C7wtV2JuLlO/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==
https://www.instagram.com/aventurasobrerodasoficial/p/DWryZw6j_Co/
https://www.instagram.com/aventurasobrerodasoficial/p/DWH4DWjD6g0/
https://www.instagram.com/aventurasobrerodasoficial/p/DV8sLCuDqOv/
https://www.instagram.com/aventurasobrerodasoficial/p/DVOjAQ6EVpZ/

---

## Observações

- O componente `MediaRenderer` deve ficar em `shared/` pois será reutilizado na Feature 04 (Loja)
- Dados hardcoded nesta fase — backend não necessário ainda
- O script do Instagram embed deve ser carregado dinamicamente (não no index.html)
- Considerar usar `IntersectionObserver` para lazy loading de embeds

