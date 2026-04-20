# Feature 05 — Área Administrativa (Frontend + Backend)

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | Node.js (TypeScript) em Vercel Functions | Supabase PostgreSQL + Prisma + Zod | ngx-mask (frontend)
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature implementa a área administrativa para autenticação e CRUD de produtos, mídias, tags e links afiliados.

---

## Objetivo

Entregar:

- Login admin com JWT
- Rotas protegidas no frontend
- CRUD completo de produtos
- Gestão de mídias, tags e links afiliados

---

## Estrutura de Pastas

### Frontend

```text
/src/app/features/admin
  /components
  /services
  /guards

/src/app/core
  /interceptors
```

### Backend

```text
/api
  /auth/login.ts
  /auth/me.ts
  /products/index.ts
  /products/[id].ts
  /products/[id]/medias.ts
  /products/[id]/affiliate-links.ts
  /tags/index.ts
  /tags/[id].ts
  /medias/[id].ts
  /affiliate-links/[id].ts
```

---

## Endpoints Admin (Auth)

- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`
- `POST /api/products/:id/medias`
- `PUT /api/medias/:id`
- `DELETE /api/medias/:id`
- `PUT /api/products/:id/medias/reorder`
- `POST /api/tags`
- `DELETE /api/tags/:id`
- `POST /api/products/:id/affiliate-links`
- `PUT /api/affiliate-links/:id`
- `DELETE /api/affiliate-links/:id`

---

## Segurança

- JWT assinado com `JWT_SECRET`
- Senhas com BCrypt
- Validação de entrada com Zod em todos os endpoints admin
- Middleware de autenticação em todas as rotas de escrita
- CORS limitado ao domínio publicado na Vercel
- Interceptor Angular para anexar token e tratar 401

---

## Máscaras de Campos (Frontend Admin)

- Usar `ngx-mask` para campos numéricos com padrão PT-BR.
- Aplicar máscara em valores monetários, percentuais, quantidade e outros campos numéricos do formulário admin.

---

## Persistência

- Prisma como camada de acesso a dados
- Banco Supabase PostgreSQL via MCP
- Migrations versionadas em `backend/prisma/migrations`

---

## Deploy

- Funções API do admin no mesmo projeto Vercel do frontend.
- Variáveis obrigatórias:
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `JWT_SECRET`
- Seed do usuário admin executado em ambiente controlado (não via frontend).

---

## Critérios de Aceitação

- [ ] Login retorna JWT com credenciais válidas
- [ ] Rotas admin do frontend exigem autenticação
- [ ] CRUD de produtos funciona ponta a ponta
- [ ] Mídias, tags e links afiliados podem ser gerenciados
- [ ] Endpoints protegidos retornam 401 sem token
- [ ] Dados persistidos no Supabase via Prisma

---

## Dependências

- **Feature 03** — Foundation backend Node.js + Prisma + Supabase
- **Feature 04** — Contratos de produto já consolidados

