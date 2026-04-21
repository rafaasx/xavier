# Feature 05 — Login Admin com JWT e Rotas Protegidas

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | Node.js (TypeScript) em Vercel Functions | Supabase PostgreSQL + Prisma + Zod | ngx-mask (frontend)  
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature cobre exclusivamente autenticação admin e proteção de acesso no frontend.

---

## Objetivo

Entregar:

- Login admin com JWT
- Endpoint para validar sessão autenticada
- Guarda de rotas no frontend para área administrativa
- Interceptor para anexar credenciais e tratar 401
- Menu admin para navegação entre os CRUds (produtos, mídias, tags e links afiliados)

---

## Estrutura de Pastas

### Frontend

```text
/src/app/features/admin
  /components/menu
  /guards
  /services
  /components/login

/src/app/core
  /interceptors
```

### Backend

```text
/api
  /auth/login.ts
  /auth/me.ts
```

---

## Endpoints (Auth)

- `POST /api/auth/login`
- `GET /api/auth/me`

---

## Regras de Implementação

1. Credenciais válidas retornam sessão autenticada (JWT emitido pelo backend).
2. `GET /api/auth/me` deve ser a fonte de verdade para estado de autenticação no frontend.
3. Sem token/cookie válido, endpoints protegidos retornam `401`.
4. Todas as entradas devem ser validadas com Zod.
5. Senhas devem ser comparadas com hash BCrypt.
6. Interceptor do frontend deve tratar `401` redirecionando para login/admin.
7. Área autenticada deve exibir menu lateral/superior com atalhos para os módulos de CRUD.
8. Menu deve manter estado visual de rota ativa para facilitar navegação.

---

## Segurança

- JWT assinado com `JWT_SECRET`
- Expiração de token controlada por variável de ambiente
- CORS restrito aos domínios permitidos
- Sem exposição de segredo no frontend
- Logs sem dados sensíveis

---

## Deploy

- Variáveis mínimas:
  - `JWT_SECRET`
  - `JWT_ISSUER`
  - `JWT_AUDIENCE`
  - `JWT_EXPIRATION_MINUTES`
- Seed do usuário admin executado apenas em ambiente controlado

---

## Critérios de Aceitação

- [ ] Login admin funciona com credenciais válidas
- [ ] Sessão inválida/bloqueada retorna 401
- [ ] Rotas admin do frontend exigem autenticação
- [ ] Interceptor trata 401 de forma consistente
- [ ] Fluxo de logout remove acesso protegido
- [ ] Menu admin permite navegar entre todos os CRUds da área administrativa

---

## Dependências

- **Feature 03** — Foundation backend Node.js + Prisma + Supabase
