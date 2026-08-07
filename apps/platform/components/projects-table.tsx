"use client"

import type { ProjectStatus } from "@arkanya/database"
import { Search, Wand2 } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { PROJECT_ENVIRONMENT_LABELS } from "@/lib/projects/environment"
import { PROJECT_STATUS_LABELS, PROJECT_STATUSES } from "@/lib/projects/status"
import type { ProjectWithClient } from "@/types/projects"

type ProjectsTableProps = {
  projects: ProjectWithClient[]
}

const STATUS_FILTERS: { id: ProjectStatus | "all"; label: string }[] = [
  { id: "all", label: "Tous" },
  ...PROJECT_STATUSES,
]

function environmentTone(environment: ProjectWithClient["environment"]): string {
  if (environment === "PRODUCTION") return "text-gold"
  if (environment === "ONLINE") return "text-brand"
  return "text-zinc-500"
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ProjectStatus | "all">("all")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return projects.filter((project) => {
      if (status !== "all" && project.status !== status) return false
      if (!q) return true
      return (
        project.name.toLowerCase().includes(q) ||
        (project.client?.company.toLowerCase().includes(q) ?? false) ||
        project.type.toLowerCase().includes(q) ||
        project.technologies.some((tech) => tech.toLowerCase().includes(q)) ||
        PROJECT_ENVIRONMENT_LABELS[project.environment].toLowerCase().includes(q)
      )
    })
  }, [projects, query, status])

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-start justify-center px-4 lg:px-6 py-16 gap-3">
        <p className="heading text-2xl text-white">Aucun projet.</p>
        <p className="text-sm text-zinc-400">L&apos;environnement de production est vide.</p>
        <Link href="/builder" className="slab mt-1">
          Créer un projet
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 lg:px-6 pb-6 space-y-3">
      <div className="flex items-center gap-2">
        <label className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand/80 z-[1]"
            strokeWidth={2}
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher…"
            className="well well-search w-full"
          />
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProjectStatus | "all")}
          className="well shrink-0 w-[9.5rem] metric text-xs"
        >
          {STATUS_FILTERS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <Link href="/builder" className="slab shrink-0 !px-3" title="Builder">
          <Wand2 className="w-3.5 h-3.5" strokeWidth={2} />
          <span className="hidden sm:inline">Builder</span>
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-20">
          <p className="metric text-xs tracking-wide text-zinc-400">Aucun résultat</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
          {filtered.map((project) => {
            const kind = project.destination.startsWith("clients/") ? "Client" : "Produit"
            const owner = project.client?.company ?? "Interne"
            const tech = project.technologies[0]

            return (
              <article
                key={project.id}
                className="group relative rounded-xl border border-white/[0.08] bg-surface/80 hover:border-brand/35 hover:bg-elevated/80 px-2.5 py-2 transition-[background-color,border-color] duration-140 min-w-0"
              >
                <div className="flex items-center gap-1.5 min-w-0 mb-1.5">
                  <span
                    className={[
                      "metric text-[11px]",
                      kind === "Client" ? "text-category-client" : "text-category-product",
                    ].join(" ")}
                  >
                    {kind}
                  </span>
                  <span className="metric text-[11px] text-zinc-600">·</span>
                  <span
                    className={`metric text-[11px] ${environmentTone(project.environment)}`}
                  >
                    {PROJECT_ENVIRONMENT_LABELS[project.environment]}
                  </span>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="text-[13px] font-semibold text-white hover:text-brand leading-snug block truncate transition-colors duration-140"
                >
                  {project.name}
                </Link>

                <p className="mt-0.5 text-[11px] text-zinc-400 truncate">
                  {owner}
                  <span className="text-zinc-600"> · </span>
                  {project.type}
                  {tech && (
                    <>
                      <span className="text-zinc-600"> · </span>
                      {tech}
                    </>
                  )}
                </p>

                <div className="mt-2 pt-1.5 border-t border-white/[0.06] flex items-center justify-between gap-1.5">
                  <span className="metric text-[10px] text-zinc-400">
                    {PROJECT_STATUS_LABELS[project.status] ?? project.status}
                  </span>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="metric text-[10px] text-zinc-400 hover:text-brand transition-colors duration-140 shrink-0"
                  >
                    Ouvrir
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
