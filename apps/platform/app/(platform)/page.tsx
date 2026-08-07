import { prisma } from "@arkanya/database/client"
import { WorkflowBoard } from "@/components/workflow-board"

export const dynamic = "force-dynamic"

export default async function OverviewPage() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  })

  const counts = {
    total: projects.length,
    queue: projects.filter((p) => p.status === "TO_QUALIFY").length,
    build: projects.filter((p) => p.status === "IN_PROGRESS").length,
    check: projects.filter((p) => p.status === "IN_REVIEW").length,
    live: projects.filter((p) => p.generated && Boolean(p.url)).length,
  }

  const signals = [
    { label: "Total", value: counts.total, tone: "text-white" },
    { label: "À qualifier", value: counts.queue, tone: "text-brand" },
    { label: "En cours", value: counts.build, tone: "text-[#9ec0e0]" },
    { label: "En validation", value: counts.check, tone: "text-warning" },
  ] as const

  return (
    <div className="px-4 lg:px-6 py-4 animate-page-in space-y-4">
      <header className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="metric text-[10px] tracking-[0.14em] text-gold uppercase mb-1.5">
            Cockpit de production
          </p>
          <h1 className="page-title">Vue d&apos;ensemble</h1>
        </div>
        <p className="metric text-[12px] text-zinc-300 shrink-0 pb-0.5">
          <span className="text-gold tabular-nums font-medium">
            {String(counts.live).padStart(2, "0")}
          </span>
          <span className="text-zinc-400"> en ligne</span>
        </p>
      </header>

      <div className="signal-strip">
        {signals.map((stat) => (
          <div key={stat.label} className="signal-cell">
            <span className="metric text-[11px] tracking-[0.06em] text-zinc-300">
              {stat.label}
            </span>
            <span className={`heading text-xl leading-none tabular-nums ${stat.tone}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <WorkflowBoard projects={projects} />
    </div>
  )
}
