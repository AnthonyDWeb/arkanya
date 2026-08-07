import { prisma } from "@arkanya/database/client"
import { ConsoleInsights } from "@/components/dashboard/console-insights"
import { ConsoleJobsList } from "@/components/console-tabs"
import type { ChartSlice } from "@/lib/dashboard/chart"
import { JOB_COLORS } from "@/lib/dashboard/colors"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Console" }
export const dynamic = "force-dynamic"

const JOB_LABELS = {
  SUCCESS: "Succès",
  ERROR: "Erreur",
  RUNNING: "En cours",
  PENDING: "Attente",
} as const

export default async function ConsolePage() {
  const jobs = await prisma.job.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const jobCounts = {
    SUCCESS: jobs.filter((j) => j.state === "SUCCESS").length,
    ERROR: jobs.filter((j) => j.state === "ERROR").length,
    RUNNING: jobs.filter((j) => j.state === "RUNNING").length,
    PENDING: jobs.filter((j) => j.state === "PENDING").length,
  }
  const slices: ChartSlice[] = (
    ["SUCCESS", "ERROR", "RUNNING", "PENDING"] as const
  )
    .map((state) => ({
      id: state,
      label: JOB_LABELS[state],
      value: jobCounts[state],
      color: JOB_COLORS[state],
      href: "/console",
    }))
    .filter((s) => s.value > 0)

  const total = jobs.length
  const successRate =
    total === 0 ? 0 : Math.round((jobCounts.SUCCESS / total) * 100)

  const successDurations = jobs
    .filter(
      (j) =>
        j.state === "SUCCESS" &&
        j.startedAt != null &&
        j.finishedAt != null,
    )
    .map((j) => j.finishedAt!.getTime() - j.startedAt!.getTime())
    .filter((ms) => ms > 0)
  const avgSuccessMs =
    successDurations.length === 0
      ? null
      : successDurations.reduce((sum, ms) => sum + ms, 0) /
        successDurations.length

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
      <ConsoleInsights
        slices={slices}
        successRate={successRate}
        avgSuccessMs={avgSuccessMs}
        total={total}
      />
      <ConsoleJobsList jobs={jobs} />
    </div>
  )
}
