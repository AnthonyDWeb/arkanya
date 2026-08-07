import { prisma } from "@arkanya/database/client"
import type { Metadata } from "next"
import { ConsoleTabs } from "@/components/console-tabs"

export const metadata: Metadata = { title: "Console" }
export const dynamic = "force-dynamic"

type ConsolePageProps = {
  searchParams: Promise<{ tab?: string }>
}

export default async function ConsolePage({ searchParams }: ConsolePageProps) {
  const [jobs, { tab }] = await Promise.all([
    prisma.job.findMany({
      include: { project: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    searchParams,
  ])
  const initialTab = tab === "maintenance" ? "maintenance" : "jobs"

  return (
    <div className="min-h-full animate-page-in">
      <header className="page-head">
        <div className="flex items-baseline gap-3 min-w-0">
          <h1 className="page-title">Console</h1>
          <span className="metric text-xs text-brand tabular-nums">
            {String(jobs.length).padStart(2, "0")}
          </span>
        </div>
      </header>
      <ConsoleTabs jobs={jobs} initialTab={initialTab} />
    </div>
  )
}
