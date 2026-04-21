# Feature 06 — CRUD Completo de Catálogo (Produtos, Mídias, Tags e Links Afiliados)

## Contexto

Este é o projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier.

**Stack:** Angular (última versão) | Node.js (TypeScript) em Vercel Functions | Supabase PostgreSQL + Prisma + Zod | ngx-mask (frontend)  
**Arquitetura:** Modular Monolith + Vertical Slice

Esta feature cobre o backoffice de catálogo após autenticação já estabelecida na Feature 05.

---

## Objetivo

Entregar uma área administrativa capaz de:

- Criar, editar e remover produtos
- Gerenciar mídias de produto (imagem, vídeo, YouTube, Instagram)
- Ordenar mídias por prioridade de exibição
- Gerenciar tags e associação produto-tag
- Gerenciar links afiliados por produto

---

## Escopo Funcional

1. **Produto**
   - Campos base: `name`, `shortDescription`, `longDescription`
   - CRUD completo
2. **Mídia**
   - Cadastro por produto
   - Edição (`url`, `type`, `aspectRatio`, `order`)
   - Exclusão
   - Reordenação em lote
3. **Tag**
   - Criar/remover tag
   - Associar/desassociar tags ao produto
4. **Link Afiliado**
   - Criar/editar/remover por produto
   - Campos mínimos: `platform`, `url`

---

## Estrutura de Pastas

### Frontend

```text
/src/app/features/admin
  /components/catalog
  /services
  /models
```

### Backend

```text
/api
  /products/index.ts
  /products/[id].ts
  /products/[id]/medias.ts
  /products/[id]/medias/reorder.ts
  /products/[id]/affiliate-links.ts
  /tags/index.ts
  /tags/[id].ts
  /medias/[id].ts
  /affiliate-links/[id].ts
```

---

## Endpoints de Administração (Catálogo)

### Produtos

- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

### Mídias

- `POST /api/products/:id/medias`
- `PUT /api/medias/:id`
- `DELETE /api/medias/:id`
- `PUT /api/products/:id/medias/reorder`

### Tags

- `POST /api/tags`
- `DELETE /api/tags/:id`
- (associação em produto via payload de criação/edição ou endpoint dedicado)

### Links afiliados

- `POST /api/products/:id/affiliate-links`
- `PUT /api/affiliate-links/:id`
- `DELETE /api/affiliate-links/:id`

---

## Contratos de Entrada/Saída (Detalhado)

## 1) Criar produto

`POST /api/products`

### Request (exemplo)

```json
{
  "name": "Barraca de teto X",
  "shortDescription": "Barraca para overlanding",
  "longDescription": "Descrição completa...",
  "tagIds": ["uuid-tag-1", "uuid-tag-2"]
}
```

### Regras

- `name`: obrigatório, mínimo 3 chars, máximo 120
- `shortDescription`: obrigatório, máximo 240
- `longDescription`: obrigatório
- `tagIds`: opcional, sem duplicados

### Response

- `201` com `id` do produto criado
- `400` para validação
- `409` para conflito de regra de negócio

---

## 2) Editar produto

`PUT /api/products/:id`

### Request (exemplo)

```json
{
  "name": "Barraca de teto X Pro",
  "shortDescription": "Versão atualizada",
  "longDescription": "Descrição revisada",
  "tagIds": ["uuid-tag-1"]
}
```

### Regras

- Atualização idempotente por `id`
- Produto inexistente retorna `404`
- Atualização de tags deve sincronizar a relação `ProductTag`

---

## 3) Adicionar mídia

`POST /api/products/:id/medias`

### Request (exemplo)

```json
{
  "url": "https://...",
  "type": "IMAGE",
  "aspectRatio": "RATIO_16_9",
  "order": 0
}
```

### Regras

- `type`: `IMAGE | YOUTUBE | INSTAGRAM | VIDEO`
- `aspectRatio`: `RATIO_16_9 | RATIO_9_16`
- `order`: inteiro >= 0
- URL obrigatória e válida
- Produto alvo deve existir

---

## 4) Reordenar mídias

`PUT /api/products/:id/medias/reorder`

### Request (exemplo)

```json
{
  "items": [
    { "mediaId": "uuid-1", "order": 0 },
    { "mediaId": "uuid-2", "order": 1 }
  ]
}
```

### Regras críticas

1. Operação transacional (tudo ou nada)
2. Não aceitar `mediaId` de outro produto
3. Não aceitar ordem duplicada
4. Garantir sequência consistente para exibição no frontend

---

## 5) Gerenciar tags

- Criar tag com nome único (`POST /api/tags`)
- Remover tag (`DELETE /api/tags/:id`) respeitando regra de associação

### Regras

- Nome normalizado (trim, case-insensitive para unicidade)
- Exclusão com relacionamento ativo:
  - estratégia A: bloquear com `409`
  - estratégia B: desassociar e excluir (deve ser explícito)

---

## 6) Gerenciar links afiliados

### Campos

- `platform` (ex.: Amazon, Mercado Livre)
- `url` (http/https válido)

### Regras

- URL obrigatória e válida
- Produto dono obrigatório
- Evitar duplicidade exata `(productId, platform, url)` quando aplicável

---

## Validações com Zod (obrigatórias)

- Path params (`id`) como UUID
- Payloads de criação/edição com limites claros
- Query params para paginação/listagem interna do admin
- Mensagens de erro padronizadas para consumo do frontend admin

---

## Regras de Negócio e Integridade

1. Toda escrita exige autenticação da Feature 05.
2. Exclusão de produto deve respeitar cascatas (`Media`, `ProductTag`, `AffiliateLink`).
3. Ordem de mídia deve ser sempre determinística.
4. Operações em lote (reorder) com transação Prisma.
5. Logs operacionais sem vazar segredo/token.

---

## UX/Admin (Frontend)

- Lista de produtos com ações rápidas (editar/excluir)
- Formulário com seções:
  - dados básicos
  - tags
  - mídias
  - links afiliados
- Feedback visual:
  - loading
  - sucesso
  - erro por campo
- `ngx-mask` para campos numéricos no padrão PT-BR quando aplicável

---

## Persistência

- Prisma como camada de acesso
- Supabase PostgreSQL como banco
- Migrations versionadas em `backend/prisma/migrations`
- Seeds apenas para dados controlados (não para conteúdo produtivo contínuo)

---

## Deploy

- API no mesmo projeto Vercel do frontend
- Rewrites SPA não podem interceptar `/api/*`
- Variáveis:
  - `DATABASE_URL`
  - `DIRECT_URL`
  - `JWT_SECRET` (para proteção de escrita)

---

## Critérios de Aceitação

- [ ] CRUD de produtos funciona ponta a ponta
- [ ] Gestão de mídias inclui criação, edição, remoção e reorder
- [ ] Gestão de tags funciona com regra de unicidade
- [ ] Gestão de links afiliados funciona com validação de URL
- [ ] Endpoints de escrita retornam 401 sem autenticação
- [ ] Contratos estáveis para integração com frontend admin
- [ ] Dados persistidos corretamente no Supabase via Prisma

---

## Dependências

- **Feature 03** — Foundation backend Node.js + Prisma + Supabase
- **Feature 04** — Contratos públicos de produto/tags
- **Feature 05** — Autenticação admin e rotas protegidas
