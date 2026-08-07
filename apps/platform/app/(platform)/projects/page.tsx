import { prisma } from "@arkanya/database/client"
import { ProjectsInsights } from "@/components/dashboard/projects-insights"
import { ProjectsTable } from "@/components/projects-table"
import type { ChartSlice } from "@/lib/dashboard/chart"
import { PIPELINE_COLORS } from "@/lib/dashboard/colors"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Projets" }
export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { updatedAt: "desc" },
  })

  const queue = projects.filter((p) => p.status === "TO_QUALIFY").length
  const build = projects.filter((p) => p.status === "IN_PROGRESS").length
  const check = projects.filter((p) => p.status === "IN_REVIEW").length
  const live = projects.filter((p) => p.generated && Boolean(p.url)).length
  const undelivered = projects.filter((p) => !p.generated || !p.url).length
  const orphans = projects.filter((p) => p.clientId == null).length

  const pipeline: ChartSlice[] = [
    {
      id: "TO_QUALIFY",
      label: "File",
      value: queue,
      color: PIPELINE_COLORS.TO_QUALIFY,
    },
    {
      id: "IN_PROGRESS",
      label: "En cours",
      value: build,
      color: PIPELINE_COLORS.IN_PROGRESS,
    },
    {
      id: "IN_REVIEW",
      label: "Revue",
      value: check,
      color: PIPELINE_COLORS.IN_REVIEW,
    },
  ]

  return (
    <div className="animate-page-in">
      <header className="px-4 lg:px-6 pt-4 pb-3">
        <p className="metric text-[10px] tracking-[0.14em] text-gold uppercase mb-1.5">
          Inventaire
        </p>
        <div className="flex items-baseline gap-3">
          <h1 className="page-title">Projets</h1>
          <span className="metric text-xs text-brand tabular-nums">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </header>
      {projects.length > 0 ? (
        <ProjectsInsights
          pipeline={pipeline}
          live={live}
          undelivered={undelivered}
          orphans={orphans}
        />
      ) : null}
      <ProjectsTable projects={projects} />
    </div>
  )
}
