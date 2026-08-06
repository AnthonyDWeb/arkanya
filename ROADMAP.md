# Arkanya — Roadmap vivante

> Lire CLAUDE.md en premier. Ce fichier décrit CE QUE construire et DANS QUEL ORDRE. Chaque phase doit être 100% validée avant de passer à la suivante.

---

## Phase 0 — Socle ✅ COMPLÈTE

**Objectif :** Le monorepo compile. Tous les checks passent. Zéro feature.

### Packages et config

- [x] Initialiser le monorepo : `pnpm init` à la racine, `pnpm-workspace.yaml`
- [x] Configurer Turborepo (`turbo.json`) avec pipelines : `dev`, `build`, `lint`, `check-types`, `test`
- [x] `packages/config` — `tsconfig.base.json`, config ESLint partagée, config Prettier
- [x] `packages/contracts` — Tous les types partagés (importer depuis [CLAUDE.md](http://CLAUDE.md) section 4) :
  - `WorkerProjectPayload`, `WorkerReport`
  - `BuilderTask`, `BuilderTaskType`, `BuilderTaskState`
  - `BuilderStep`, `BuilderPage`, `BuilderPageSource`
  - `ProjectManifest` (alias de `WorkerProjectPayload`)
  - `RunBuilderStepInput`
- [x] `packages/ui` — Scaffold vide avec `package.json` et exports
- [x] `packages/database` — Prisma schema complet (voir [CLAUDE.md](http://CLAUDE.md) section 6), client exporté



### Apps et services

- [x] `apps/platform` — Scaffold Next.js 16, App Router, TypeScript, Tailwind 4
- [x] `apps/account` — Scaffold Next.js 16 (hors scope Phase 1)
- [x] `apps/website` — Scaffold (hors scope Phase 1)
- [x] `apps/portfolio` — Scaffold (hors scope Phase 1)
- [x] `services/worker` — Scaffold TypeScript : `server.ts`, `config.ts`, types depuis `@arkanya/contracts`



### Validation Phase 0

- [x] `pnpm lint` — zéro erreur
- [x] `pnpm check-types` — zéro erreur
- [x] `pnpm build` — tous les packages et apps buildent
- [x] `pnpm test` — passe
- [x] Worker : `GET /health` répond `{ status: "ok" }`

---



## Phase 1 — Platform Core ✅ COMPLÈTE

**Objectif :** Platform est utilisable. Auth active. Données depuis PostgreSQL. Worker health check réel.

### Base de données

- [ ] Créer un projet Neon → copier la connection string dans `apps/platform/.env`
- [ ] `pnpm --filter @arkanya/database db:migrate` — migration initiale
- [ ] `pnpm --filter @arkanya/database db:seed` — 2 clients + 6 projets
- [x] Seed écrit : 2 clients (Mathilde, Anthony), 6 projets (Arkanya Platform, arkanya.fr, portfolio, Les Services de Mathilde, ArkCare, ArkNest)



### Auth

- [x] Better Auth installé dans `apps/platform` avec `@arkanya/database`
- [ ] Créer le compte admin : `pnpm --filter @arkanya/platform create-admin <email> <password>`
- [x] Script `apps/platform/scripts/create-admin.ts` — création admin one-shot via `auth.api.signUpEmail`
- [x] Protection des routes via `app/(platform)/layout.tsx` (redirect si pas de session)
- [x] Page `/login` dans platform



### AppShell

- [x] Layout platform avec navigation (Vue d'ensemble, Clients, Projets, Catalogue, Builder, Jobs, Maintenance, Paramètres)
- [x] Sidebar 220px — Geist, zinc-950, 8 nav items, worker status, sign-out
- [x] Health check Worker dynamique : ping `WORKER_URL/health` via proxy `/api/worker/health`
- [x] NavItem — active state via usePathname



### Écrans

- [x] **Vue d'ensemble** (`/`) — WorkflowBoard (3 colonnes : TO_QUALIFY / IN_PROGRESS / IN_REVIEW)
- [x] **Clients** (`/clients`) — liste depuis DB
- [x] **Projets** (`/projects`) — table avec client, type, statut, technologies
- [x] **Projets détail** (`/projects/[slug]`) — 5 onglets depuis DB
- [x] **Jobs** (`/jobs`) — table avec statut coloré
- [x] **Catalogue, Builder, Maintenance, Paramètres** — stubs prêts Phase 2



### Validation Phase 1

- [x] Login/logout fonctionne
- [x] Toutes les routes sont protégées sans auth
- [x] Les projets du seed apparaissent dans le board et la table
- [x] Le détail d'un projet affiche ses vraies données depuis DB
- [x] L'indicateur Worker dans AppShell reflète l'état réel du service

---



## Phase 2 — Builder + Worker ✅ COMPLÈTE

**Objectif :** Pipeline de génération complet et fonctionnel. Un projet peut être créé de bout en bout.

> Worker en mode `local` uniquement dans cette phase.



### Worker — TypeScript complet

- [x] Migration complète de `.mjs` vers `.ts` (exécuté avec `tsx`)
- [x] Import des types depuis `@arkanya/contracts`
- [x] `POST /v1/steps` — pipeline complet :
  - `initialize` — crée dossier + `.arkanya-generated.json`
  - `scaffold` — copie template, sélection pages, remplacement tokens
  - `feature` — installation depuis catalogue avec slots template-spécifiques
  - `delivery` — simulation (Phase 2)
  - `validate` — `npm install` + `next build`
- [x] Jobs persistés en DB (création au début, events après pipeline)
- [x] Job events en DB (un enregistrement par step via `createMany`)



### Builder UI dans Platform

- [x] 8 étapes wizard
- [x] Sidebar "Résumé en direct" avec aperçu couleurs
- [x] Bouton reset après génération (succès ou échec)
- [x] Statistiques : durée génération / livraison / validation séparées



### Templates

- [x] Template `landing-page` : one-page, sections scrollables, anchors `#section`
- [x] Template `site-vitrine` : multi-pages, routes Next.js (bonus Phase 2)
- [x] Feature `navigation` : slots template-spécifiques (anchors vs routes)
- [x] Feature `contact-form` : slots template-spécifiques (page.tsx vs contact/page.tsx)



### ProjectDetail pour projets générés

- [x] Un projet généré via Builder crée un enregistrement en DB
- [x] Son détail est accessible via `/projects/[slug]`
- [x] Onglet "Activité" : affiche les job events réels depuis DB



### Validation Phase 2

- [x] Générer un projet depuis Builder jusqu'à la fin
- [x] Le projet apparaît dans la table et le board
- [x] Son dossier existe dans `clients/` ou `products/`
- [x] Les job events sont en DB et visibles dans l'onglet Activité
- [x] Le projet généré passe `npm install` + `next build`

---



## Phase 3 — Livraisons réelles + Worker remote

**Objectif :** Livraisons réelles (GitHub, Vercel). Worker déployé sur Railway. Platform utilisable en déplacement.

### Delivery Worker (local → remote)

- [ ] `delivery: github` — push du projet généré sur GitHub via API (GITHUB_TOKEN)
- [ ] `delivery: vercel` — déploiement via API Vercel
- [ ] `delivery: database` — enregistrement projet en DB via webhook Platform



### Worker remote (Railway)

- [ ] Ajouter auth API key : header `Authorization: Bearer WORKER_API_KEY` requis sur toutes les routes sauf `/health`
- [ ] Rate limiting sur `/v1/steps` et `/v1/jobs`
- [ ] Mode `remote` : génération dans temp dir (`os.tmpdir()`), push GitHub, nettoyage automatique
- [ ] SSE : endpoint `GET /v1/jobs/:id/events` — stream des événements step par step
- [ ] Déployer sur Railway (`WORKER_MODE=remote`, variables d'env configurées)
- [ ] `WORKER_URL` dans Platform pointé vers Railway en production



### Platform — ExecutionStep SSE

- [ ] En mode remote : `EventSource` sur `/v1/jobs/:id/events` pour progression en temps réel
- [ ] En mode local : step-by-step actuel (inchangé)
- [ ] Reconnexion automatique si le stream est interrompu



### Export

- [ ] Projet exportable : archive `.zip` téléchargeable depuis Platform
- [ ] Architecture export-compatible depuis Phase 0



### Platform — App mobile (Capacitor)

- [ ] Intégrer Capacitor dans `apps/platform`
- [ ] Build web → wrap Capacitor → iOS / Android
- [ ] Tester le flux Builder complet depuis l'app mobile (via Worker remote)



### Validation Phase 3

- [ ] Un projet peut être généré depuis l'app mobile → Worker Railway → GitHub → URL publique
- [ ] Le stream SSE fonctionne sur mobile (progression en temps réel)
- [ ] Worker local toujours fonctionnel pour usage bureau

---



## Templates à construire (Phase 2 → Phase 4)


| Template       | Statut  | Pages incluses                                |
| -------------- | ------- | --------------------------------------------- |
| `landing-page` | Phase 2 | Accueil, À propos, Services, Contact          |
| `site-vitrine` | Phase 4 | + Galerie, Témoignages, FAQ, Mentions légales |
| `app-pwa`      | Phase 4 | Dashboard, Auth, Profil                       |




## Features à construire


| Feature          | Statut  | Description                            |
| ---------------- | ------- | -------------------------------------- |
| `navigation`     | Phase 2 | Header responsive multi-pages          |
| `contact-form`   | Phase 2 | Formulaire + validation (EmailJS prêt) |
| `authentication` | Phase 4 | Auth complète                          |
| `android`        | Phase 4 | Capacitor + Android                    |


---



## Prochaine action immédiate

**Phase 2 — Builder + Worker :**

1. Worker : migration `.mjs` → `.ts` + `POST /v1/steps` (initialize → scaffold → feature → delivery → validate)
2. Template `landing-page` : Next.js 16, App Router, Tailwind 4
3. Builder UI : 8 étapes dans Platform
4. Jobs persistés en DB avec events par step