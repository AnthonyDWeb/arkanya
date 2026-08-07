"use client"

import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"
import { SurfacePanel } from "@/components/ui/surface-panel"
import {
  formatJobDate,
  jobActionLabel,
  JOB_STATE_COLORS,
  JOB_STATE_LABELS,
} from "@/lib/jobs/labels"
import type { JobWithProject } from "@/types/projects"

type ConsoleJobsListProps = {
  jobs: JobWithProject[]
}

export function ConsoleJobsList({ jobs }: ConsoleJobsListProps) {
  return (
    <div className="px-4 lg:px-6 py-4">
      <div className="w-full max-w-md">
        {jobs.length === 0 ? (
          <EmptyState
            title="Aucun job"
            description="Les générations et redéploiements apparaissent ici."
            actionHref="/builder"
            actionLabel="Lancer le Builder →"
          />
        ) : (
          <SurfacePanel>
            {jobs.map((job) => (
              <Link
                key={job.id}
                href={`/projects/${job.project.slug}`}
                className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-2.5 items-center px-2.5 py-2 hover:bg-brand/[0.06] transition-colors duration-140"
              >
                <span className="metric text-[9px] text-zinc-500 uppercase tracking-wide">
                  {jobActionLabel(job.action)}
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-zinc-100 truncate">
                    {job.project.name}
                  </p>
                  <p className="metric text-[10px] text-zinc-500">
                    {formatJobDate(job.createdAt)}
                  </p>
                </div>
                <span
                  className={`metric text-[10px] flex items-center gap-1.5 shrink-0 ${JOB_STATE_COLORS[job.state] ?? "text-zinc-500"}`}
                >
                  <span
                    className={`status-dot ${JOB_STATE_COLORS[job.state] ?? "text-zinc-500"} ${job.state === "RUNNING" ? "animate-glow-pulse" : ""}`}
                  />
                  {JOB_STATE_LABELS[job.state] ?? job.state}
                </span>
              </Link>
            ))}
          </SurfacePanel>
        )}
      </div>
    </div>
  )
}

/** @deprecated Use ConsoleJobsList */
export function ConsoleTabs(props: ConsoleJobsListProps) {
  return <ConsoleJobsList {...props} />
}
