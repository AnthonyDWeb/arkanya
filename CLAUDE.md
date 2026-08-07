# Arkanya — [CLAUDE.md](http://CLAUDE.md)

> Fichier de contexte principal. Toujours lire en entier avant de coder quoi que ce soit.

---

## 1. Vision

Arkanya est une **usine logicielle pilotée par IA**.

L'objectif : décrire une idée en langage naturel → obtenir un projet planifié, généré, prévisualisé et déployé avec un minimum d'intervention manuelle.

**Principe fondamental :** l'IA produit une intention structurée (manifest). Un moteur déterministe exécute. On ne demande jamais à un LLM de générer du code applicatif brut.

---

## 2. Architecture

```
Utilisateur
    ↓
Platform  (web + app mobile Capacitor)
    ↓
Builder   (formulaire → ProjectManifest)
    ↓
Worker    (moteur d'exécution — HTTP service)
    ↓
initialize → scaffold → feature(s) → delivery → validate
    ↓
┌─────────────────────┬──────────────────────────────┐
│  Mode local         │  Mode remote (Railway)        │
│  → filesystem local │  → temp dir → GitHub → Vercel │
└─────────────────────┴──────────────────────────────┘
    ↓
Preview → Déploiement

```

**Règle absolue :** Platform ne touche jamais au filesystem. Worker ne prend jamais de décisions produit. La frontière est le `ProjectManifest`.

### Worker — deux modes


| Mode     | URL                         | Destination                     | Usage                       |
| -------- | --------------------------- | ------------------------------- | --------------------------- |
| `local`  | `http://127.0.0.1:4000`     | `clients/` ou `products/` local | Au bureau                   |
| `remote` | `https://worker.arkanya.fr` | Temp dir → GitHub → Vercel      | En déplacement (app mobile) |


Platform switche automatiquement selon `WORKER_URL`. Même contrat, même API.

**Mode remote :** les steps s'exécutent dans un dossier temporaire sur Railway. À la fin du pipeline, le projet est pushé sur GitHub et le temp dir est nettoyé. Aucun état persistant sur le serveur Railway.

**Temps réel (SSE) :** en mode remote, le Worker expose `GET /v1/jobs/:id/events` (Server-Sent Events). Platform s'y abonne via `EventSource` pour afficher la progression en direct. En mode local, le step-by-step suffit.

---

## 3. Structure du monorepo

```
arkanya/
├── apps/
│   ├── platform/          # Cockpit privé — Next.js 16, App Router
│   ├── account/           # Auth & profil administrateur
│   ├── website/           # arkanya.fr — site marketing
│   └── portfolio/         # anthony-delforge.fr
├── services/
│   └── worker/            # Moteur de génération — TypeScript, Node HTTP
├── packages/
│   ├── contracts/         # Types partagés Platform ↔ Worker (SOURCE DE VÉRITÉ)
│   ├── database/          # Prisma schema + client PostgreSQL
│   ├── ui/                # Composants partagés
│   └── config/            # tsconfig, eslint, prettier partagés
├── clients/               # Projets clients générés (hors workspace pnpm)
├── products/              # Produits Arkanya générés (hors workspace pnpm)
├── templates/             # Templates de génération (template.json + fichiers)
├── features/              # Catalogue de features (feature.json + fichiers)
└── providers/             # Providers externes (EmailJS, etc.)

```

---

## 4. Responsabilités

### `packages/contracts`

Types TypeScript partagés entre Platform et Worker. Jamais de logique, que des types. Contient : `WorkerProjectPayload`, `WorkerReport`, `BuilderTask`, `BuilderStep`, `ProjectManifest`.

### `packages/database`

Prisma schema. Client exporté et utilisé par Platform uniquement. Worker n'accède pas à la base directement — il reçoit tout dans le payload.

### `packages/ui`

Composants React partagés. Pas de logique métier. Pas de fetch. Que du rendu.

### `apps/platform`

Cockpit privé. Protégé par auth. Consomme `@arkanya/database` et `@arkanya/ui`. Appelle le Worker via HTTP uniquement — jamais d'opération filesystem directe. Wrappé en app mobile via Capacitor (iOS / Android).

### `apps/platform`

Cockpit privé. Web + application mobile via **Capacitor**. Protégé par auth. Consomme `@arkanya/database` et `@arkanya/ui`. Appelle le Worker via HTTP uniquement — jamais d'opération filesystem directe. `WORKER_URL` détermine si le Worker est local ou remote.

### `services/worker`

