"use client"

import { useState } from "react"
import type { Job, Project } from "@prisma/client"

type JobWithProject = Job & { project: Project }

type ConsoleTabsProps = {
  jobs: JobWithProject[]
}

type Tab = "jobs" | "maintenance"

const JOB_STATE_COLORS: Record<string, string> = {
  SUCCESS: "bg-emerald-500/15 text-emerald-400",
  ERROR: "bg-red-500/15 text-red-400",
  RUNNING: "bg-blue-500/15 text-blue-400",
  PENDING: "bg-zinc-700 text-zinc-400",
}

function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ConsoleTabs({ jobs }: ConsoleTabsProps) {
  const [tab, setTab] = useState<Tab>("jobs")

  return (
    <div>
      <div className="flex border-b border-zinc-800 px-4 lg:px-6">
        {(["jobs", "maintenance"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "px-3 lg:px-4 py-3 text-sm font-medium border-b-2 -mb-px capitalize transition-colors duration-[120ms] ease-out",
              tab === t
                ? "border-brand text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
          >
            {t === "jobs" ? "Jobs" : "Maintenance"}
          </button>
        ))}
      </div>

      <div className="p-4 lg:p-6">
        {tab === "jobs" && (
          <>
            {jobs.length === 0 ? (
              <p className="text-sm text-zinc-600">Aucun job</p>
            ) : (
              <div className="space-y-2">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-zinc-200 truncate">{job.project.name}</p>
                      <p className="text-xs text-zinc-500 font-mono mt-0.5">
                        {job.action} · {formatDate(job.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded shrink-0 ml-3 ${JOB_STATE_COLORS[job.state] ?? "bg-zinc-700 text-zinc-400"}`}
                    >
                      {job.state}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "maintenance" && (
          <p className="text-sm text-zinc-600">Disponible prochainement</p>
        )}
      </div>
    </div>
  )
}
