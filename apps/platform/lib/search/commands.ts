export type SearchHitKind = "page" | "project" | "client" | "action"

export type SearchActionId = "logout" | "builder" | "home"

export type SearchHit = {
  id: string
  kind: SearchHitKind
  title: string
  subtitle: string
  href?: string
  actionId?: SearchActionId
  score: number
}

export type SearchProject = {
  slug: string
  name: string
}

export type SearchClient = {
  id: string
  name: string
  company: string
}

export type SearchCatalog = {
  projects: SearchProject[]
  clients: SearchClient[]
}

export const SEARCH_PAGES: Array<{
  id: string
  title: string
  href: string
  aliases: string[]
  hint: string
}> = [
  {
    id: "home",
    title: "Vue d'ensemble",
    href: "/",
    aliases: ["/", "accueil", "home", "overview", "production"],
    hint: "Tableau de bord",
  },
  {
    id: "projects",
    title: "Projets",
    href: "/projects",
    aliases: ["/projets", "/projects", "projets", "projects"],
    hint: "Liste des projets",
  },
  {
    id: "clients",
    title: "Clients",
    href: "/clients",
    aliases: ["/clients", "clients"],
    hint: "Liste des clients",
  },
  {
    id: "catalogue",
    title: "Catalogue",
    href: "/catalogue",
    aliases: ["/catalogue", "/catalog", "catalogue", "catalog", "templates"],
    hint: "Modèles et fonctionnalités",
  },
  {
    id: "builder",
    title: "Builder",
    href: "/builder",
    aliases: ["/builder", "builder", "générer", "generer"],
    hint: "Générer un projet",
  },
  {
    id: "console",
    title: "Console",
    href: "/console",
    aliases: ["/console", "console", "jobs"],
    hint: "Historique des jobs",
  },
  {
    id: "settings",
    title: "Paramètres",
    href: "/settings",
    aliases: ["/parametres", "/paramètres", "/settings", "parametres", "paramètres", "settings"],
    hint: "Compte et connexions",
  },
]

export const SEARCH_ACTIONS: Array<{
  id: SearchActionId
  title: string
  hint: string
  aliases: string[]
}> = [
  {
    id: "logout",
    title: "Déconnexion",
    hint: "Fermer la session",
    aliases: ["$logout", "logout", "deconnexion", "déconnexion", "signout", "sign-out"],
  },
  {
    id: "builder",
    title: "Lancer le Builder",
    hint: "Ouvrir le générateur",
    aliases: ["$builder", "$generer", "$générer", "builder"],
  },
  {
    id: "home",
    title: "Retour à l’accueil",
    hint: "Vue d’ensemble",
    aliases: ["$home", "$accueil", "home"],
  },
]

function normalize(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function scoreMatch(query: string, candidate: string): number {
  const q = normalize(query)
  const c = normalize(candidate)
  if (!q || !c) return 0
  if (c === q) return 100
  if (c.startsWith(q)) return 80
  if (c.includes(q)) return 50
  return 0
}

function bestScore(query: string, candidates: string[]): number {
  let best = 0
  for (const candidate of candidates) {
    best = Math.max(best, scoreMatch(query, candidate))
  }
  return best
}

export function resolveSearch(query: string, catalog: SearchCatalog): SearchHit[] {
  const trimmed = query.trim()
  if (!trimmed) {
    return SEARCH_PAGES.map((page) => ({
      id: `page:${page.id}`,
      kind: "page" as const,
      title: page.title,
      subtitle: page.hint,
      href: page.href,
      score: 1,
    }))
  }

  const mode =
    trimmed.startsWith("/")
      ? "page"
      : trimmed.startsWith("#")
        ? "project"
        : trimmed.startsWith("@")
          ? "client"
          : trimmed.startsWith("$")
            ? "action"
            : "all"

  const needle =
    mode === "all" ? trimmed : trimmed.slice(1).trim() || trimmed

  const hits: SearchHit[] = []

  if (mode === "page" || mode === "all") {
    for (const page of SEARCH_PAGES) {
      const score = bestScore(needle, [page.title, page.href, ...page.aliases])
      if (score > 0) {
        hits.push({
          id: `page:${page.id}`,
          kind: "page",
          title: page.title,
          subtitle: page.hint,
          href: page.href,
          score: mode === "page" ? score + 10 : score,
        })
      }
    }
  }

  if (mode === "project" || mode === "all") {
    for (const project of catalog.projects) {
      const score = bestScore(needle, [project.slug, project.name, `#${project.slug}`])
      if (score > 0) {
        hits.push({
          id: `project:${project.slug}`,
          kind: "project",
          title: project.name,
          subtitle: `#${project.slug}`,
          href: `/projects/${project.slug}`,
          score: mode === "project" ? score + 10 : score,
        })
      }
    }
  }

  if (mode === "client" || mode === "all") {
    for (const client of catalog.clients) {
      const score = bestScore(needle, [
        client.name,
        client.company,
        `@${client.name}`,
      ])
      if (score > 0) {
        hits.push({
          id: `client:${client.id}`,
          kind: "client",
          title: client.name,
          subtitle: client.company || "Client",
          href: `/clients/${client.id}`,
          score: mode === "client" ? score + 10 : score,
        })
      }
    }
  }

  if (mode === "action" || mode === "all") {
    for (const action of SEARCH_ACTIONS) {
      const score = bestScore(needle, [
        action.id,
        action.title,
        `$${action.id}`,
        ...action.aliases,
      ])
      if (score > 0) {
        hits.push({
          id: `action:${action.id}`,
          kind: "action",
          title: action.title,
          subtitle: `$${action.id} · ${action.hint}`,
          actionId: action.id,
          score: mode === "action" ? score + 10 : score,
        })
      }
    }
  }

  hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "fr"))
  return hits.slice(0, 12)
}