Service HTTP Node.js pur (pas de framework). TypeScript. Deux modes : `local` (port 4000, localhost) et `remote` (Railway, HTTPS). Importe `@arkanya/contracts` pour les types. Exécute les steps de génération. En mode local : seul composant qui écrit sur le filesystem. En mode remote : génère dans un temp dir, push sur GitHub, nettoie.

---

## 5. Stack


| Domaine             | Choix                                   |
| ------------------- | --------------------------------------- |
| Runtime             | Node 24                                 |
| Package manager     | pnpm 10                                 |
| Build orchestration | Turborepo                               |
| Framework (apps)    | Next.js 16, App Router                  |
| Langage             | TypeScript 5.9 strict                   |
| Styles              | Tailwind CSS 4                          |
| Base de données     | PostgreSQL + Prisma                     |
| Auth                | Better Auth (admin unique en Phase 1)   |
| Worker runtime      | Node.js pur (pas de framework HTTP)     |
| App mobile          | Capacitor (wraps Platform Next.js)      |
| Worker remote       | Railway                                 |
| Temps réel          | SSE (Server-Sent Events) en mode remote |
| Généré projets      | npm standalone (hors workspace pnpm)    |


---

## 6. Schéma de base de données

```prisma
model Client {
  id          String    @id @default(cuid())
  name        String
  company     String
  status      String
  contact     String
  createdAt   DateTime  @default(now())
  projects    Project[]
}

model Project {
  id          String    @id @default(cuid())
  slug        String    @unique
  name        String
  owner       String
  type        String
  status      ProjectStatus @default(TO_QUALIFY)
  port        Int?
  url         String?
  nextAction  String?
  image       String?
  destination String
  description String
  technologies String[]
  generated   Boolean   @default(false)
  clientId    String?
  client      Client?   @relation(fields: [clientId], references: [id])
  jobs        Job[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Job {
  id          String    @id @default(cuid())
  externalId  String    @unique
  projectSlug String
  project     Project   @relation(fields: [projectSlug], references: [slug])
  action      String
  state       JobState  @default(PENDING)
  startedAt   DateTime?
  finishedAt  DateTime?
  events      JobEvent[]
  createdAt   DateTime  @default(now())
}

model JobEvent {
  id          String    @id @default(cuid())
  jobId       String
  job         Job       @relation(fields: [jobId], references: [id])
  stepId      String
  stepType    String
  state       String
  message     String?
  startedAt   DateTime
  finishedAt  DateTime?
  durationMs  Int?
}

enum ProjectStatus {
  TO_QUALIFY
  IN_PROGRESS
  IN_REVIEW
}

enum JobState {
  PENDING
  RUNNING
  SUCCESS
  ERROR
}

```

---

## 7. Conventions de code

### Règles générales

- TypeScript strict partout. Pas de `any`, pas de `as unknown`.
- Exports nommés uniquement. Pas de `export default` sauf pour les pages Next.js.
- Un composant = un fichier. Pas de fichiers barrel surchargés.
- Pas d'abstraction avant 3 duplications (règle des 3).
- Pas de refacto si ça marche, sauf si ça bloque une feature ou pose un risque sécurité.

### Nommage

- Composants React : `PascalCase`
- Fonctions, variables : `camelCase`
- Fichiers de composants : `kebab-case.tsx`
- Fichiers utilitaires : `kebab-case.ts`
- Variables d'env : `SCREAMING_SNAKE_CASE`

### Composants

- Props typées dans un type dédié en haut du fichier.
- Pas de JSX compressé sur une ligne. Chaque prop sur sa ligne si > 2 props.
- Pas de logique de fetch dans les composants — passer les données en props depuis Server Components.
- CSS Modules pour les styles spécifiques à un composant. Tailwind pour les utilitaires courants.

### Sécurité

- Toujours valider les inputs côté Worker avant d'exécuter quoi que ce soit.
- Toujours vérifier les chemins filesystem avec `path.relative` pour prévenir le path traversal.
- Worker local : jamais exposé sur une interface publique (localhost uniquement).
- Worker remote : toujours protégé par `Authorization: Bearer WORKER_API_KEY`. HTTPS obligatoire. Rate limiting activé.

---

## 8. Conventions de design

> Inspiré de `frontend-design` (Anthropic) et `emil-design-eng` (Emil Kowalski).

### Principes fondamentaux

- Pas d'interface générique. Chaque écran a un parti pris visuel assumé.
- Pas de police Inter ou Roboto. Choisir une fonte avec une personnalité.
- Chaque décision de couleur, d'espacement et de typographie est intentionnelle — pas un défaut.
- Préférer la sobriété à la surcharge. Moins d'éléments, mieux définis.

### Animations et interactions

