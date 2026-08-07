"use client"

import type { Project } from "@arkanya/database"
import Link from "next/link"
import { PROJECT_ENVIRONMENT_LABELS } from "@/lib/projects/environment"
import { PROJECT_STATUS_LABELS } from "@/lib/projects/status"

type ProjectCardProps = {
  project: Project
}

function environmentTone(environment: Project["environment"]): string {
  if (environment === "PRODUCTION") return "text-gold"
  if (environment === "ONLINE") return "text-brand"
  return "text-zinc-500"
}

export function ProjectCard({ project }: ProjectCardProps) {
  const kind = project.destination.startsWith("clients/") ? "Client" : "Produit"

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex items-center gap-2 rounded-lg pl-2.5 pr-2.5 py-1.5 bg-well/55 hover:bg-elevated/90 border border-white/[0.06] hover:border-brand/30 transition-[background-color,border-color] duration-140 min-w-0"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 mb-0.5 min-w-0">
          <span
            className={[
              "metric text-[10px] tracking-[0.04em]",
              kind === "Client" ? "text-category-client" : "text-category-product",
            ].join(" ")}
          >
            {kind}
          </span>
          <span className="metric text-[10px] text-zinc-600">·</span>
          <span
            className={`metric text-[10px] tracking-[0.04em] truncate ${environmentTone(project.environment)}`}
          >
            {PROJECT_ENVIRONMENT_LABELS[project.environment]}
          </span>
        </div>
        <p className="text-[13px] font-medium text-white group-hover:text-brand leading-tight truncate transition-colors duration-140">
          {project.name}
        </p>
      </div>
      <span className="metric text-[10px] text-zinc-500 shrink-0">
        {PROJECT_STATUS_LABELS[project.status] ?? project.status}
      </span>
    </Link>
  )
}
