# CLAUDE.md — PagouMorou

Guia de contexto para o Claude Code trabalhar neste repositório.

---

## 1. Objetivo do projeto

**PagouMorou** é um marketplace brasileiro dedicado **exclusivamente à locação residencial**.

> Slogan: **"Alugou. Pagou. Morou."**

A proposta é permitir que o usuário:

- **descubra** apartamentos e casas para alugar;
- **negocie diretamente com o proprietário**, sem intermediário/imobiliária;
- **assine contrato digitalmente**;
- **alugue sem burocracia** (sem fiador, com score de confiança substituindo a análise tradicional).

Este projeto **não é uma landing page** e não deve ganhar seções de marketing genéricas. É uma aplicação de produto: shell, design system, rotas e componentes reutilizáveis prontos para produção. A referência de qualidade visual e de interação é o **Airbnb**.

Idioma do produto: **português do Brasil** (`<html lang="pt-BR">`). Textos de UI, rotas e conteúdo são em pt-BR — inclusive as mensagens de erro levantadas pelas funções do Postgres, que chegam direto no toast. Comentários e nomes de código são majoritariamente em inglês, com alguns em pt-BR — siga o padrão do arquivo que estiver editando.

---

## 2. Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | **TanStack Start** (`@tanstack/react-start`) + **TanStack Router** (file-based) |
| UI | **React 19** + **TypeScript** (strict) |
| Build | **Vite 8** via `@lovable.dev/vite-tanstack-config` |
| Estilos | **TailwindCSS v4** (CSS-first, `@theme` em `src/styles.css`) |
| Componentes | **shadcn/ui** (estilo `new-york`) sobre **Radix UI** |
| Animação | **Framer Motion** |
| Ícones | **Lucide** (somente outline) |
| Estado global | **Zustand** (+ `persist` em localStorage) |
| Data fetching | **TanStack Query** |
| Formulários | **React Hook Form** + **Zod** |
| Toasts | **Sonner** |
| Runtime/SSR | **Nitro** (target padrão Cloudflare) |
| Backend | **Supabase** (Postgres + Auth + Storage + RLS), projeto `pagoumorou` |
| Agentes | **MCP** via `@lovable.dev/mcp-js` |
| Gerenciador | **Bun** (`bun.lock`, `bunfig.toml`) — `npm` também funciona |

### Variáveis de ambiente

`.env.example` lista o mínimo para rodar: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`. Ambas são públicas por natureza (a anon key vive atrás da RLS). Chave `service_role`, se algum dia entrar, **não pode levar prefixo `VITE_`** — o Vite inlina isso no bundle do browser.

O projeto é sincronizado com o **Lovable** (ver `AGENTS.md`): **não reescreva histórico git publicado** (sem force-push, rebase ou squash de commits já enviados) e mantenha a branch sempre em estado funcional.

### Comandos

```sh
bun install        # ou npm i
bun run dev        # vite dev
bun run build      # vite build
bun run preview
bun run lint       # eslint .
bun run format     # prettier --write .
```

`bunfig.toml` define `minimumReleaseAge = 86400` (guard de supply chain de 24h). Não adicione exceções em `minimumReleaseAgeExcludes` sem confirmar com o usuário.

---

## 3. Estrutura de pastas

```
src/
  routes/            # file-based routing (TanStack). routeTree.gen.ts é gerado — não editar
  components/
    ui/              # shadcn/ui primitives (button, card, dialog, input…)
    cards/           # PropertyCard, InfoCard, StatsCard, SimpleCard, SkeletonCard
    forms/           # Field, SearchInput, PasswordInput
    layout/          # AppShell, Container, Page
    navigation/      # AppHeader, BottomNav, SideNav
    sections/        # HeroSection, FaqSection
    feedback/        # EmptyState
    loading/         # BrandLoader (splash + loader de marca)
    shared/          # Logo
  config/            # navigation.ts (itens de navegação primária)
  contexts/          # theme-context.tsx (light/dark)
  hooks/             # dados (Supabase + TanStack Query) e hooks de UI
  lib/               # supabase/, api/, server-fns/, queries/, auth/, storage/, mcp/, utils, motion, score
  types/             # index.ts (domínio) + database.ts (linhas do Postgres, gerado)
  utils/             # format.ts (moeda, data)
  docs/              # telas_referencia.md — descrição tela a tela
  styles.css         # DESIGN SYSTEM (tokens Tailwind v4)
