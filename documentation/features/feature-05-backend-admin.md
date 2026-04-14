# Feature 05 — Área Administrativa

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | .NET Core 10 Minimal API | PostgreSQL
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature implementa a área administrativa (frontend Angular) que consome os endpoints protegidos do backend (Feature 03). A autenticação JWT e o modelo de dados já foram configurados na Feature 03.

---

## Objetivo

Criar a área administrativa (frontend) e os endpoints de CRUD (backend) que permitem:

- Tela de login consumindo a API de autenticação (Feature 03)
- CRUD completo de produtos
- Gerenciamento de mídias por produto
- Gerenciamento de tags
- Gerenciamento de links afiliados por produto

---

## Estrutura de Pastas

### Frontend

```
/src/app/features
  /admin
    /components
      /login              → login.component.ts
      /dashboard          → dashboard.component.ts
      /product-form       → product-form.component.ts
      /product-list-admin → product-list-admin.component.ts
      /media-manager      → media-manager.component.ts
      /tag-manager        → tag-manager.component.ts
      /affiliate-manager  → affiliate-manager.component.ts
    /services
      auth.service.ts
      admin-product.service.ts
    /guards
      auth.guard.ts
    admin.component.ts
    admin-routing.module.ts

/src/app/core
  /interceptors
    auth.interceptor.ts    → adiciona JWT no header
  /services
    token.service.ts       → armazena/recupera JWT
```

### Backend

```
/src/Features
  /Auth
    Login.cs                → POST /api/auth/login
    Me.cs                   → GET /api/auth/me
  /Products
    GetProducts.cs          → GET /api/products (já existe da Feature 03)
    GetProductById.cs       → GET /api/products/{id} (já existe)
    CreateProduct.cs        → POST /api/products [Auth]
    UpdateProduct.cs        → PUT /api/products/{id} [Auth]
    DeleteProduct.cs        → DELETE /api/products/{id} [Auth]
  /Medias
    AddMedia.cs             → POST /api/products/{id}/medias [Auth]
    UpdateMedia.cs          → PUT /api/medias/{id} [Auth]
    DeleteMedia.cs          → DELETE /api/medias/{id} [Auth]
    ReorderMedias.cs        → PUT /api/products/{id}/medias/reorder [Auth]
  /Tags
    GetTags.cs              → GET /api/tags (já existe)
    CreateTag.cs            → POST /api/tags [Auth]
    DeleteTag.cs            → DELETE /api/tags/{id} [Auth]
  /AffiliateLinks
    AddAffiliateLink.cs     → POST /api/products/{id}/affiliate-links [Auth]
    UpdateAffiliateLink.cs  → PUT /api/affiliate-links/{id} [Auth]
    DeleteAffiliateLink.cs  → DELETE /api/affiliate-links/{id} [Auth]

/src/Domain
  User.cs
```

---

## Modelo de Dados

### User

```csharp
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; } // BCrypt
}
```

> O usuário admin é inserido diretamente no banco. Não há fluxo de cadastro via frontend.

### Demais Entidades

Conforme definido na Feature 03 (Product, Media, Tag, ProductTag, AffiliateLink).

---

## Autenticação

### Fluxo

1. Usuário admin acessa `/admin/login`
2. Envia email + senha via `POST /api/auth/login`
3. Backend valida credenciais (BCrypt compare)
4. Retorna JWT token
5. Frontend armazena token (localStorage ou sessionStorage)
6. Interceptor adiciona `Authorization: Bearer {token}` em todas as requisições
7. Backend valida JWT em endpoints protegidos

### JWT Config

```csharp
// appsettings.json
{
  "Jwt": {
    "Secret": "chave-secreta-forte-minimo-256-bits",
    "Issuer": "xavier-api",
    "Audience": "xavier-app",
    "ExpirationMinutes": 480  // 8 horas
  }
}
```

### Criação do Usuário Admin

```sql
-- Script para inserir admin no banco
-- A senha deve ser hasheada com BCrypt antes de inserir
INSERT INTO "Users" ("Id", "Email", "PasswordHash")
VALUES (
  gen_random_uuid(),
  'admin@rafaelxavier.com',
  '$2a$11$...'  -- hash BCrypt da senha
);
```

> Criar um script/seed no backend para facilitar a criação do admin.

---

## API Endpoints

### Auth

