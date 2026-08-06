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
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Projets</h1>
        <p className="text-xs text-zinc-500 mt-0.5">{projects.length} projets</p>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  )
}
