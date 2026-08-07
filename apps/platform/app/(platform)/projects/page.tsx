import { prisma } from "@arkanya/database/client"
import { ProjectsTable } from "@/components/projects-table"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Projets" }
export const dynamic = "force-dynamic"

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { client: true },
    orderBy: { updatedAt: "desc" },
  })

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
      <ProjectsTable projects={projects} />
    </div>
  )
}
