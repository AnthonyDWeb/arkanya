import { prisma } from "@arkanya/database/client"
import { WorkflowBoard } from "@/components/workflow-board"
import Link from "next/link"
import { Wand2 } from "lucide-react"

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

  const nextActions = projects
    .filter((p) => Boolean(p.nextAction?.trim()))
    .slice(0, 4)

  return (
    <div className="animate-page-in min-h-full">
      <header className="relative overflow-hidden border-b border-white/[0.05] px-4 lg:px-6 pt-5 pb-4">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 120% at 0% 0%, color-mix(in oklch, var(--color-arc) 18%, transparent), transparent 55%), radial-gradient(ellipse 50% 80% at 100% 20%, color-mix(in oklch, var(--color-gold) 8%, transparent), transparent 50%)",
          }}
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="font-display text-[11px] tracking-[0.2em] text-gold uppercase mb-2">
              Arkanya
            </p>
            <h1 className="page-title">Production</h1>
            <p className="text-[12px] text-zinc-500 mt-1.5 max-w-sm">
              File, production, revue — le flux des projets en un regard.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="metric text-[10px] text-zinc-500 uppercase tracking-wide">
                En ligne
              </p>
              <p className="heading text-2xl text-gold tabular-nums leading-none">
                {String(counts.live).padStart(2, "0")}
              </p>
            </div>
            <Link
              href="/builder"
              className="slab inline-flex items-center gap-1.5 !px-3 !py-2.5 text-[12px] touch-manipulation"
            >
              <Wand2 className="w-3.5 h-3.5" strokeWidth={2} />
              Générer
            </Link>
          </div>
        </div>

        <div className="relative mt-4 grid grid-cols-4 gap-px rounded-xl overflow-hidden border border-white/[0.08] bg-white/[0.04]">
          {(
            [
              { label: "Total", value: counts.total, tone: "text-white" },
              { label: "File", value: counts.queue, tone: "text-brand" },
              { label: "En cours", value: counts.build, tone: "text-[#9ec0e0]" },
              { label: "Revue", value: counts.check, tone: "text-warning" },
            ] as const
          ).map((stat) => (
            <div
              key={stat.label}
              className="bg-surface/90 px-2.5 py-2.5 sm:px-3 flex flex-col gap-1"
            >
              <span className="metric text-[10px] tracking-[0.06em] text-zinc-500">
                {stat.label}
              </span>
              <span
                className={`heading text-lg sm:text-xl leading-none tabular-nums ${stat.tone}`}
              >
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </header>

      <div className="px-4 lg:px-6 py-4 space-y-4">
        {nextActions.length > 0 && (
          <section>
            <h2 className="metric text-[10px] text-zinc-400 mb-2 uppercase tracking-wide">
              Suites à traiter
            </h2>
            <div className="rounded-xl border border-white/[0.08] bg-surface/80 divide-y divide-white/[0.05] overflow-hidden max-w-xl">
              {nextActions.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="flex items-start justify-between gap-3 px-3 py-2.5 hover:bg-brand/[0.05] transition-colors duration-140"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-zinc-100 truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                      {p.nextAction}
                    </p>
                  </div>
                  <span className="metric text-[10px] text-brand shrink-0 mt-0.5">
                    Ouvrir
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <WorkflowBoard projects={projects} />
      </div>
    </div>
  )
}
