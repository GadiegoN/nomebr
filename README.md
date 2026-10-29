# Nome Raro — Consulta Oficial à Frequência de Nomes Brasileiros (IBGE)

Plataforma web profissional em português brasileiro para consulta, análise histórica e visualização de raridade de nomes no Brasil com base nas estatísticas oficiais do **Instituto Brasileiro de Geografia e Estatística (IBGE)**.

---

## 1. Visão Geral e Objetivo

O **Nome Raro** transforma consultas frias a dados estatísticos demográficos em uma experiência pessoal, informativa, visualmente envolvente e compartilhável.

### Funcionalidades Principais
- **Consulta em Tempo Real:** Pesquisa qualquer primeiro nome (prenome) com normalização automática de acentos e caracteres.
- **Sistema de 10 Temas Personalizados:** Seletor visual na barra de navegação com temas temáticos por décadas (Anos 80 Synthwave, Anos 90 Teal, Anos 2000 Frutiger Aero), Modo Noturno (Dark), Brasilidade Oficial, Arquivo Histórico (Sépia), Cyberpunk 2077, Pastel Nórdico e Espresso, com persistência automática no `localStorage`.
- **Classificação Estatística de Raridade:** Escala metodológica dividida em 6 faixas (Ultra Raro, Raro, Incomum, Moderado, Tradicional/Comum e Hiperpopular) sobre o universo de 190,7 milhões de brasileiros recenseados.
- **Evolução Histórica por Décadas:** Gráfico comparativo de registros por década de nascimento (desde antes de 1930 até os anos 2000), apontando o auge de popularidade do nome.
- **Distribuição Geográfica por Estados (UFs):** Concentração absoluta e taxa proporcional por 100 mil habitantes em cada um dos estados brasileiros, com **mapa cartográfico interativo (React-Leaflet + malha oficial GeoJSON do IBGE)** e alternância para visualização tabular detalhada.
- **Comparador Demográfico:** Comparação direta lado a lado entre dois nomes (ex: *Lucas* vs *Gabriel*), calculando a diferença absoluta e a razão proporcional.
- **Compartilhamento Nativo e Cartão Visual:**
  - Suporte à Web Share API e cópia instantânea de link.
  - Links sociais diretos (WhatsApp, X/Twitter, Facebook).
  - Gerador de cartões visuais renderizados no cliente via HTML5 Canvas em formatos **Stories (9:16)** e **Feed (1200x630)** para download em PNG de alta definição, **sem envio de dados para servidores**.
- **SEO e Indexação Orgânica:** Rotas amigáveis `/nome/[slug]`, geração estática dos principais nomes (SSG), Open Graph, Twitter Cards, Sitemap XML, Robots.txt e dados estruturados Schema.org (`Dataset`).

---

## 2. Conformidade Arquitetural (Sem Backend Próprio)

Conforme os requisitos do projeto, a plataforma não utiliza backend intermediário, banco de dados ou autenticação:
- **Zero Rotas de API próprias:** Todas as consultas são realizadas diretamente contra a API pública do IBGE via `fetch` autenticado pelo CORS aberto da instituição (`access-control-allow-origin: *`).
- **Zero Bancos de Dados:** Não requer Prisma, Supabase, Postgres ou SQLite.
- **Server & Client Components Híbridos:** Páginas principais e SEO renderizadas como Server Components; interatividade (busca, canvas, compartilhamento) isolada em Client Components enxutos.
- **Compatível com Deploy Estático e Serverless:** Pode ser publicada em plataformas estáticas (Vercel, Netlify, Cloudflare Pages, GitHub Pages) ou containers Node.js.

---

## 3. Investigação e Validação Técnica da API do IBGE

