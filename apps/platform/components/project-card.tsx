"use client"

import type { Project } from "@arkanya/database"
import Link from "next/link"
import { ProjectStatusSelect } from "./project-status-select"

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const kind = project.destination.startsWith("clients/") ? "Client" : "Produit"

  return (
    <div className="group flex items-center gap-2 rounded-lg pl-2.5 pr-1.5 py-1.5 bg-well/55 hover:bg-elevated/90 border border-white/[0.06] hover:border-brand/30 transition-[background-color,border-color] duration-140">
      <Link href={`/projects/${project.slug}`} className="min-w-0 flex-1 block">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className={[
              "metric text-[10px] tracking-[0.04em]",
              kind === "Client" ? "text-category-client" : "text-category-product",
            ].join(" ")}
          >
            {kind}
          </span>
          {project.generated && (
            <span className="metric text-[10px] tracking-[0.04em] text-brand">
              · En ligne
            </span>
          )}
        </div>
        <p className="text-[13px] font-medium text-white group-hover:text-brand leading-tight truncate transition-colors duration-140">
          {project.name}
        </p>
      </Link>
      <ProjectStatusSelect slug={project.slug} value={project.status} />
    </div>
  )
}
