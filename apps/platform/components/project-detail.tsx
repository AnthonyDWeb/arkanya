"use client"

import type { Client, Job, JobEvent, JobTiming, Project } from "@arkanya/database"
import { useState, type ReactNode } from "react"
import Link from "next/link"
import { DeleteProjectButton } from "./delete-project-button"
import { buildRepoName } from "@/lib/repo-name"

function formatMsVerbose(ms: number): string {
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  const rem = ms % 1000
  if (min > 0) return `${min}m ${sec}s ${rem}ms`
  if (sec > 0) return `${sec}s ${rem}ms`
  return `${rem}ms`
}

type ProjectWithRelations = Project & {
  client: Client | null
  jobs: (Job & { events: JobEvent[]; timings: JobTiming[] })[]
}

type ProjectDetailProps = {
  project: ProjectWithRelations
  githubOwner: string
}

type Tab = "overview" | "development" | "deployment" | "activity" | "timings" | "business"

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Vue générale" },
  { id: "development", label: "Développement" },
  { id: "deployment", label: "Déploiement" },
  { id: "activity", label: "Activité" },
  { id: "timings", label: "Timings" },
  { id: "business", label: "Business" },
]

const STATUS_LABELS: Record<string, string> = {
  TO_QUALIFY: "À qualifier",
  IN_PROGRESS: "En cours",
  IN_REVIEW: "En validation",
}

const JOB_STATE_COLORS: Record<string, string> = {
  SUCCESS: "bg-emerald-500/15 text-emerald-400",
  ERROR: "bg-red-500/15 text-red-400",
  RUNNING: "bg-blue-500/15 text-blue-400",
  PENDING: "bg-zinc-700 text-zinc-400",
}

const STEP_LABELS: Record<string, string> = {
  initialize: "Initialisation",
  scaffold: "Scaffold template",
  feature: "Installation features",
  delivery: "Livraison",
  validate: "Validation",
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4 py-2.5 border-b border-zinc-800/80 last:border-0">
      <span className="text-xs text-zinc-500 w-32 shrink-0">{label}</span>
      <div className="text-sm text-zinc-300 min-w-0 break-all">{children}</div>
    </div>
  )
}

