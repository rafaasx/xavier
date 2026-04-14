# Feature 03 — Foundation Backend (.NET + PostgreSQL)

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | .NET Core 10 Minimal API | PostgreSQL
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature configura o backend da aplicação. Ela é necessária a partir do momento em que a Loja (Feature 04) precisa de dados dinâmicos. O MVP estático (Landing, Galeria, Linktree) **não depende** desta feature.

---

## Objetivo

Criar a estrutura do backend com:

- Projeto .NET Core 10 Minimal API configurado e rodando
- Conexão com PostgreSQL configurada
- Modelo de dados completo com migrations
- Autenticação JWT configurada
- CORS configurado para o frontend
- Seed do usuário admin
- Health check endpoint

---

## Estrutura de Pastas

### Backend (`/backend`)

```
/src
  /Api              → Program.cs, endpoints, middlewares
  /Features         → organização por feature (vertical slice)
    /Auth           → Login, Me
    /Products       → CRUD endpoints
    /Tags           → CRUD endpoints
    /Medias         → CRUD endpoints
    /AffiliateLinks → CRUD endpoints
  /Domain           → entidades, enums
  /Infrastructure   → DbContext, migrations, seed
```

---

## Modelo de Dados

### Entidades

```csharp
public class User
{
    public Guid Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; } // BCrypt
}

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
    public MediaType Type { get; set; }
    public AspectRatio AspectRatio { get; set; }
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
    public string Platform { get; set; }
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

## Tarefas

### Projeto

1. Criar projeto .NET Core 10 Web API (`dotnet new webapi --use-minimal-apis`)
2. Configurar estrutura de pastas (`Features/`, `Domain/`, `Infrastructure/`)

### Pacotes

3. Instalar pacotes:
   - `Npgsql.EntityFrameworkCore.PostgreSQL`
   - `BCrypt.Net-Next`
   - `Microsoft.AspNetCore.Authentication.JwtBearer`

### Banco de Dados

4. Configurar `AppDbContext` com todas as entidades
5. Configurar connection string via `appsettings.json`
6. Criar migration inicial com todas as tabelas
7. Criar seed para usuário admin (senha com hash BCrypt)

### Autenticação

8. Configurar JWT Authentication no `Program.cs`
9. Criar endpoint `POST /api/auth/login`
10. Criar endpoint `GET /api/auth/me` [Auth]

### Configurações

11. Configurar CORS para aceitar o frontend
12. Criar endpoint `GET /api/health` (health check)
13. Configurar variáveis de ambiente (JWT Secret, DB connection)

---

## JWT Config

```json
{
  "Jwt": {
    "Secret": "chave-secreta-forte-minimo-256-bits",
    "Issuer": "xavier-api",
    "Audience": "xavier-app",
    "ExpirationMinutes": 480
  }
}
```

---

## API Endpoints (desta feature)

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
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expiresAt": "2025-04-14T10:00:00Z"
}
```

**Response (401):**
```json
{ "error": "Credenciais inválidas" }
```

### GET /api/auth/me [Auth]

**Response:**
```json
{
  "id": "guid",
  "email": "admin@rafaelxavier.com"
}
```

---

## Criação do Usuário Admin

```sql
INSERT INTO "Users" ("Id", "Email", "PasswordHash")
VALUES (
  gen_random_uuid(),
  'admin@rafaelxavier.com',
  '$2a$11$...'  -- hash BCrypt
);
```

> Implementar como seed no código para facilitar setup em novos ambientes.

---

## Diretrizes Técnicas

- **Evitar overengineering** — não usar Clean Architecture, CQRS, ou abstrações desnecessárias
- **Priorizar simplicidade** — Minimal API com organização por feature
- **Código modular** — cada feature isolada em sua pasta
- **Baixa complexidade** — fácil de entender e manter
- **Vertical Slice** — cada endpoint em seu próprio arquivo

---

## Critérios de Aceitação

- [ ] Projeto .NET Core roda com `dotnet run` sem erros
- [ ] Backend conecta ao PostgreSQL com sucesso
- [ ] Migration cria todas as tabelas corretamente
- [ ] Seed do admin funciona
- [ ] `GET /api/health` retorna status healthy
- [ ] `POST /api/auth/login` retorna JWT com credenciais válidas
- [ ] `POST /api/auth/login` retorna 401 com credenciais inválidas
- [ ] `GET /api/auth/me` retorna dados do usuário com token válido
- [ ] Endpoints protegidos retornam 401 sem token
- [ ] CORS permite requisições do frontend
- [ ] Estrutura de pastas segue o padrão definido

---

## Dependências

Nenhuma — esta feature é independente do frontend.

> O frontend (Features 00-02) funciona sem este backend.
> A Loja (Feature 04) e o Admin (Feature 05) dependem desta feature.

---

## Observações

- Não há cadastro de usuário pelo frontend — admin é criado via seed
- O admin é single-user (sem sistema de permissões/roles)
- Upload de imagens não está no escopo — todas as mídias são URLs externas
- Esta feature pode ser desenvolvida em paralelo com as Features 01 e 02