#### POST /api/auth/login

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
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2025-04-14T10:00:00Z"
}
```

**Response (401):**
```json
{ "error": "Credenciais inválidas" }
```

#### GET /api/auth/me [Auth]

**Response:**
```json
{
  "id": "guid",
  "email": "admin@rafaelxavier.com"
}
```

---

### Products (Admin)

#### POST /api/products [Auth]

**Request:**
```json
{
  "name": "Produto X",
  "shortDescription": "Descrição curta",
  "longDescription": "Descrição longa detalhada..."
}
```

#### PUT /api/products/{id} [Auth]

**Request:** Mesmo body do POST.

#### DELETE /api/products/{id} [Auth]

Remove produto e todas as relações (mídias, tags, links).

---

### Medias (Admin)

#### POST /api/products/{productId}/medias [Auth]

**Request:**
```json
{
  "url": "https://youtube.com/watch?v=xxx",
  "type": "YOUTUBE",
  "aspectRatio": "16:9"
}
```

#### PUT /api/medias/{id} [Auth]

**Request:** Mesmo body do POST.

#### DELETE /api/medias/{id} [Auth]

#### PUT /api/products/{productId}/medias/reorder [Auth]

**Request:**
```json
{
  "mediaIds": ["guid1", "guid2", "guid3"]
}
```

---

### Tags (Admin)

#### POST /api/tags [Auth]

**Request:**
```json
{ "name": "Tech" }
```

#### DELETE /api/tags/{id} [Auth]

---

### Affiliate Links (Admin)

#### POST /api/products/{productId}/affiliate-links [Auth]

**Request:**
```json
{
  "platform": "Amazon",
  "url": "https://amzn.to/xxxxx"
}
```

#### PUT /api/affiliate-links/{id} [Auth]

#### DELETE /api/affiliate-links/{id} [Auth]

---

## Especificações do Frontend (Admin)

### 1. Login (`/admin/login`)

- Formulário com email + senha
- Validação de campos obrigatórios
- Mensagem de erro em caso de credenciais inválidas
- Redireciona para `/admin` após login

### 2. Dashboard (`/admin`)

- Lista de produtos em tabela
- Botão "Novo Produto"
- Ações por produto: Editar, Excluir
- Contagem de mídias e links por produto

### 3. Formulário de Produto (`/admin/products/new` e `/admin/products/:id/edit`)

- Campos: Nome, Descrição curta, Descrição longa
- Seção de Mídias:
  - Listar mídias existentes com preview
  - Adicionar nova mídia (URL + tipo + aspect ratio)
  - Remover mídia
  - Reordenar mídias (drag & drop ou setas)
- Seção de Tags:
  - Selecionar tags existentes (chips/checkboxes)
  - Criar nova tag inline
- Seção de Links Afiliados:
  - Listar links existentes
  - Adicionar novo link (plataforma + URL)
  - Remover link

### 4. Gerenciamento de Tags (`/admin/tags`)

- Lista de tags existentes
- Criar nova tag
- Excluir tag (com confirmação)

---

## Rotas (Frontend)

| Rota | Componente | Guard |
|------|-----------|-------|
| `/admin/login` | LoginComponent | — |
| `/admin` | DashboardComponent | AuthGuard |
| `/admin/products/new` | ProductFormComponent | AuthGuard |
| `/admin/products/:id/edit` | ProductFormComponent | AuthGuard |
| `/admin/tags` | TagManagerComponent | AuthGuard |

---

## Segurança

- Todos os endpoints de escrita requerem JWT válido
- Endpoints de leitura (GET /products, GET /tags) são públicos
- Senhas armazenadas com BCrypt (cost factor ≥ 11)
- JWT secret deve ser forte (≥ 256 bits)
- CORS configurado para aceitar apenas o domínio do frontend
- Interceptor no Angular para logout automático em 401

---

## Critérios de Aceitação

- [ ] Login funciona com email + senha corretos
- [ ] Login retorna erro com credenciais inválidas
- [ ] JWT é armazenado e enviado em requisições subsequentes
- [ ] Rotas admin são protegidas (redirect para login se não autenticado)
- [ ] CRUD de produtos funciona (criar, editar, excluir)
- [ ] Mídias podem ser adicionadas, editadas, removidas e reordenadas
- [ ] Tags podem ser criadas, associadas a produtos e removidas
- [ ] Links afiliados podem ser adicionados, editados e removidos
- [ ] Endpoints protegidos retornam 401 sem token válido
- [ ] Formulário de produto valida campos obrigatórios
- [ ] Exclusão de produto remove mídias, tags e links relacionados
- [ ] Interface admin é responsiva

---

## Dependências

- **Feature 00 (Foundation Frontend)** — projeto Angular configurado
- **Feature 03 (Backend Foundation)** — .NET + PostgreSQL + JWT + modelo de dados
- **Feature 04 (Store)** — endpoints de leitura pública (GET /products, GET /tags)

---

## Observações

- Não há cadastro de usuário pelo frontend — admin é criado via script/seed
- O admin é single-user (não há sistema de permissões/roles)
- Considerar adicionar soft delete para produtos no futuro
- Upload de imagens não está no escopo — todas as mídias são URLs externas
- Validação de URLs de afiliados no frontend (formato válido)
