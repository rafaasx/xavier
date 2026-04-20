# Feature 03 — Foundation Backend (Node.js + Prisma + Supabase)

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | Node.js (TypeScript) em Vercel Functions | Supabase PostgreSQL (via MCP) | Prisma | Zod  
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature configura o backend da aplicação. Ela é necessária quando a Loja (Feature 04) passa a depender de dados dinâmicos. O MVP estático (Landing, Galeria, Linktree) **não depende** desta feature.

---

## Objetivo

Criar a fundação do backend com:

- API Node.js/TypeScript publicada na Vercel (`/api/*`)
- Conexão com Supabase PostgreSQL
- Prisma ORM com schema e migrations
- Zod para validação de payloads (body/query/params)
- Autenticação JWT
- CORS para o frontend
- Seed de usuário admin
- Health check endpoint

---

## Estrutura de Pastas

### Backend

```text
/api
  /health.ts
  /auth
    login.ts
    me.ts
  /products
    index.ts
    [id].ts
  /tags
    index.ts

/backend
  /src
    /features
      /auth
      /products
      /tags
      /medias
      /affiliate-links
    /shared
      db.ts
      auth.ts
      env.ts
  /prisma
    schema.prisma
    /migrations
```

---

## Modelo de Dados (Prisma)

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
}

model Product {
  id               String          @id @default(uuid())
  name             String
  shortDescription String
  longDescription  String
  createdAt        DateTime        @default(now())
  medias           Media[]
  productTags      ProductTag[]
  affiliateLinks   AffiliateLink[]
}

model Media {
  id          String   @id @default(uuid())
  productId   String
  url         String
  type        MediaType
  aspectRatio AspectRatio
  order       Int      @default(0)
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Tag {
  id          String       @id @default(uuid())
  name        String       @unique
  productTags ProductTag[]
}

model ProductTag {
  productId String
  tagId     String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag       Tag     @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([productId, tagId])
}

model AffiliateLink {
  id        String  @id @default(uuid())
  productId String
  platform  String
  url       String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

enum MediaType {
  IMAGE
  YOUTUBE
  INSTAGRAM
  VIDEO
}

enum AspectRatio {
  RATIO_16_9
  RATIO_9_16
}
```

---

## Tarefas

1. Criar estrutura Node.js/TypeScript para Vercel Functions.
2. Instalar e configurar pacotes principais:
   - `prisma`
   - `@prisma/client`
   - `zod`
   - `bcryptjs`
   - `jose` (JWT)
3. Configurar `schema.prisma` e gerar primeira migration.
4. Configurar conexão Supabase:
   - `DATABASE_URL` (pooling)
   - `DIRECT_URL` (migrations)
5. Criar seed do usuário admin (senha com hash BCrypt).
6. Implementar endpoints:
    - `GET /api/health`
    - `POST /api/auth/login`
    - `GET /api/auth/me` (protegido)
    - `GET /api/openapi` (spec OpenAPI)
    - `GET /api/docs` (Swagger UI)
7. Configurar CORS, validação de ambiente e validação de payload com Zod.
8. Publicar backend na Vercel.

---

## Endpoints desta Feature

> Todos os endpoints devem validar `body`, `query` e `params` com schemas Zod antes de acessar regras de negócio.

### GET /api/health

**Response (200):**

```json
{ "status": "healthy" }
```

### POST /api/auth/login

**Request:**

```json
{
  "email": "admin@rafaelxavier.com",
  "password": "senha123"
}
```

**Response (200):**

```json
{
  "token": "jwt...",
  "expiresAt": "2026-01-01T00:00:00Z"
}
```

### GET /api/auth/me (Auth)

**Response (200):**

```json
{
  "id": "uuid",
  "email": "admin@rafaelxavier.com"
}
```

### GET /api/openapi

Retorna o documento OpenAPI (JSON) para tooling e documentação.

### GET /api/docs

Interface Swagger UI para visualização e teste dos endpoints.

---

## Deploy (Vercel + Supabase)

- Frontend e backend no mesmo projeto Vercel.
- Rewrites de SPA continuam apontando para `index.html` apenas para rotas não-`/api`.
- Variáveis de ambiente obrigatórias na Vercel:
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `JWT_SECRET`
- Migrations Prisma executadas no pipeline de deploy.
- Banco provisionado/gerenciado no Supabase via MCP.

---

## Critérios de Aceitação

- [ ] Backend Node.js responde sem erro na Vercel
- [ ] Prisma conecta no Supabase com sucesso
- [ ] Migration inicial cria as tabelas corretamente
- [ ] Seed do admin funciona
- [ ] `GET /api/health` retorna `healthy`
- [ ] `POST /api/auth/login` retorna JWT válido
- [ ] `GET /api/auth/me` exige token válido
- [ ] CORS permite chamadas do frontend publicado
- [ ] Payloads inválidos retornam 400 com erro padronizado de validação
- [ ] `/api/docs` exibe a documentação Swagger

---

## Dependências

Nenhuma.

> O frontend (Features 00-02) funciona sem backend.
> A Loja (Feature 04) e o Admin (Feature 05) dependem desta feature.

