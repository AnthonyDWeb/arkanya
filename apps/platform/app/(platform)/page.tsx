import { prisma } from "@arkanya/database/client"
import { WorkflowBoard } from "@/components/workflow-board"

export const dynamic = "force-dynamic"

export default async function OverviewPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  })

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Vue d'ensemble</h1>
        <p className="text-xs text-zinc-500 mt-0.5">{projects.length} projets actifs</p>
      </div>
      <WorkflowBoard projects={projects} />
    </div>
  )
}