```

Alias: `@/` → `src/` (via `vite-tsconfig-paths`).

### Regras de arquitetura

- **Rotas**: um arquivo `.tsx` em `src/routes/` = uma rota. Não criar `src/pages/`, `app/layout.tsx` nem convenções de Next/Remix. Único layout raiz: `src/routes/__root.tsx` (preservar `<Outlet />`). Parâmetro dinâmico usa `$` puro: `apartamento.$id.tsx` → `/apartamento/:id`. Detalhes em `src/routes/README.md`.
- **Reuso acima de tudo**: nada de componente duplicado. Antes de criar, procurar em `components/ui`, `components/cards` e `components/forms`.
- **Sem estilos inline** e sem cores hard-coded — use tokens do design system (classes Tailwind semânticas).
- **TypeScript strict**: sem `any` implícito; modelos de domínio ficam em `src/types/index.ts`.
- `routeTree.gen.ts` e `src/routes/mcp.ts` são **gerados**; não editar à mão.

---

## 4. Design System

Toda a definição vive em **`src/styles.css`** (Tailwind v4, CSS-first). Não há `tailwind.config.js`.

### 4.1 Cores (paleta institucional)

Valores em `:root` (light) e `.dark`, expostos como utilitários via `@theme inline`.

| Token | Light | Dark | Uso |
| --- | --- | --- | --- |
| `--primary` | `#0F9B4D` | `#0F9B4D` | verde institucional, CTA |
| `--primary-hover` | `#11A84F` | `#11A84F` | hover do CTA |
| `--primary-escuro` | `#087A3B` | `#087A3B` | pressionado / texto sobre soft |
| `--primary-soft` / `--primary-claro` | `#EAF8F0` | `#1B2537` | fundo suave de destaque |
| `--secondary` | `#0C1B36` (navy) | `#FFFFFF` | contraste institucional |
| `--accent` | `#FFC800` | `#FFC800` | amarelo de ênfase |
| `--background` | `#FFFFFF` | `#101828` | fundo da página |
| `--surface` | `oklch(0.984…)` | `#1B2537` | superfície elevada |
| `--surface-secondary` | `oklch(0.968…)` | `#242F41` | superfície secundária |
| `--foreground` / `--text-primary` | `#101828` | `#FFFFFF` | texto principal |
| `--text-secondary` / `--muted-foreground` | `#667085` | `#98A2B3` | texto secundário |
| `--border` / `--input` | `#D9DEE7` | `rgba(255,255,255,.1)` | bordas |
| `--success` | `#0F9B4D` | `#12B76A` | estado positivo |
| `--warning` | `#FFC800` | `#FEC84B` | atenção |
| `--danger` / `--destructive` | `#D92D20` | `#F04438` | erro / destrutivo |
| `--info` | `#0C1B36` | `#2E90FA` | informativo |
| `--ring` | `#0F9B4D` | `#0F9B4D` | foco |

Existem ainda tokens de `chart-1..5` e um bloco completo de `sidebar-*`.

**Para adicionar uma cor semântica:** (1) declarar a variável em `:root` e em `.dark`; (2) registrá-la em `@theme inline` como `--color-<nome>: var(--<nome>)`. Só então ela vira `bg-<nome>` / `text-<nome>`.

Consuma sempre pela classe semântica (`bg-primary`, `text-text-secondary`, `border-border`) — nunca hex direto no JSX.

### 4.2 Tipografia

Fonte carregada em `__root.tsx`: **Geist** (400–700) + **Dancing Script** (assinatura/branding). `--font-sans` e `--font-display` atualmente declaram `"Inter"` como primeira família em `styles.css`, enquanto o `<link>` carrega Geist — divergência conhecida; ao mexer em tipografia, alinhe os dois em vez de introduzir uma terceira fonte.

Tokens utilitários (`@utility` em `styles.css`), use-os em vez de combinar `text-*`/`font-*` soltos:

