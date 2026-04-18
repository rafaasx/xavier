# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## 1. INFORMAÇÕES GERAIS

**Produto:** Landing Page Pessoal + Loja de Afiliados
**Owner:** Rafael Xavier
**Versão:** 2.0
**Stack definida:**

* Frontend: Angular (última versão)
* Backend: .NET Core 10 (Web API) Minimal API
* Banco: PostgreSQL
* Arquitetura: Modular Monolith + Vertical Slice

## 1.1 Definição

Quero desenvolver uma landing page pessoal que funcione como um hub central da minha presença digital, reunindo meu portfólio profissional, minha atuação como criador de conteúdo e minha evolução como video maker, além de permitir a monetização por meio de recomendações de produtos com links de afiliados. A aplicação deve apresentar de forma clara e profissional minha experiência como engenheiro de software, destacando tecnologias como .NET, Angular, Vue e React, assim como minha produção de conteúdo para plataformas como YouTube e Instagram e minha nova atuação como video maker, ainda em fase inicial, mas com potencial de crescimento.

A página deve conter uma seção “Sobre mim” com uma biografia bem construída, além de uma área de experiências organizada por essas três frentes principais. Também deve incluir uma galeria com fotos e vídeos autorais, reforçando tanto o lado técnico quanto o criativo, e uma seção com links para minhas redes sociais. O design deve seguir uma linha moderna e minimalista, com foco em clareza, boa hierarquia visual e experiência do usuário.

Além da landing page, a aplicação deve possuir uma seção chamada “Loja”, onde serão exibidos produtos que eu recomendo, utilizando links de afiliados. Essa loja deve funcionar como um e-commerce simplificado, com os produtos organizados em um grid contendo imagem, nome e descrição curta. Deve haver uma barra lateral com filtros por categorias (tags), um campo de busca por nome e opções de ordenação. Ao acessar um produto, o usuário deve visualizar uma página detalhada com um carrossel de imagens e vídeos — suportando formatos 16:9 e 9:16 —, uma descrição completa e múltiplos links de afiliados que podem direcionar para diferentes plataformas como Amazon, Mercado Livre, AliExpress, Shopee, entre outras.

Os conteúdos em vídeo devem ser tratados de forma inteligente: quando forem links do YouTube ou Instagram, devem ser exibidos como embeds nativos dessas plataformas; quando forem vídeos hospedados em um CDN externo, devem ser reproduzidos diretamente via player HTML5 a partir da URL armazenada.

A aplicação também deve contar com uma área administrativa protegida por autenticação, onde será possível gerenciar os produtos da loja, incluindo cadastro, edição e remoção, bem como o controle de mídias, categorias e links de afiliados. Não será necessário criar um fluxo de cadastro de usuários no frontend, pois o usuário administrador será inserido diretamente no banco de dados, com a senha devidamente protegida por hash.

Além disso, deve existir uma página pública separada da landing principal, no estilo de ferramentas como Linktree ou Hopp, contendo uma versão simplificada com links diretos para minhas redes sociais, para a própria landing page e para a loja, funcionando como um ponto rápido de acesso para compartilhamento.

Do ponto de vista técnico, a aplicação deve ser construída utilizando Angular em sua versão mais recente no frontend, .NET Core 10 no backend e PostgreSQL como banco de dados. A arquitetura deve ser simples e eficiente, evitando abordagens complexas como Clean Architecture, priorizando organização por funcionalidades e facilidade de manutenção. O objetivo é construir um sistema enxuto, escalável e focado em entrega rápida de valor, que possa evoluir gradualmente conforme novas necessidades surgirem.

---

# 2. OBJETIVO DO PRODUTO

## 2.1 Objetivo Principal

Criar uma aplicação web que centralize:

* Portfólio técnico
* Presença como criador de conteúdo
* Evolução como video maker
* Monetização via afiliados

## 2.2 Objetivos Secundários

* Captar leads e oportunidades profissionais
* Criar autoridade digital
* Testar produtos e gerar receita passiva
* Servir como base escalável para futuros produtos digitais

---

# 3. ESCOPO FUNCIONAL

---

# 4. LANDING PAGE

## 4.1 Hero Section

### Conteúdo:

* Nome: Rafael Xavier
* Headline:

  * Engenheiro de Software
  * Criador de Conteúdo
  * Video Maker

### Call to Actions:

* Botão 1 → "Ver Portfólio" (scroll)
* Botão 2 → "Acessar Loja" (/store)

---

## 4.2 Sobre Mim

### Conteúdo:

Texto institucional com:

* Experiência como desenvolvedor (.NET, Angular, Vue, React)
* Produção de conteúdo (YouTube / Instagram)
* Transição para video maker

### Requisitos:

* Deve permitir edição futura via código (não via CMS inicialmente)

---

## 4.3 Experiências

### Estrutura:

3 blocos:

#### Engenharia de Software

* Tecnologias
* Tipo de projetos
* Destaques técnicos

#### Criador de Conteúdo

* Plataformas
* Tipo de conteúdo

#### Video Maker

* Status: em crescimento
* Projetos iniciais

---

## 4.4 Galeria

### Tipos de mídia:

* Imagens
* Vídeos

