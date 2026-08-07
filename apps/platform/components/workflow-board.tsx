"use client"

import { useState, type CSSProperties } from "react"
import type { Project, ProjectStatus } from "@arkanya/database"
import { ChevronDown } from "lucide-react"
import { ProjectCard } from "./project-card"

type Column = {
  status: ProjectStatus
  label: string
  code: string
  accent: string
}

const COLUMNS: Column[] = [
  {
    status: "TO_QUALIFY",
    label: "À qualifier",
    code: "File d'attente",
    accent: "var(--color-arc)",
  },
  {
    status: "IN_PROGRESS",
    label: "En cours",
    code: "Production",
    accent: "#9ec0e0",
  },
  {
    status: "IN_REVIEW",
    label: "En validation",
    code: "Revue",
    accent: "var(--color-warning)",
  },
]

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth < 1024
}

type WorkflowBoardProps = {
  projects: Project[]
}

export function WorkflowBoard({ projects }: WorkflowBoardProps) {
  const [collapsed, setCollapsed] = useState<Record<ProjectStatus, boolean>>(() => ({
    TO_QUALIFY: isMobileViewport(),
    IN_PROGRESS: isMobileViewport(),
    IN_REVIEW: isMobileViewport(),
  }))

  function toggle(status: ProjectStatus) {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }))
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
      {COLUMNS.map((col) => {
        const items = projects.filter((p) => p.status === col.status)
        const isCollapsed = collapsed[col.status]
        const needsScroll = items.length > 8

        return (
          <section
            key={col.status}
            className="lane self-start w-full"
            style={{ "--lane-accent": col.accent } as CSSProperties}
          >
            <button
              type="button"
              onClick={() => toggle(col.status)}
              className="flex items-center justify-between w-full text-left pl-4 pr-3 pt-2.5 pb-2"
            >
              <div className="flex items-baseline gap-2.5 min-w-0">
                <span
                  className="heading text-xl leading-none tabular-nums shrink-0"
                  style={{ color: col.accent }}
                >
                  {items.length}
                </span>
                <div className="min-w-0">
                  <p className="metric text-[11px] tracking-[0.04em] text-zinc-300 leading-none mb-0.5">
                    {col.code}
                  </p>
                  <p className="text-[13px] text-white font-medium truncate">{col.label}</p>
                </div>
              </div>
              <ChevronDown
                size={14}
                className={[
                  "text-zinc-400 transition-transform duration-200 ease-out shrink-0 lg:hidden",
                  isCollapsed ? "-rotate-90" : "",
                ].join(" ")}
              />
            </button>

            {!isCollapsed && (
              <div
                className={[
                  "px-2 pb-2 space-y-1",
                  needsScroll ? "max-h-[26rem] platform-scroll" : "",
                ].join(" ")}
              >
                {items.length === 0 ? (
                  <div className="flex items-center justify-center h-12 rounded-lg bg-well/50 mx-0.5">
                    <p className="metric text-[11px] tracking-wide text-zinc-400">
                      Aucun projet
                    </p>
                  </div>
                ) : (
                  items.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))
                )}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