| Classe | Tamanho | Peso | Observação |
| --- | --- | --- | --- |
| `text-display` | 2.5rem → 3.25rem (md) | 700 | tracking `-0.03em` |
| `text-heading` | 1.75rem → 2rem (md) | 650 | tracking `-0.02em` |
| `text-title` | 1.125rem | 600 | |
| `text-body` | 0.9375rem | 400 | line-height 1.6 |
| `text-caption` | 0.8125rem | 400 | |
| `text-label` | 0.8125rem | 550 | |
| `text-button` | 0.9375rem | 600 | |

### 4.3 Raios

`--radius-xs 4` · `sm 8` · `md 12` · `lg 16` · `xl 20` · `2xl 24` · `3xl 24` · `4xl 32`.

Aliases semânticos: **card = 24px** (`rounded-card`), **botão = 16px** (`rounded-button`), **input = 18px** (`rounded-input`). Visual muito arredondado é intencional.

### 4.4 Sombras (elevação)

`--shadow-xs` → `--shadow-xl`, todas em `oklch(0 0 0 / .05–.1)`. Sombras **muito suaves**, inspiradas no Airbnb. Nada de sombra dura.

### 4.5 Espaçamento

Escala fixa: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96` (`--spacing-1` … `--spacing-24`). Layout com respiro generoso e largura máxima `--container-app: 1440px`, centralizado.

### 4.6 Breakpoints (mobile-first)

`xs 375` · `sm 430` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1440`.

### 4.7 Motion

Presets reutilizáveis em **`src/lib/motion.ts`** — use-os em vez de escrever variants ad-hoc:

- `fade`, `slideUp`, `slideLeft`, `stagger` / `staggerChildren(delay)`, `item`
- `hoverLift` (y: -3, tap scale .99), `imageZoom` (scale 1.06), `pageTransition`
- Durações: `fast .2s` · `base .25s` · `slow .3s`; easing `easeOut = [0.22, 1, 0.36, 1]`

Há também a utility CSS `hover-lift` para elevação sem JS.

### 4.8 Tema

`ThemeProvider` (`src/contexts/theme-context.tsx`) alterna a classe `.dark` no `<html>` e persiste em `localStorage` (`pagoumorou.theme`). **Light é o padrão do produto**; a arquitetura dark já está completa — toda cor nova precisa de valor nos dois modos.

### 4.9 Acessibilidade

HTML semântico, navegação por teclado, ARIA nos componentes Radix, `:focus-visible` global com outline de 2px em `--ring`, contraste adequado. Ícones decorativos precisam de `aria-hidden`; imagens precisam de `alt` descritivo (padrão já seguido nas rotas).

---

## 5. Funcionalidades

### 5.1 App shell

`AppShell` (`components/layout/app-shell.tsx`) envolve todas as páginas:

- **AppHeader** — sticky com blur: logo, busca central (desktop), notificações, perfil.
- **BottomNav** — navegação mobile estilo app (Início, Buscar, Favoritos, Mensagens, Perfil), definida em `src/config/navigation.ts`.
- **SideNav** — arquitetura de sidebar pronta.
- **BrandLoader** — splash de marca de 3s no boot + loader de rota; `SkeletonCardGrid` como fallback de Suspense.
- **Toaster** (Sonner) global; error boundary e 404 definidos em `__root.tsx`, com report de erros para o Lovable.

### 5.2 Rotas