export function ProjectDetail({ project, githubOwner }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const repoName = buildRepoName(project)
  const githubUrl = `https://github.com/${githubOwner}/${repoName}`
  const vercelUrl = `https://vercel.com/${githubOwner}/${repoName}`
  const lastJob = project.jobs[0]
  const deliveryEvent = lastJob?.events.find((e) => e.stepType === "delivery")
  const kind = project.destination.startsWith("clients/") ? "client" : "product"

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex items-center border-b border-zinc-800">
        <div className="flex items-center justify-between gap-4 w-full">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100 leading-none">{project.name}</h1>
            <p className="text-xs text-zinc-500 mt-1">
              {project.client?.company ?? "Interne"} · {project.type}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-brand/20 text-brand-light rounded hover:opacity-90 transition-opacity duration-[120ms] ease-out"
              >
                Ouvrir →
              </a>
            )}
            <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
              {STATUS_LABELS[project.status] ?? project.status}
            </span>
            <DeleteProjectButton slug={project.slug} name={project.name} variant="icon" />
          </div>
        </div>
      </div>

      <div className="flex border-b border-zinc-800 px-4 lg:px-6 overflow-x-auto scrollbar-none">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-3 lg:px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors duration-[120ms] ease-out shrink-0",
              activeTab === tab.id
                ? "border-brand text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 lg:p-6">
        {activeTab === "overview" && (
          <div className="space-y-6 max-w-2xl">
            {project.description ? (
              <div>
                <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Description
                </h2>
                <p className="text-sm text-zinc-300">{project.description}</p>
              </div>
            ) : (
              <p className="text-sm text-zinc-600">Aucune description</p>
            )}

            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 px-4">
              <MetaRow label="Slug">
                <code className="text-xs font-mono text-zinc-400">{project.slug}</code>
              </MetaRow>
              <MetaRow label="Statut">
                {STATUS_LABELS[project.status] ?? project.status}
              </MetaRow>
              <MetaRow label="Généré">
                {project.generated ? "Oui" : "Non"}
              </MetaRow>
              {project.url && (
                <MetaRow label="URL">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    {project.url}
                  </a>
                </MetaRow>
              )}
              {project.nextAction && (
                <MetaRow label="Prochaine action">{project.nextAction}</MetaRow>
              )}
              {project.port != null && (
                <MetaRow label="Port">
                  <code className="text-xs font-mono">{project.port}</code>
                </MetaRow>
              )}
            </div>

            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Technologies
              </h2>
              {project.technologies.length === 0 ? (
                <p className="text-sm text-zinc-600">Aucune pour l’instant</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "development" && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 px-4">
              <MetaRow label="Kind">{kind}</MetaRow>
              <MetaRow label="Template">
                <code className="text-xs font-mono text-zinc-400">{project.type}</code>
              </MetaRow>
              <MetaRow label="Destination">
                <code className="text-xs font-mono text-zinc-400">{project.destination}</code>
              </MetaRow>
              <MetaRow label="Owner">{project.owner}</MetaRow>
              {project.port != null && (
                <MetaRow label="Port local">
                  <code className="text-xs font-mono">{project.port}</code>
                </MetaRow>
              )}
            </div>

            <div>
              <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                Stack
              </h2>
              {project.technologies.length === 0 ? (
                <p className="text-sm text-zinc-600">
                  Remplie après une génération réussie.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-zinc-800 text-zinc-300 rounded font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {lastJob && (
              <div>
                <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  Dernier job
                </h2>
                <div className="p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-300">{lastJob.action}</p>
                    <p className="text-xs text-zinc-600 font-mono truncate">{lastJob.externalId}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded shrink-0 ${JOB_STATE_COLORS[lastJob.state] ?? "bg-zinc-700 text-zinc-400"}`}
                  >
                    {lastJob.state}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/builder"
              className="inline-flex text-sm text-brand hover:underline"
            >
              Ouvrir le Builder →
            </Link>
          </div>
        )}

        {activeTab === "deployment" && (
          <div className="space-y-6 max-w-2xl">
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 px-4">
              <MetaRow label="Repo GitHub">
                {project.generated ? (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline font-mono text-xs"
                  >
                    {githubOwner}/{repoName}
                  </a>
                ) : (
                  <span className="text-zinc-600">Pas encore généré</span>
                )}
              </MetaRow>
              <MetaRow label="Vercel">
                {project.generated ? (
                  <a
                    href={vercelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline font-mono text-xs"
                  >
                    {repoName}
                  </a>
                ) : (
                  <span className="text-zinc-600">Pas encore déployé</span>
                )}
              </MetaRow>
              <MetaRow label="URL prod">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline"
                  >
                    {project.url}
                  </a>
                ) : (
                  <span className="text-zinc-600">—</span>
                )}
              </MetaRow>
              {deliveryEvent?.message && (
                <MetaRow label="Dernière livraison">{deliveryEvent.message}</MetaRow>
              )}
            </div>

            {lastJob && (
              <div className="p-3 bg-zinc-800/40 border border-zinc-700/40 rounded-lg flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Dernier job</p>
                  <p className="text-sm text-zinc-300">{lastJob.action}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded ${JOB_STATE_COLORS[lastJob.state] ?? "bg-zinc-700 text-zinc-400"}`}
                >
                  {lastJob.state}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Link
                href="/builder"
                className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out hover:opacity-90"
              >
                Relancer via Builder
              </Link>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded-lg text-sm transition-colors duration-[120ms] ease-out hover:border-zinc-500"
                >
                  Voir le site
                </a>
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="max-w-2xl space-y-4">
            {project.jobs.length === 0 ? (
              <p className="text-sm text-zinc-600">Aucun job pour ce projet</p>
            ) : (
              project.jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/40">
                    <div>
                      <span className="text-sm font-medium text-zinc-300">{job.action}</span>
                      <p className="text-xs text-zinc-600 font-mono mt-0.5">{job.externalId}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${JOB_STATE_COLORS[job.state] ?? "bg-zinc-700 text-zinc-400"}`}
                    >
                      {job.state}
                    </span>
                  </div>

                  {job.events.length > 0 && (
                    <div className="divide-y divide-zinc-800">
                      {job.events.map((event) => (
                        <div key={event.id} className="flex items-start gap-3 px-4 py-2.5">
                          <div className="mt-0.5 shrink-0">
                            {event.state === "SUCCESS" && (
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <svg viewBox="0 0 10 8" className="w-2 h-2 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M1 4l3 3 5-6" />
                                </svg>
                              </div>
                            )}
                            {event.state === "ERROR" && (
                              <div className="w-3.5 h-3.5 rounded-full bg-red-500/20 flex items-center justify-center">
                                <svg viewBox="0 0 8 8" className="w-2 h-2 text-red-400" fill="none" stroke="currentColor" strokeWidth="2.5">
                                  <path d="M1 1l6 6M7 1l-6 6" />
                                </svg>
                              </div>
                            )}
                            {event.state === "SKIPPED" && (
                              <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-4">
                              <span className="text-xs font-medium text-zinc-400">
                                {STEP_LABELS[event.stepType] ?? event.stepType}
                              </span>
                              {event.durationMs !== null && (
                                <span className="text-xs text-zinc-700 tabular-nums shrink-0">
                                  {event.durationMs < 1000
                                    ? `${event.durationMs}ms`
                                    : `${(event.durationMs / 1000).toFixed(1)}s`}
                                </span>
                              )}
                            </div>
                            {event.message && (
                              <p className="text-xs text-zinc-600 mt-0.5 truncate">{event.message}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "timings" && (
          <div className="max-w-2xl space-y-6">
            {project.jobs.filter((j) => j.timings.length > 0).length === 0 ? (
              <p className="text-sm text-zinc-600">
                Aucun timing enregistré. Lancez une génération pour collecter des données.
              </p>
            ) : (
              project.jobs
                .filter((j) => j.timings.length > 0)
                .map((job) => {
                  const totalMs = job.timings.reduce((s, t) => s + t.durationMs, 0)
                  const byCategory: Record<string, typeof job.timings> = {}
                  for (const t of job.timings) {
                    byCategory[t.category] = [...(byCategory[t.category] ?? []), t]
                  }
                  return (
                    <div key={job.id} className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/40">
                        <div>
                          <span className="text-sm font-medium text-zinc-300">{job.action}</span>
                          <p className="text-xs text-zinc-600 font-mono mt-0.5">{job.externalId}</p>
                        </div>
                        <span className="text-xs font-mono text-zinc-300">
                          {formatMsVerbose(totalMs)}
                        </span>
                      </div>
                      <div className="divide-y divide-zinc-800">
                        {Object.entries(byCategory).map(([category, entries]) => (
                          <div key={category} className="px-4 py-3">
                            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                              {category}
                            </p>
                            <div className="space-y-1.5">
                              {entries.map((t) => (
                                <div key={t.id} className="flex justify-between text-xs">
                                  <span className="text-zinc-400">{t.label}</span>
                                  <span className="text-zinc-300 font-mono">{formatMsVerbose(t.durationMs)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        )}

        {activeTab === "business" && (
          <div className="max-w-2xl space-y-4">
            <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 px-4">
              <MetaRow label="Client">
                {project.client ? project.client.company || project.client.name : "Produit interne"}
              </MetaRow>
              {project.client && (
                <>
                  <MetaRow label="Contact">
                    {project.client.contact || "—"}
                  </MetaRow>
                  <MetaRow label="Statut client">
                    {project.client.status || "—"}
                  </MetaRow>
                </>
              )}
              <MetaRow label="Créé le">
                {new Date(project.createdAt).toLocaleDateString("fr-FR")}
              </MetaRow>
            </div>
            <p className="text-xs text-zinc-600">
              Devis, facturation et suivi commercial arriveront quand le modèle métier sera cadré.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
