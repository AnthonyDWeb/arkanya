# Product

<!-- impeccable:product-schema 1 -->

## Platform

adaptive

## Users

Primary user: Anthony Delforge alone. Platform is a personal ops tool — not a multi-user product, not client-facing SaaS.

Job: create and run digital projects/tools (client sites and Arkanya products) with as little manual scaffolding as possible: qualify work → configure via Builder → run the Worker → track jobs → open preview/deploy.

## Product Purpose

Arkanya Platform is the private cockpit of a software factory. It turns a project configuration into a generated, previewable, deployable codebase by producing structured intent (`ProjectManifest`) and letting a deterministic Worker execute (`initialize → scaffold → feature(s) → delivery → validate`).

**Success today:** configure a project in the Builder and get a real result on disk or via GitHub/Vercel without hand-rolling the scaffold.

**North star (confirmed direction, not yet a shipped UI capability):** describe an idea in natural language → structured intent → generate. The product must keep that path as the long-term purpose even while today’s path is the structured Builder form.

## Positioning

The durable mechanism neighboring tools cannot honestly copy: Platform never asks a LLM to emit application source. It captures intent as a contract; the Worker executes deterministically. AI (when present) structures intent — it does not write the product code.

## Operating Context

- French UI, private authenticated session (Better Auth email/password; sign-up disabled; admin created via `create-admin`).
- Daily loop: Vue d'ensemble (kanban) → Clients / Projets → Catalogue (templates, features, timings) → Builder → Console / Jobs → Settings (env / Worker health).
- Worker is a separate HTTP service: local (`127.0.0.1:4000`) at the desk, remote (Railway + SSE) when away.
- Destinations: `clients/{slug}` for client work, `products/{slug}` for internal products.
- Mobile use (Capacitor wrap of Platform) is a first-class product constraint: the cockpit must remain operable on phone when using the remote Worker — even though the native shell is planned, not fully shipped under `apps/platform` yet.
- Shared contract lives in `@arkanya/contracts`; Platform orchestrates via HTTP and must not own generation filesystem writes (Worker does).

## Capabilities and Constraints

**Shipped / confirmed**
- Auth-gated cockpit: overview, clients, projects, catalogue, builder wizard, console, jobs, maintenance, settings.
- Builder steps: Projet → Template → Pages → Configuration → Fonctionnalités → Livraison → Résumé → Exécution.
- Delivery targets include GitHub / Vercel / DB as configured in the wizard.
- Worker bridge: run job, poll progress, health check; Bearer auth when `WORKER_API_KEY` is set.
- Internal business-offer catalog exists for ops reference; it is not Platform SaaS pricing.

**Constraints**
- Single admin in Phase 1 — no roles, orgs, or tenant isolation.
- Platform must not invent testimonials, public marketing claims, or multi-tenant product framing.
- NL → AI → manifest is product direction, not a claimed current UI feature.
- Capacitor for Platform is intentional product scope (adaptive), not yet the incumbent shipped shell.

**Undecided**
- Exact preview UX definition (project URL field vs dedicated preview surface).
- How much of `apps/account` belongs inside the Platform narrative vs stays separate.

## Brand Commitments

- Name: **Arkanya** / **Arkanya Platform**; login wordmark `arkanya`.
- Logo: `apps/platform/public/logo.webp`.
- Voice: French, terse ops language (“Cockpit privé”, Worker actif/hors ligne). Personal tool tone — not a public SaaS brand pitch inside the app.

## Evidence on Hand

- Real French UI copy, nav labels, builder step labels, workflow statuses.
- Logo asset at `apps/platform/public/logo.webp`.
- No screenshots, testimonials, or case studies about Platform in-repo — do not fabricate them.

## Product Principles

1. **Intent over code generation** — capture structured intent; execute deterministically.
2. **Personal factory first** — optimize for one operator’s speed and clarity, not multi-tenant SaaS patterns.
3. **Same job at the desk and on the road** — local and remote Worker are one product; mobile operability is required.
4. **Honest capability claims** — ship Builder truth today; keep the NL→intent north star without pretending the chat UI exists.
5. **Cockpit, not canvas** — Platform orchestrates and observes; the Worker builds.

## Accessibility & Inclusion

No product-specific accessibility standard was established beyond ordinary operable UI (including touch-friendly targets for the adaptive/mobile constraint). Open: confirm WCAG target if/when Platform is exposed beyond personal use.