| Rota | Arquivo | O que faz |
| --- | --- | --- |
| `/` | `index.tsx` | Home: hero "Alugou. Pagou. Morou.", bairros em bento grid, categorias, "Como funciona", destaques, FAQ |
| `/buscar` | `buscar.tsx` | Busca server-side via `search_apartments`: texto full-text, chips por `property_type`, ordenação e "carregar mais". Sem filtro, mostra três vitrines curadas (avaliados / metrô / recentes) |
| `/apartamento/$id` | `apartamento.$id.tsx` | Detalhe do imóvel: galeria, atributos, descrição, sidebar com aluguel + condomínio + IPTU + total, "Quero alugar" (proposta real), chat com o dono e cartão do proprietário |
| `/favoritos` | `favoritos.tsx` | Grid dos imóveis favoritados. **Protegida** |
| `/mensagens` | `mensagens.tsx` | Chat real: lista de conversas, thread, envio e marcação de lidas. **Protegida** |
| `/perfil` | `perfil.tsx` | Painel: avatar (upload no Storage), KYC, score, stats, abas **Meus Anúncios** e **Propostas** (aprovar/recusar). **Protegida** |
| `/perfil/agentes` | `perfil.agentes.tsx` | Integrações MCP: status do conector e chaves por cliente. **Protegida** |
| `/configuracoes` | `configuracoes.tsx` | Edição de nome e telefone. E-mail e papel são somente leitura |
| `/anunciar` | `anunciar.tsx` | Wizard de 4 passos (React Hook Form + Zod, validação por passo) que publica o imóvel e sobe as fotos. **Protegida** |
| `/entrar` | `entrar.tsx` | Login com Supabase Auth (senha + Google OAuth) |
| `/cadastro` | `cadastro.tsx` | Cadastro com escolha de papel (**Inquilino**/**Proprietário**), que vai no metadata e vira o `role` do profile |
| `/mcp`, `/.mcp/*`, `/.well-known/*` | gerados | Endpoints do servidor MCP |
| 404 | `__root.tsx` | `notFoundComponent` |

`src/docs/telas_referencia.md` descreve cada tela em detalhe (útil como referência de mockup antes de alterar layout).

### 5.3 Estado

Não há mais store global de dados: **sessão e escritas moram no Postgres**, e o cache é do TanStack Query. Zustand permanece como dependência, mas nenhum hook de domínio o usa.

| Hook | Fonte | Responsabilidade |
| --- | --- | --- |
| `useAuth` | Supabase Auth + `profiles` | `user` (modelo `User`), `isAuthenticated`, `isLoading`, `signIn/signUp/signOut/updateProfile` |
| `useAuthListener` | `onAuthStateChange` | sincroniza o cache de perfil; montado uma vez em `__root.tsx` |
| `useRequireAuth` | — | guarda de rota privada (espera `isLoading` antes de redirecionar) |
| `useFavorites` | tabela `favorites` | toggle otimista + consulta |
| `useConversations` / `useConversationMessages` / `useSendMessage` / `useStartConversation` | `conversations`, `messages` | chat real entre inquilino e proprietário |
| `useProposals` | `list_proposals` / `send_proposal` / `respond_proposal` | propostas recebidas e enviadas |
| `useNotifications` | tabela `notifications` | caixa de notificações (só leitura e marcação; quem grava é o banco) |
| `useCreateApartment` | `create_apartment` + Storage | publica anúncio e sobe as fotos |
| `usePublicProfile` | `public_profiles` | dados públicos do proprietário |

Auxiliares: `use-mobile`, `use-in-view-animation`, `use-debounced-value`.

**Regra de ouro:** o cliente do browser (`src/lib/supabase/browser.ts`) carrega o JWT da sessão, então **a RLS é a autorização real** — nunca confie em checagem só na UI. Leitura pública de catálogo continua no servidor (`src/lib/supabase/server.ts`, role anon) para preservar o SSR.

### 5.4 Score de confiança (`src/lib/score.ts`)

Diferencial do produto — substitui fiador por reputação. Escala **0–1000**.

- `calculateTenantScore(user)` — base 850; penaliza perfil/documentos incompletos, KYC pendente, quebra de contrato, atrasos de pagamento e lentidão de resposta; bonifica avaliações positivas e KYC verificado.
- `calculateOwnerScore(owner, properties)` — base 700; avalia qualidade dos anúncios (nº de fotos, descrição com localização/POI/cômodos/mobília), tempo de resposta, verificação e média de avaliações.
- `getScoreColor` / `getScoreLabel` — faixas: ≥800 Excelente · ≥600 Bom · ≥400 Regular · <400 Baixo.

### 5.5 Servidor MCP (agentes de IA)

`src/lib/mcp/index.ts` publica o servidor **`pagoumorou`** em `/mcp`, expondo **apenas dados públicos do catálogo** (sem contatos):

- `search_properties` — filtros por texto, cidade, bairro, faixa de aluguel, dormitórios, mobília;
- `get_property` — detalhes completos por id;
- `list_neighborhoods` — bairros atendidos, aluguel médio e disponibilidade.

As rotas em `src/routes/mcp.ts` e `src/routes/[.mcp]/*` são geradas pelo plugin Vite — não editar. Ao criar uma tool nova, adicione o arquivo em `src/lib/mcp/tools/` e registre no array `tools`, mantendo a serialização compacta e sem PII.

### 5.6 Dados

Tudo vem do **Supabase** (projeto `pagoumorou`, `sa-east-1`). Não há mais mock: `src/mock/` foi removido.

Modelos de domínio em `src/types/index.ts` (`Apartment`, `Neighborhood`, `User`, `Review`, `Message`, `Conversation`, `AppNotification`, `SearchFilters`); as linhas cruas do Postgres em `src/types/database.ts` (gerado — regerar com o MCP do Supabase, nunca editar à mão salvo para acompanhar uma migration).

**Camadas**

```
src/lib/supabase/   server.ts (anon, SSR) · browser.ts (sessão) · buckets.ts
src/lib/api/        consultas puras que recebem um client (server-only)
src/lib/server-fns/ createServerFn — entrada do SSR
src/lib/queries/    queryOptions do TanStack Query
src/lib/auth/       mapeamento de profile e tradução de erros do GoTrue
src/lib/storage/    uploads (avatar e fotos de anúncio)
```

`src/lib/api/mappers.ts` é **server-only** (monta URL do Storage a partir de `env.server`). Para mapear perfil no browser existe `src/lib/auth/profile.ts`.

**Tabelas:** `profiles`, `neighborhoods`, `apartments`, `apartment_images`, `reviews`, `favorites`, `conversations`, `messages`, `proposals`, `notifications`. Todas com RLS.

**Funções de negócio (SECURITY DEFINER).** Escritas que tocam mais de um dono não podem sair do cliente — notificar alguém é gravar na caixa da outra pessoa. Por isso passam por RPC:

| Função | Papel |
| --- | --- |
| `search_apartments` | busca full-text pt-BR + filtros, ordenação e paginação |
| `start_conversation` / `send_message` | abre thread (idempotente) e envia mensagem, notificando o outro lado |
| `send_proposal` / `respond_proposal` | valida as regras da proposta e notifica |
| `list_conversations` / `list_proposals` | resumo pronto para a UI, sem N+1 |
| `create_apartment` | resolve bairro, gera slug único e promove o perfil a `owner` |
| `public_profiles` | únicos campos de `profiles` que saem para terceiros |
| `request_verification` | põe o KYC na fila; quem aprova é o backoffice |

Ao criar função nova: `revoke execute ... from public` **e** de `anon`/`authenticated` conforme o caso — o Supabase concede EXECUTE por default privilege, e revogar só de `public` não basta. Funções de gatilho não devem ficar acessíveis pelo PostgREST.

**Storage:** buckets públicos `apartment-photos` e `avatars`. A política de escrita exige que o primeiro nível do caminho seja o id do profile (`{profileId}/...`).

Ao introduzir dado novo: migration primeiro, depois regerar `database.ts`, depois o tipo de domínio em `src/types` e o mapper.

---

## 6. Convenções ao editar

1. **Tokens sempre** — cor, raio, sombra, espaçamento e tipografia saem de `styles.css`; nada de valor mágico no JSX.
2. **Componha, não duplique** — reaproveite `ui/`, `cards/`, `forms/`, `layout/`.
3. **Animação via `lib/motion.ts`**, respeitando 200–300ms.
4. **Ícones Lucide outline**, tamanho via `size-*`.
5. **Mobile-first**: valide 375px e 1440px.
6. **Textos de UI em pt-BR**; cada rota define seu bloco `head` com `title` e `description` (SEO/OG) — siga o padrão ao criar rotas.
7. **Formulários** com React Hook Form + Zod, via `components/ui/form.tsx` e `forms/field.tsx`.
8. **Feedback ao usuário** com Sonner (`toast`) e `EmptyState` para listas vazias.
9. **Rota privada** usa `useRequireAuth()` e espera `isLoading` antes de redirecionar — a sessão só é conhecida depois da hidratação.
10. **Autorização é RLS**, não UI. Escrita que toca dado de outra pessoa vira função `SECURITY DEFINER`, não política permissiva.
11. Rodar `bun run lint` e `bun run format` antes de commitar (Prettier + ESLint com `eslint-plugin-prettier`). O repositório tem dívida de formatação anterior em arquivos não tocados — formate só o que você mexeu, para não inflar o diff.
12. Não tocar em arquivos gerados: `routeTree.gen.ts`, `src/routes/mcp.ts`, `src/routes/[.mcp]/*`, `src/routes/[.well-known]/*`.