### Requisitos:

* Grid responsivo
* Lazy loading
* Suporte a:

  * YouTube embed
  * Instagram embed
  * Vídeo via CDN

---

## 4.5 Redes Sociais

Lista com links:

* YouTube
* Instagram
* LinkedIn (opcional)
* GitHub (opcional)

---

# 5. LOJA (STORE)

---

## 5.1 Página de Listagem

### Layout:

* Grid de produtos (3–4 colunas desktop)
* Sidebar de filtros

---

## 5.2 Filtros

### Tipos:

#### Tags (multi-seleção)

* Tech
* Overlanding
* Equipamentos
* Gadgets

#### Busca

* Campo texto (nome do produto)

#### Ordenação

* Mais recentes
* Nome A-Z
* Nome Z-A

---

## 5.3 Produto (Card)

### Conteúdo:

* Imagem principal
* Nome
* Descrição curta

---

## 5.4 Página de Detalhe

### Estrutura:

#### 1. Carrossel de mídia

* Imagens
* Vídeos:

  * YouTube (embed)
  * Instagram (embed)
  * CDN (HTML5 video)

#### 2. Informações

* Nome
* Descrição longa
* Tags

#### 3. Links afiliados

Lista com:

* Plataforma
* Botão "Ver produto"

---

# 6. REGRAS DE MÍDIA (CRÍTICO)

## Tipos:

* IMAGE
* YOUTUBE
* INSTAGRAM
* VIDEO (CDN)

---

## Regras de renderização:

### YOUTUBE

Transformar URL:
watch?v= → embed/

Renderizar com iframe

---

### INSTAGRAM

Renderizar com:

* blockquote.instagram-media
* Script oficial do Instagram

---

### CDN (vídeo externo)

Renderizar com: <video controls src="URL"></video>

---

### RESPONSIVIDADE

* Suportar 16:9 e 9:16

---

# 7. ÁREA ADMINISTRATIVA

---

## 7.1 Autenticação

### Requisitos:

* Login com email + senha
* JWT
* Sem cadastro via frontend

---

## 7.2 Usuário

### Criação:

* Manual no banco
* Senha com hash BCrypt

---

## 7.3 Produtos

### CRUD completo

#### Campos:

* Nome
* Descrição curta
* Descrição longa

---

## 7.4 Mídias

### Requisitos:

* Adicionar múltiplas mídias
* Definir tipo:

  * Image
  * Youtube
  * Instagram
  * Video (CDN)

---

## 7.5 Tags

* Criar
* Associar ao produto

---

## 7.6 Links Afiliados

### Campos:

* Plataforma
* URL

---

# 8. PÁGINA LINKTREE

## Objetivo:

Página pública simples com links

### Conteúdo:

* Foto
* Nome
* Lista de links:

  * YouTube : https://www.youtube.com/@aventurasobrerodasoficial
  * Instagram : https://www.instagram.com/aventurasobrerodasoficial
  * Linkedin : https://www.linkedin.com/in/rafaasx
  * Github: https://github.com/rafaasx
  * Loja
  * Site principal

---

# 9. REQUISITOS FUNCIONAIS

* RF01: Exibir landing page
* RF02: Exibir galeria
* RF03: Listar produtos
* RF04: Filtrar produtos
* RF05: Exibir detalhe do produto
* RF06: Redirecionar para afiliados
* RF07: Autenticar admin
* RF08: CRUD de produtos

---

# 10. REQUISITOS NÃO FUNCIONAIS

* Performance (Lighthouse > 90)
* SEO otimizado
* Responsivo (mobile-first)
* Código modular
* Baixa complexidade

---

# 11. ARQUITETURA

## Backend

* Modular Monolith
* Organização por feature
* Minimal API

## Frontend

* Angular modular
* Lazy loading por feature

---

# 12. ESTRUTURA DE PASTAS

## Frontend

/src/app
/core
/shared
/features
/layout

## Backend

/src
/Api
/Features
/Domain
/Infrastructure

---

# 13. MODELO DE DADOS

## User

Id, Email, PasswordHash

## Product

Id, Name, ShortDescription, LongDescription

## Media

Id, ProductId, Url, Type, AspectRatio

## Tag

Id, Name

## ProductTag

ProductId, TagId

## AffiliateLink

Id, ProductId, Platform, Url

---

# 14. ROADMAP

Fase 1: Landing
Fase 2: Galeria
Fase 3: Loja
Fase 4: Backend/Admin
Fase 5: Otimizações

---

# 15. DIRETRIZES DE DESIGN

* Minimalista
* Tipografia moderna
* Espaçamento amplo
* UX simples
* Animações leves

---

# 16. REGRAS IMPORTANTES

* Evitar overengineering
* Priorizar entrega rápida
* Evolução incremental

---

# 17. CRITÉRIOS DE ACEITAÇÃO

* Landing carregando rápido
* Loja funcional com filtros
* Admin funcional
* Mídias renderizando corretamente
* Links afiliados funcionando

---

# 18. OBSERVAÇÕES FINAIS

Este produto deve ser construído com foco em:

* Velocidade de entrega
* Clareza de código
* Facilidade de expansão

Evitar abstrações desnecessárias.

---
