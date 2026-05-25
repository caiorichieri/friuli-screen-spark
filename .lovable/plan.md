## Visão geral

Cada cliente terá uma página pública em `friulion.it/<slug-do-cliente>` (ex: `friulion.it/palio-di-paluzza`), estilo link-in-bio como no exemplo do Palio di Paluzza. O próprio cliente faz login e edita sua página.

## 1. Banco de dados

**Nova tabela `client_landings`** (relação 1:1 com `clients`):
- `client_id` (FK único para clients)
- `enabled` (bool, default false) — só publica quando ativado
- `cover_image_url` (imagem de fundo)
- `avatar_url` (logo redondo no topo — separado do logo institucional)
- `intro_title`, `intro_text`
- `accent_color` (hex, default laranja como no exemplo)
- `video_url` (YouTube/Vimeo embed)
- `links` (jsonb array: `[{label, url, icon, sort_order}]` — ícones: globe, file, image, map, bus, mail, phone, facebook, instagram, whatsapp)
- `gallery` (jsonb array de URLs de imagem)

**Nova tabela `client_managers`** (quem pode editar qual cliente):
- `client_id` (FK)
- `user_id` (FK auth.users)
- único(client_id, user_id)

**Novo valor no enum `app_role`**: `client` (já existe admin e user).

**Bucket Storage `client-landings`** (público): cover, avatar e gallery; pasta `<client_id>/...`.

**RLS:**
- `client_landings`: admin (tudo); cliente designado via `client_managers` (read/update do próprio); público lê só onde `enabled = true`.
- `client_managers`: só admin gerencia; usuário lê os próprios mapeamentos.
- Storage: admin tudo; cliente upload/delete dentro de `<client_id>/` se for manager daquele client.

## 2. Rotas

**Pública:**
- `src/routes/$slug.tsx` — renderiza a landing pelo slug. Lista de slugs **reservados** (chi-siamo, circuito, servizi, portfolio, clienti, contatti, privacy, cookies, login, forgot-password, reset-password, admin, api, sitemap.xml, robots.txt, llms.txt) → retorna `notFound()`. Inclui SEO (title, description, og:image = cover).

**Cliente (logged-in):**
- `src/routes/_authenticated/dashboard.tsx` — se o usuário tem role `client`, lista os clientes que ele pode editar e botão "Editar landing page".
- `src/routes/_authenticated/landing.$clientId.tsx` — editor: cover, avatar, título, texto, cor de destaque, vídeo, lista de links (drag-to-reorder), galeria. Botão "Publicar/Despublicar". Preview com link `/<slug>`.

**Admin:**
- Em `src/routes/admin.clienti.tsx`, adicionar botão por linha: "Gerenciar landing" → `/admin/clienti/$id/landing` (reusa o mesmo editor) e "Atribuir utilizador" (cria registro em `client_managers` por email — convida via Supabase invite ou linka usuário existente).

## 3. Login do cliente

- Reusa `/login` existente. Após login, o redirect já vai pra `/admin` se admin; vou ajustar pra ir pra `/dashboard` se role `client`.
- Admin convida cliente via email no painel → cria usuário (se não existir, manda magic-link de signup) → atribui role `client` + cria `client_managers`.
- Para simplificar v1: admin cria conta digitando email e senha temporária, ou usa fluxo "esqueci senha" que já existe.

## 4. SEO

- Adicionar todas as landings publicadas ao `sitemap.xml.ts` (query no banco, filtrar `enabled = true`).
- Slugs reservados continuam excluídos.

## 5. Componente público da landing

Layout fiel ao exemplo enviado: largura máxima ~420px centralizado, cover ocupando fundo do header com overlay escuro, logo redondo com borda, título em destaque, parágrafo de descrição, botões pílula full-width empilhados (ícone à esquerda + label), galeria em grid 3 colunas, vídeo embed responsivo. Cores do site (cream/ink/friuli-blue) + accent customizável por cliente.

## Arquivos que vou criar/alterar

```
supabase/migrations/<timestamp>_client_landings.sql  (novo)
src/routes/$slug.tsx                                  (novo — landing pública)
src/routes/_authenticated/dashboard.tsx               (novo)
src/routes/_authenticated/landing.$clientId.tsx      (novo — editor)
src/components/landing/LandingView.tsx                (novo — render público)
src/components/landing/LandingEditor.tsx              (novo — editor reusável)
src/components/landing/IconPicker.tsx                 (novo)
src/hooks/useClientLanding.ts                         (novo)
src/routes/admin.clienti.tsx                          (alteração — botões + invite)
src/routes/login.tsx                                  (alteração — redirect por role)
src/routes/sitemap[.]xml.ts                           (alteração — incluir landings)
src/hooks/useAuth.tsx                                 (alteração — expor role)
```

## Detalhes técnicos

- Editor com auto-save desabilitado; botão "Salvar" explícito.
- Upload usa Supabase Storage SDK direto do browser (RLS no bucket garante segurança).
- Drag-and-drop dos links usa `@dnd-kit` (já no projeto? — verifico, se não, instalo).
- Ícones: lucide-react (já no projeto).
- Não vou implementar autenticação OAuth nova para clientes nesta v1 (só email/senha). Google sign-in continua funcionando se já configurado.

## Fora de escopo (v1)

- Sistema de convite automático por email com magic link customizado (admin criará a conta manualmente ou cliente usa "esqueci senha").
- Estatísticas de cliques nos links.
- Domínio próprio por cliente.