"use client"

import { useEffect, useState } from "react"
import type { Project, ProjectStatus } from "@arkanya/database"
import { ChevronDown } from "lucide-react"
import { ProjectCard } from "./project-card"

type Column = {
  status: ProjectStatus
  label: string
  accent: string
}

const COLUMNS: Column[] = [
  { status: "TO_QUALIFY", label: "À qualifier", accent: "border-zinc-600" },
  { status: "IN_PROGRESS", label: "En cours", accent: "border-blue-500" },
  { status: "IN_REVIEW", label: "En validation", accent: "border-amber-500" },
]

type WorkflowBoardProps = {
  projects: Project[]
}

export function WorkflowBoard({ projects }: WorkflowBoardProps) {
  const [collapsed, setCollapsed] = useState<Record<ProjectStatus, boolean>>({
    TO_QUALIFY: false,
    IN_PROGRESS: false,
    IN_REVIEW: false,
  })

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setCollapsed({ TO_QUALIFY: true, IN_PROGRESS: true, IN_REVIEW: true })
    }
  }, [])

  function toggle(status: ProjectStatus) {
    setCollapsed((prev) => ({ ...prev, [status]: !prev[status] }))
  }

  return (
    <div className="grid grid-cols-1 gap-3 p-4 lg:grid-cols-3 lg:gap-4 lg:p-6">
      {COLUMNS.map((col) => {
        const items = projects.filter((p) => p.status === col.status)
        const isCollapsed = collapsed[col.status]

        return (
          <div key={col.status} className="flex flex-col">
            <button
              onClick={() => toggle(col.status)}
              className={[
                "flex items-center justify-between pb-3 border-b-2 w-full text-left",
                col.accent,
              ].join(" ")}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-xs text-zinc-600 font-mono">{items.length}</span>
              </div>
              <ChevronDown
                size={14}
                className={[
                  "text-zinc-600 transition-transform duration-200 ease-out",
                  isCollapsed ? "-rotate-90" : "",
                ].join(" ")}
              />
            </button>

            {!isCollapsed && (
              <div className="flex flex-col gap-3 mt-3">
                {items.length === 0 ? (
                  <p className="text-xs text-zinc-600 py-4 text-center">Aucun projet</p>
                ) : (
                  items.map((project) => <ProjectCard key={project.id} project={project} />)
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
