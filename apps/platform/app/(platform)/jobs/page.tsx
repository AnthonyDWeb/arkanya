import { prisma } from "@arkanya/database/client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Jobs" }
export const dynamic = "force-dynamic"

const JOB_STATE_COLORS: Record<string, string> = {
  SUCCESS: "bg-emerald-500/15 text-emerald-400",
  ERROR: "bg-red-500/15 text-red-400",
  RUNNING: "bg-blue-500/15 text-blue-400",
  PENDING: "bg-zinc-700 text-zinc-400",
}

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Jobs</h1>
        <p className="text-xs text-zinc-500 mt-0.5">{jobs.length} derniers jobs</p>
      </div>
      <div className="p-4 lg:p-6">
        {jobs.length === 0 ? (
          <p className="text-sm text-zinc-600">Aucun job</p>
        ) : (
          <div className="space-y-2">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg"
              >
                <div>
                  <p className="text-sm text-zinc-200">{job.project.name}</p>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{job.action}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${JOB_STATE_COLORS[job.state] ?? "bg-zinc-700 text-zinc-400"}`}
                >
                  {job.state}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
