# Feature 00 — Foundation Frontend (Setup Angular)

## Contexto

Este é o primeiro passo do projeto **Landing Page Pessoal + Loja de Afiliados** de Rafael Xavier. Esta feature configura apenas o **frontend Angular** como aplicação estática. O backend será configurado em uma feature separada (Feature 03), pois o MVP (Landing, Galeria, Linktree) não requer servidor.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Angular (última versão) |

> Backend (.NET Core 10) e banco (PostgreSQL) serão configurados na Feature 03.

---

## Objetivo

Criar a estrutura inicial do frontend com:

- Projeto Angular configurado e rodando
- Estrutura de pastas organizada por features
- Roteamento base com lazy loading
- Layout base (header + footer + router-outlet)
- Configurações de ambiente preparadas

---

## Estrutura de Pastas

### Frontend (`/frontend`)

```
/src/app
  /core          → serviços globais, interceptors, guards
  /shared        → componentes reutilizáveis, pipes, directives
  /features      → módulos por funcionalidade (lazy loaded)
  /layout        → header, footer, layout principal
```

---

## Tarefas

1. Criar projeto Angular via CLI (`ng new`)
2. Configurar estrutura de pastas (`core/`, `shared/`, `features/`, `layout/`)
3. Configurar roteamento base com lazy loading
4. Instalar dependências iniciais (ex: Angular Material ou lib de UI, se necessário)
5. Configurar environment files (preparar para futura API URL)
6. Criar componente de layout base (header + footer + router-outlet)
7. Configurar rotas iniciais:
   - `/` → Landing (Feature 01)
   - `/links` → Linktree (Feature 01)
   - `/store` → Loja (Feature 04, lazy loaded, placeholder por agora)
   - `/admin` → Admin (Feature 05, lazy loaded, placeholder por agora)

---

## Diretrizes Técnicas

- **Evitar overengineering** — manter simples e direto
- **Código modular** — cada feature isolada em sua pasta
- **Baixa complexidade** — fácil de entender e manter
- **Standalone components** — preferir standalone quando possível (Angular moderno)

---

## Critérios de Aceitação

- [ ] Projeto Angular roda com `ng serve` sem erros
- [ ] Estrutura de pastas segue o padrão definido
- [ ] Roteamento base funciona com lazy loading
- [ ] Layout base (header + footer) renderiza corretamente
- [ ] Build de produção (`ng build`) gera bundle sem erros

---

## Dependências

Nenhuma — esta é a feature base do projeto.

---

## Observações

- Este MVP é **100% frontend estático** — não requer backend
- As features 01 (Landing + Linktree) e 02 (Galeria) usam dados hardcoded
- O backend será introduzido na Feature 03 quando a Loja for implementada
