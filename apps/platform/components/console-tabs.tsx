"use client"

import { useState } from "react"
import type { Job, Project } from "@arkanya/database"
import Link from "next/link"
import { MaintenancePanel } from "./maintenance-panel"

type JobWithProject = Job & { project: Project }

type Tab = "jobs" | "maintenance"

type ConsoleTabsProps = {
  jobs: JobWithProject[]
  initialTab?: Tab
}

const JOB_STATE_COLORS: Record<string, string> = {
  SUCCESS: "text-success",
  ERROR: "text-danger",
  RUNNING: "text-brand",
  PENDING: "text-zinc-500",
}

const JOB_STATE_LABELS: Record<string, string> = {
  SUCCESS: "Succès",
  ERROR: "Erreur",
  RUNNING: "En cours",
  PENDING: "Attente",
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

export function ConsoleTabs({ jobs, initialTab }: ConsoleTabsProps) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "jobs")

  return (
    <div>
      <div className="px-4 lg:px-6 flex justify-center lg:justify-start">
        <div className="segment-group segment-group-fit">
          {(["jobs", "maintenance"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              data-active={tab === t}
              onClick={() => setTab(t)}
              className="segment"
            >
              {t === "jobs" ? "Jobs" : "Maintenance"}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 flex justify-center lg:justify-start">
        {tab === "jobs" && (
          <div className="w-full max-w-md">
            {jobs.length === 0 ? (
              <p className="text-[12px] text-zinc-500">Aucun job</p>
            ) : (
              <div className="rounded-xl border border-white/[0.08] bg-surface/80 divide-y divide-white/[0.05] overflow-hidden">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/projects/${job.project.slug}`}
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-2.5 items-center px-2.5 py-2 hover:bg-brand/[0.06] transition-colors duration-140"
                  >
                    <span className="metric text-[9px] text-zinc-500 uppercase tracking-wide">
                      {job.action}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[12px] font-medium text-zinc-100 truncate">
                        {job.project.name}
                      </p>
                      <p className="metric text-[10px] text-zinc-500">
                        {formatDate(job.createdAt)}
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
              </div>
            )}
          </div>
        )}

        {tab === "maintenance" && <MaintenancePanel />}
      </div>
    </div>
  )
}