- Feedback bouton : 100–160ms, `ease-out`.
- Ouverture modal/drawer : 200–300ms, spring physique (tension 200, friction 20).
- Fermeture : toujours plus rapide que l'ouverture (50–100ms de moins).
- Transitions de page : 150–250ms, `ease-in-out`.
- Ne jamais animer ce qui n'apporte pas de valeur à l'utilisateur.
- Utiliser des springs plutôt que des `cubic-bezier` arbitraires pour les mouvements naturels.

### Ce qu'il ne faut jamais faire

- `ease-in` sur une animation d'entrée (l'élément démarre lentement → ressenti lent).
- Borders épaisses là où une ombre subtile suffit.
- `transition: all` — toujours cibler la propriété exacte.
- Animations sur `width` ou `height` — utiliser `transform: scaleX/Y` ou `max-height` avec précaution.
- Plus de 2 niveaux de profondeur d'ombre simultanés.

### Layout

- Utiliser CSS Grid pour les mises en page bidimensionnelles, Flexbox pour les alignements lineaires.
- Espacements sur une échelle cohérente (multiples de 4px).
- Jamais de `margin: auto` sans comprendre pourquoi.

---

## 9. Ce que Cursor ne doit jamais faire

- Créer des fichiers `index.ts` barrel qui ré-exportent tout — ça casse le tree-shaking.
- Mettre de la logique dans `page.tsx` — c'est uniquement pour la composition.
- Installer une librairie pour résoudre un problème que 10 lignes de code natif résolvent.
- Générer des commentaires évidents (`// increment counter`).
- Créer des types `any` pour "aller vite".
- Modifier le schéma Prisma sans créer une migration.
- Appeler le Worker depuis un Server Component — passer par une Server Action ou une Route Handler.
- Oublier la validation du contrat dans le Worker avant toute exécution.

---

## 10. Projets réels dans le monorepo


| App / Dossier                   | Description                            |
| ------------------------------- | -------------------------------------- |
| `apps/platform`                 | Cockpit privé Arkanya                  |
| `apps/website`                  | arkanya.fr (site vitrine)              |
| `apps/portfolio`                | anthony-delforge.fr                    |
| `clients/lesservicesdemathilde` | Site client — Les Services de Mathilde |
| `products/arkcare`              | Application santé (suivi traitements)  |
| `products/arknest`              | Application budget foyer               |


---

## 11. Variables d'environnement attendues

### `apps/platform`

```
DATABASE_URL=               # PostgreSQL connection string (Neon)
BETTER_AUTH_SECRET=         # Secret pour Better Auth
WORKER_URL=                 # http://127.0.0.1:4000 (local) ou https://worker.arkanya.fr (remote)
WORKER_API_KEY=             # Clé API pour authentifier les appels au Worker remote

```

### `services/worker` (local)

```
WORKER_PORT=4000            # Port d'écoute (défaut: 4000)
WORKER_MODE=local           # local | remote

```

### `services/worker` (remote — Railway)

```
WORKER_PORT=4000
WORKER_MODE=remote
WORKER_API_KEY=             # Même clé que côté Platform
GITHUB_TOKEN=               # Token GitHub pour push des projets générés
GITHUB_ORG=                 # Organisation ou compte GitHub cible

```

---

## 12. Persona d'ingénierie — Product Engineer

Quand tu analyses du code, refactor, ou revois une architecture, équilibre excellence technique et vélocité startup.

- **Pragmatisme avant perfection** : ne propose pas de refacto massif sur du code qui marche, sauf si ça bloque une feature à venir ou pose un risque critique de sécurité/performance.
- **Time-to-market** : préfère les patterns ennuyeux, fiables, bien documentés, qu'un futur développeur comprend en 5 minutes.
- **Performance = métrique business** : surveille la taille des bundles, la latence API, le CLS — du code lent nuit à la conversion et au SEO.
- **Règle des 3** : n'abstrais ou ne crée un composant réutilisable qu'après 3 duplications constatées dans le code (cf. section 7).

Les conventions de design (typographie, animations, ce qu'il ne faut jamais faire) sont déjà couvertes en section 8 — pas de duplication ici.

---

## 13. Prompts d'analyse (à utiliser régulièrement)

- **Dette technique** : "Identifie les 3 zones de code les plus complexes qui risquent de ralentir l'équipe. Propose un plan de nettoyage rapide."
- **MVP shortcuts** : "Trouve où je peux couper les angles sans casser la sécurité ou l'UX globale."
- **Scalabilité** : "Est-ce que cette architecture va surcharger la base de données ou faire exploser la facture cloud si on passe de 100 à 10 000 utilisateurs ?"

