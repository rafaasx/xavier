# Feature 04 — Loja (Store)

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | Node.js (TypeScript) em Vercel Functions | Supabase PostgreSQL + Prisma  
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature implementa a loja de afiliados (listagem + detalhe), consumindo backend Node.js com dados persistidos no Supabase.

---

## Objetivo

Entregar:

- Página `/store` com listagem, busca, filtros e ordenação
- Página `/store/:id` com detalhe, mídia e links afiliados
- API pública de produtos e tags
- Contratos estáveis para reutilização no admin

---

## Estrutura de Pastas

### Frontend

```text
/src/app/features/store
  /components
  /services
  /models
```

### Backend

```text
/api
  /products
    index.ts        -> GET /api/products
    [id].ts         -> GET /api/products/:id
  /tags
    index.ts        -> GET /api/tags

/backend/src/features
  /products
  /tags
```

---

## Modelo de Dados (Prisma)

`Product`, `Media`, `Tag`, `ProductTag` e `AffiliateLink` conforme definido na Feature 03.

---

## Endpoints (Store Pública)

### GET /api/products

**Query params:**

- `search` (string)
- `tags` (string[], ids)
- `sort` (`recent` | `name_asc` | `name_desc`)
- `page` (int)
- `pageSize` (int)

### GET /api/products/:id

Retorna produto completo com mídias, tags e links afiliados.

### GET /api/tags

Retorna lista de tags para filtros.

---

## Regras de Implementação

1. Filtros e ordenação executados no backend via Prisma.
2. Paginação obrigatória nas listagens.
3. Resposta de detalhe sempre ordenada por `Media.order`.
4. Links afiliados devem ser retornados prontos para abertura em nova aba.

---

## Deploy

- API publicada no mesmo projeto da Vercel.
- Conexão Supabase via `DATABASE_URL`.
- `DIRECT_URL` reservado para migrations/seed.
- Rewrites do SPA não podem interceptar `/api/*`.

---

## Critérios de Aceitação

- [ ] `/store` consome dados reais da API
- [ ] Busca, tags e ordenação funcionam em conjunto
- [ ] `/store/:id` exibe mídias e links afiliados corretamente
- [ ] API responde paginada e com performance adequada
- [ ] Layout responsivo (mobile/tablet/desktop)

---

## Dependências

- **Feature 02 (Gallery)** — componente `MediaRenderer`
- **Feature 03 (Backend Foundation)** — Node.js + Prisma + Supabase

