import { prisma } from "@arkanya/database/client"
import type { Metadata } from "next"
import { ConsoleJobsList } from "@/components/console-tabs"

export const metadata: Metadata = { title: "Console" }
export const dynamic = "force-dynamic"

export default async function ConsolePage() {
  const jobs = await prisma.job.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="min-h-full animate-page-in">
      <header className="px-4 lg:px-6 pt-4 pb-3">
        <p className="metric text-[10px] tracking-[0.14em] text-gold uppercase mb-1.5">
          Exécution
        </p>
        <div className="flex items-baseline gap-3 min-w-0">
          <h1 className="page-title">Console</h1>
          <span className="metric text-xs text-brand tabular-nums">
            {String(jobs.length).padStart(2, "0")}
          </span>
        </div>
        <p className="text-[12px] text-zinc-500 mt-1.5">
          Historique des jobs. Santé Worker dans Paramètres.
        </p>
      </header>
      <ConsoleJobsList jobs={jobs} />
    </div>
  )
}
