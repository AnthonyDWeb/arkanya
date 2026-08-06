"use client"

import type { Project } from "@arkanya/database"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { ProjectStatusSelect } from "./project-status-select"

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="p-4 bg-zinc-800/50 border border-zinc-700/50 rounded-lg space-y-3">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm font-medium text-zinc-100 hover:text-white leading-tight cursor-pointer transition-colors duration-[120ms] ease-out"
        >
          {project.name}
        </Link>
        <span
          className={[
            "shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded",
            project.destination.startsWith("clients/")
              ? "bg-violet-500/15 text-violet-400"
              : "bg-sky-500/15 text-sky-400",
          ].join(" ")}
        >
          {project.destination.startsWith("clients/") ? "client" : "product"}
        </span>
      </div>

      {project.description && (
        <p className="text-xs text-zinc-500 line-clamp-2">{project.description}</p>
      )}

      {(project.url || project.nextAction) && (
        <div className="space-y-1">
          {project.url && (
            <p className="text-[11px] text-brand truncate font-mono">{project.url}</p>
          )}
          {project.nextAction && (
            <p className="text-[11px] text-zinc-500 truncate">→ {project.nextAction}</p>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-1">
        <ProjectStatusSelect slug={project.slug} value={project.status} />
        <Link
          href={`/projects/${project.slug}`}
          title="Ouvrir"
          aria-label="Ouvrir"
          className="p-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
        </Link>
      </div>
    </div>
  )
}
