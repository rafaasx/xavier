# Feature 01.5 — Publicação e Validação do MVP

## Contexto

Este projeto é a **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular 17 | Node.js (TypeScript) em Vercel Functions | Supabase PostgreSQL + Prisma  
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature prepara o frontend atual para ser publicado em um serviço gratuito, para que o MVP possa ser testado e validado fora do ambiente local. O foco é publicar a aplicação estática com rotas SPA funcionando corretamente.

---

## Objetivo

Colocar a aplicação em produção gratuita com:

- URL pública para validação do MVP
- Navegação Angular funcionando em produção
- Refresh direto em rotas internas sem erro 404
- Fluxo simples de deploy/redeploy
- Base pronta para testes com usuários reais

---

## Escopo

### Inclui

- Publicação do frontend Angular atual
- Configuração de deploy para ambiente gratuito
- Fallback de rotas para SPA
- Validação de build e preview em produção
- Registro do caminho de acesso ao MVP

### Não inclui

- Backend Node.js
- Banco de dados
- Autenticação
- Uploads
- Feature 02 (Galeria) e demais features futuras

---

## Estrutura de Entrega

### Frontend

```text
/frontend
  /src
    /app
      app.routes.ts
      app.config.ts
      features/
      layout/
      core/
  angular.json
  package.json
```

### Publicação

```text
Configuração do host gratuito
Regras de fallback para SPA
Pipeline simples de deploy
URL pública de validação
```

---

## Tarefas

### 1. Definir o host gratuito

Escolher a plataforma de publicação gratuita mais adequada para a SPA:

- Vercel
- Netlify
- Cloudflare Pages
- GitHub Pages, se o fluxo aceitar bem subpath e fallback

Critérios da escolha:

- suporte a SPA
- fallback para rotas internas
- facilidade de deploy
- preview de produção

### 2. Preparar o build para publicação

- Garantir que `npm run build` gere o artefato final corretamente
- Validar o `outputPath` do Angular
- Confirmar que o bundle final cabe no limite gratuito do host
- Ajustar `baseHref` ou caminho base se o host exigir subdiretório

### 3. Configurar fallback de rotas SPA

As rotas da aplicação precisam continuar funcionando em acesso direto:

- `/`
- `/links`
- `/store`
- `/admin`

Se o host responder 404 em refresh, configurar rewrite para `index.html`.

### 4. Preparar configuração de deploy

Adicionar a configuração necessária para o host escolhido:

- arquivo de redirect/rewrite
- configuração de build
- integração com repositório Git
- variáveis de ambiente, se forem necessárias no futuro

### 5. Publicar o MVP

- Fazer o primeiro deploy
- Validar a URL pública
- Registrar o endereço final de acesso

### 6. Validar a experiência publicada

- Abrir a landing
- Navegar para `/links`
- Testar recarregamento direto das rotas
- Validar layout responsivo em mobile e desktop
- Verificar se não há quebra visual ou erro de rota

---

## Critérios de Aceitação

- [ ] Existe uma URL pública gratuita funcionando
- [ ] A aplicação carrega corretamente em produção
- [ ] As rotas internas não quebram no refresh
- [ ] O build de produção termina sem erros
- [ ] O deploy pode ser repetido de forma simples
- [ ] A landing e o linktree estão acessíveis publicamente
- [ ] A navegação continua estável em mobile e desktop

---

## Dependências

- **Feature 00 (Foundation)** — estrutura base do frontend
- **Feature 01 (Landing + Linktree)** — páginas principais do MVP

---

## Observações

- Esta feature existe para permitir teste real do MVP o quanto antes.
- O ponto mais importante é o suporte a SPA no host gratuito.
- O host escolhido para este setup foi Vercel, com fallback de rotas via `vercel.json`.
- A rota pública canônica do linktree passou a ser `/links`, com `/linktree` redirecionando para ela.
- O backend futuro também seguirá na Vercel (`/api/*`) para manter a mesma infraestrutura.
- Se o host escolhido mudar, a configuração de deploy pode ser ajustada sem alterar a aplicação principal.