A camada de serviços consome a API oficial v2 de Nomes do IBGE:
- **Documentação Oficial:** [https://servicodados.ibge.gov.br/api/docs/nomes?versao=2](https://servicodados.ibge.gov.br/api/docs/nomes?versao=2)
- **URL Base:** `https://servicodados.ibge.gov.br/api/v2/censos/nomes/`

### Endpoints Utilizados:
1. `GET /api/v2/censos/nomes/{nome}`: Frequência histórica nacional distribuída por períodos de nascimento.
2. `GET /api/v2/censos/nomes/{nome}?groupBy=UF`: Ocorrências, população censitária e taxa por 100 mil habitantes nas 27 UFs do Brasil.
3. `GET /api/v2/censos/nomes/ranking?qtd=20`: Ranking nacional dos nomes mais registrados da história do país.

### Limitações Oficiais e Metodologia IBGE:
- **Sigilo Estatístico:** Por determinação da Lei Federal nº 5.534/1968, o IBGE só divulga nomes com **pelo menos 20 ocorrências** em território nacional. Nomes com frequência inferior retornam array vazio `[]` e são informados ao usuário com transparência.
- **Prenomes Isolados:** O IBGE registra apenas o primeiro nome de cada informante. Nomes compostos (ex: *Maria Clara*) são contabilizados em seus prenomes isolados (*Maria*).
- **Ano de Referência:** Levantamento censitário demográfico (Série Histórica abrangendo nascidos até 2010 com 190.755.799 de habitantes). Os números refletem pessoas registradas no censo, e não a totalidade exata de pessoas vivas hoje.

---

## 4. Identidade Visual (Web de 2015)

O design foi concebido com a estética clássica das landing pages de produtos de 2015:
- Hero amplo no estilo *Jumbotron* com contraste expressivo em tons Navy/Azul Royal e detalhes em Âmbar.
- Botões grandes, sólidos e de clique evidente (`.btn-2015-primary`, `.btn-2015-secondary`, `.btn-2015-success`).
- Cartões com bordas discretas, relevo sutil e cantos de 4px a 6px.
- Ícones em SVG desenhados à mão (sem uso de emojis como substitutos de ícones).
- Seções bem delimitadas e alternadas com espaçamento generoso e tipografia hierárquica.

---

## 5. Estrutura do Código

```
src/
├── app/
│   ├── globals.css                # Design tokens no Tailwind CSS v4 (@theme)
│   ├── layout.tsx                 # Metadados globais, viewport, Schema.org
│   ├── page.tsx                   # Server Component da raiz (com suporte a ?nome=)
│   ├── not-found.tsx              # Estado visual amigável 404
│   ├── robots.ts                  # Configuração de indexação para robôs
│   ├── sitemap.ts                 # Mapa do site XML para motores de busca
│   └── nome/[slug]/page.tsx       # Páginas estáticas SSG para SEO de nomes populares
├── components/
│   ├── header/Header.tsx          # Cabeçalho fixo com navegação e menu mobile
│   ├── hero/HeroSection.tsx       # Jumbotron de apresentação e formulário principal
│   ├── search/                    # Formulário de busca acessível, validação e estados
│   ├── results/                   # Cabeçalho do nome, indicador de raridade, gráficos e UFs
│   ├── compare/NameComparison.tsx # Módulo de duelo estatístico entre dois nomes
│   ├── share/                     # Web Share, cópia de link e download de imagem Canvas
│   ├── landing/                   # HowItWorks, PopularNamesShowcase, DataSource, FAQ, CTA
│   └── ui/                        # Ícones SVG, Badges, Alertas, Spinner e Card
├── config/
│   ├── brand.ts                   # Centralização de nome, slogan, links e autoria
│   └── brazilUFs.ts               # Tabela oficial com códigos IBGE e siglas das 27 UFs
├── services/
│   └── ibgeApi.ts                 # Camada de comunicação com a API do IBGE e cache em memória
├── types/
│   ├── ibge.ts                    # Contratos de resposta da API do IBGE
│   └── rarity.ts                  # Modelos de raridade, ranking e comparação
└── utils/
    ├── normalization.ts           # Limpeza de acentos, trim e extração de prenome
    ├── formatters.ts              # Formatação de números (pt-BR), percentuais e décadas
    ├── rarityCalculator.ts        # Cálculo da régua de raridade e década de auge
    ├── canvasCardGenerator.ts     # Gerador de cartões para Stories e Feed em HTML5 Canvas
    └── tests.test.ts              # Suíte de testes automatizados unitários
```

---

## 6. Comandos para Executar e Testar

### Pré-requisitos
- Node.js v20+ ou v24+
- NPM

### 1. Instalação
```bash
npm install
```

### 2. Executar os Testes Automatizados
```bash
npm test
```
*Executa 10 testes unitários validando normalização de acentos, extração de prenomes, formatação numérica pt-BR, decodificação de períodos, cálculo de raridade, processamento dos dados do IBGE e comparação de nomes.*

### 3. Validação de Tipos e Linter
```bash
npx tsc --noEmit
npm run lint
```

### 4. Executar em Modo de Desenvolvimento
```bash
npm run dev
```
Acesse `http://localhost:3000` no navegador.

### 5. Build de Produção e Execução
```bash
npm run build
npm start
```

---

## 7. Instruções de Publicação (Deploy)

A aplicação pode ser publicada em qualquer provedor moderno:
- **Vercel / Netlify:** Basta conectar o repositório Git. O Next.js detectará automaticamente o App Router e fará o build sem configurações adicionais.
- **Hospedagem Estática (Cloudflare Pages, GitHub Pages):** O produto pode ser exportado estaticamente habilitando `output: 'export'` no `next.config.ts`.
- **Docker / Servidor Próprio:** Execute `npm run build && npm start`. Não há dependência de variáveis de ambiente secretas ou serviços de terceiros pagos.
