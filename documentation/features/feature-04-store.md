# Feature 04 — Loja (Store)

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | .NET Core 10 Minimal API | PostgreSQL
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature implementa a loja de afiliados — um e-commerce simplificado onde Rafael exibe produtos que recomenda, com links de afiliados para diversas plataformas.

---

## Objetivo

Criar a seção de loja com:

- Página de listagem de produtos com grid
- Sidebar de filtros (tags, busca, ordenação)
- Página de detalhe do produto com carrossel de mídia
- Links de afiliados para múltiplas plataformas
- Backend API para servir os dados dos produtos

---

## Estrutura de Pastas

### Frontend

```
/src/app/features
  /store
    /components
      /product-list      → product-list.component.ts
      /product-card      → product-card.component.ts
      /product-detail    → product-detail.component.ts
      /product-filters   → product-filters.component.ts
      /media-carousel    → media-carousel.component.ts
      /affiliate-links   → affiliate-links.component.ts
    /services
      product.service.ts
    /models
      product.model.ts
      affiliate-link.model.ts
    store.component.ts
    store-routing.module.ts
```

### Backend

```
/src/Features
  /Products
    GetProducts.cs          → GET /api/products (listagem com filtros)
    GetProductById.cs       → GET /api/products/{id} (detalhe)
  /Tags
    GetTags.cs              → GET /api/tags (para filtros)

/src/Domain
  Product.cs
  Media.cs
  Tag.cs
  ProductTag.cs
  AffiliateLink.cs

/src/Infrastructure
  AppDbContext.cs            → DbContext com entidades
  Migrations/
```

---

## Modelo de Dados

### Entidades

```csharp
public class Product
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string ShortDescription { get; set; }
    public string LongDescription { get; set; }
    public DateTime CreatedAt { get; set; }

    public List<Media> Medias { get; set; }
    public List<ProductTag> ProductTags { get; set; }
    public List<AffiliateLink> AffiliateLinks { get; set; }
}

public class Media
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string Url { get; set; }
    public MediaType Type { get; set; }        // IMAGE, YOUTUBE, INSTAGRAM, VIDEO
    public AspectRatio AspectRatio { get; set; } // RATIO_16_9, RATIO_9_16
    public int Order { get; set; }

    public Product Product { get; set; }
}

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    public List<ProductTag> ProductTags { get; set; }
}

public class ProductTag
{
    public Guid ProductId { get; set; }
    public Guid TagId { get; set; }

    public Product Product { get; set; }
    public Tag Tag { get; set; }
}

public class AffiliateLink
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string Platform { get; set; }  // Amazon, Mercado Livre, AliExpress, Shopee, etc.
    public string Url { get; set; }

    public Product Product { get; set; }
}
```

### Enums

```csharp
public enum MediaType { IMAGE, YOUTUBE, INSTAGRAM, VIDEO }
public enum AspectRatio { RATIO_16_9, RATIO_9_16 }
```

---

## API Endpoints (Backend)

### GET /api/products

**Query Parameters:**

| Param | Tipo | Descrição |
|-------|------|-----------|
| `search` | string | Busca por nome do produto |
| `tags` | string[] | Filtro por tags (IDs, multi-seleção) |
| `sort` | string | Ordenação: `recent`, `name_asc`, `name_desc` |
| `page` | int | Página (default: 1) |
| `pageSize` | int | Itens por página (default: 12) |

**Response:**

```json
{
  "items": [
    {
      "id": "guid",
      "name": "string",
      "shortDescription": "string",
      "mainImage": "string (url)",
      "tags": ["string"]
    }
  ],
  "totalCount": 0,
  "page": 1,
  "pageSize": 12
}
```

### GET /api/products/{id}

**Response:**

```json
{
  "id": "guid",
  "name": "string",
  "shortDescription": "string",
  "longDescription": "string",
  "medias": [
    {
      "id": "guid",
      "url": "string",
      "type": "IMAGE | YOUTUBE | INSTAGRAM | VIDEO",
      "aspectRatio": "16:9 | 9:16",
      "order": 0
    }
  ],
  "tags": [
    { "id": "guid", "name": "string" }
  ],
  "affiliateLinks": [
    {
      "id": "guid",
      "platform": "Amazon",
      "url": "string"
    }
  ]
}
```

