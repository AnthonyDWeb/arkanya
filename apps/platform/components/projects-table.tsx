"use client"

import type { Client, Project } from "@arkanya/database"
import Link from "next/link"
import { DeleteProjectButton } from "./delete-project-button"
import { ProjectStatusSelect } from "./project-status-select"

type ProjectWithClient = Project & { client: Client | null }

type ProjectsTableProps = {
  projects: ProjectWithClient[]
}

export function ProjectsTable({ projects }: ProjectsTableProps) {
  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-sm text-zinc-600">Aucun projet</p>
      </div>
    )
  }

  return (
    <>
      {/* Mobile — cartes */}
      <div className="lg:hidden p-4 space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-start justify-between p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-xl"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="flex-1 min-w-0 active:opacity-70 transition-opacity duration-100"
            >
              <p className="text-sm font-medium text-zinc-100 truncate">{project.name}</p>
              <p className="text-xs text-zinc-500 mt-0.5 truncate">
                {project.client?.company ?? "Interne"} · {project.type}
              </p>
              {project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {project.technologies.slice(0, 2).map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] px-1.5 py-0.5 bg-zinc-700/60 text-zinc-400 rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </Link>
            <div className="flex items-center gap-1.5 ml-3 mt-0.5 shrink-0">
              <ProjectStatusSelect slug={project.slug} value={project.status} />
              <DeleteProjectButton slug={project.slug} name={project.name} variant="icon" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop — table */}
      <div className="hidden lg:block px-6 py-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800">
              <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Projet</th>
              <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Client</th>
              <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Type</th>
              <th className="text-left text-xs font-medium text-zinc-500 pb-3 pr-4">Statut</th>
              <th className="text-left text-xs font-medium text-zinc-500 pb-3">Technologies</th>
              <th className="pb-3 w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {projects.map((project) => (
              <tr
                key={project.id}
                className="group hover:bg-zinc-800/30 transition-colors duration-[120ms]"
              >
                <td className="py-3 pr-4">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="font-medium text-zinc-100 hover:text-white"
                  >
                    {project.name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-zinc-500">
                  {project.client?.company ?? "—"}
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-zinc-500">{project.type}</span>
                </td>
                <td className="py-3 pr-4">
                  <ProjectStatusSelect slug={project.slug} value={project.status} />
                </td>
                <td className="py-3">
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-1.5 py-0.5 bg-zinc-700/60 text-zinc-400 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 text-right">
                  <DeleteProjectButton slug={project.slug} name={project.name} variant="icon" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
