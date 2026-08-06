import type { Project } from "@arkanya/database"
import Link from "next/link"

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="block p-4 bg-zinc-800/50 hover:bg-zinc-800 active:scale-[0.99] border border-zinc-700/50 hover:border-zinc-600 rounded-lg transition-[colors,transform] duration-[120ms] ease-out group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-sm font-medium text-zinc-100 group-hover:text-white leading-tight">
          {project.name}
        </span>
        <span
          className={[
            "shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded",
            project.type === "client"
              ? "bg-violet-500/15 text-violet-400"
              : "bg-sky-500/15 text-sky-400",
          ].join(" ")}
        >
          {project.type}
        </span>
      </div>

      {project.description && (
        <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{project.description}</p>
      )}

      {project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {project.technologies.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[10px] px-1.5 py-0.5 bg-zinc-700/60 text-zinc-400 rounded font-mono"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="text-[10px] text-zinc-600">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      )}
    </Link>
  )
}