### GET /api/tags

**Response:**

```json
[
  { "id": "guid", "name": "Tech" },
  { "id": "guid", "name": "Overlanding" }
]
```

---

## Especificações do Frontend

### 1. Página de Listagem (`/store`)

**Layout:**

```
┌─────────────────────────────────────────┐
│  [Busca]            [Ordenação ▼]       │
├────────────┬────────────────────────────┤
│  Filtros   │  ┌──────┐ ┌──────┐ ┌────┐ │
│            │  │ Card │ │ Card │ │Card│ │
│  □ Tech    │  └──────┘ └──────┘ └────┘ │
│  □ Over..  │  ┌──────┐ ┌──────┐ ┌────┐ │
│  □ Equip.  │  │ Card │ │ Card │ │Card│ │
│  □ Gadgets │  └──────┘ └──────┘ └────┘ │
└────────────┴────────────────────────────┘
```

- Grid: 3-4 colunas desktop, 2 tablet, 1 mobile
- Sidebar colapsa em drawer no mobile

### 2. Filtros

#### Tags (multi-seleção)
- Categorias predefinidas: Tech, Overlanding, Equipamentos, Gadgets
- Checkbox para multi-seleção
- Filtragem combinada (AND ou OR — recomendo OR)

#### Busca
- Campo de texto
- Busca por nome do produto
- Debounce de 300ms

#### Ordenação
- Mais recentes (padrão)
- Nome A-Z
- Nome Z-A

### 3. Card do Produto

**Conteúdo:**
- Imagem principal (primeira mídia do tipo IMAGE)
- Nome do produto
- Descrição curta (truncada se necessário)

**Interação:**
- Click → navega para `/store/{id}`
- Hover → efeito sutil (scale ou shadow)

### 4. Página de Detalhe (`/store/:id`)

**Estrutura:**

#### Carrossel de Mídia
- Imagens e vídeos do produto
- Navegação por setas e dots/thumbnails
- Usa o componente `MediaRenderer` da Feature 02
- Suporta 16:9 e 9:16

#### Informações
- Nome do produto
- Descrição longa (com formatação markdown ou HTML)
- Tags como chips/badges

#### Links Afiliados
- Lista de plataformas com botões
- Cada botão: ícone/logo da plataforma + "Ver produto"
- Click → abre URL do afiliado em nova aba (`target="_blank"`, `rel="noopener"`)

**Plataformas suportadas:**
- Amazon
- Mercado Livre
- AliExpress
- Shopee
- Outras (genérico)

---

## Rotas

| Rota | Componente |
|------|-----------|
| `/store` | StoreComponent → ProductListComponent |
| `/store/:id` | ProductDetailComponent |

---

## Critérios de Aceitação

- [ ] Página de listagem exibe grid de produtos do backend
- [ ] Filtro por tags funciona com multi-seleção
- [ ] Busca por nome funciona com debounce
- [ ] Ordenação funciona (recentes, A-Z, Z-A)
- [ ] Filtros combinam corretamente
- [ ] Card exibe imagem, nome e descrição curta
- [ ] Click no card navega para detalhe
- [ ] Página de detalhe exibe carrossel de mídia funcional
- [ ] Mídias renderizam corretamente por tipo (IMAGE, YOUTUBE, INSTAGRAM, VIDEO)
- [ ] Links afiliados abrem em nova aba
- [ ] Layout responsivo (mobile, tablet, desktop)
- [ ] Sidebar colapsa em mobile
- [ ] API retorna dados paginados
- [ ] API suporta filtros e ordenação

---

## Dependências

- **Feature 00 (Foundation Frontend)** — projeto Angular configurado com roteamento e estrutura
- **Feature 02 (Gallery)** — componente `MediaRenderer` reutilizável
- **Feature 03 (Backend Foundation)** — .NET Core + PostgreSQL + autenticação JWT

---

## Observações

- A loja é pública — não requer autenticação para visualizar
- O cadastro de produtos é feito na Feature 05 (Admin)
- Para desenvolvimento, criar seed data com produtos de exemplo
- Considerar paginação infinita (scroll) como alternativa à paginação tradicional
- Links de afiliados devem ter `rel="noopener noreferrer sponsored"` por boas práticas
