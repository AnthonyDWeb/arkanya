"use client"

import type { Client, Job, JobEvent, JobTiming, Project } from "@arkanya/database"
import { ExternalLink, Wand2 } from "lucide-react"
import Link from "next/link"
import { useState, type ReactNode } from "react"
import { DeleteProjectButton } from "./delete-project-button"
import { ProjectEditForm } from "./project-edit-form"
import { ProjectRedeployButton } from "./project-redeploy-button"
import { ProjectBusinessPanel } from "./project-business-panel"
import { buildRepoName } from "@/lib/repo-name"

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
  TO_QUALIFY: "À QUALIFIER",
  IN_PROGRESS: "EN COURS",
  IN_REVIEW: "EN VALIDATION",
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
  PENDING: "En attente",
}

const STEP_LABELS: Record<string, string> = {
  initialize: "Initialisation",
  scaffold: "Scaffold du modèle",
  feature: "Installation des fonctionnalités",
  delivery: "Livraison",
  validate: "Validation",
}

const TIMING_CATEGORY_LABELS: Record<string, string> = {
  scaffold: "Scaffold",
  feature: "Fonctionnalité",
  validate: "Validation",
  delivery: "Livraison",
  initialize: "Initialisation",
}

function shortId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 8)}…` : id
}

function formatDurationShort(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.round((ms % 60_000) / 1000)
  return `${m}m ${s}s`
}

function MetaRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-2 items-baseline py-1 border-b border-white/[0.05] last:border-0">
      <span className="metric text-[10px] text-zinc-400">{label}</span>
      <div className="text-[12px] text-zinc-200 min-w-0 break-all">{children}</div>
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
  const isLive = Boolean(project.url && project.generated)

  return (
    <div>
      <div className="px-4 lg:px-6 pt-4 pb-3 border-b border-white/[0.04]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="metric text-[9px] tracking-[0.14em] text-zinc-500 uppercase">
                Projet
              </span>
              {isLive && (
                <span className="metric text-[9px] tracking-[0.12em] text-gold uppercase px-1.5 py-px rounded-full bg-gold/10">
                  En ligne
                </span>
              )}
            </div>
            <h1 className="page-title truncate">{project.name}</h1>
            {project.description && (
              <p className="text-xs text-zinc-500 mt-1.5 max-w-xl line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                title="Ouvrir le site"
                aria-label="Ouvrir le site"
                className="p-2 rounded-full bg-brand/12 text-brand hover:bg-brand/22 transition-colors duration-140"
              >
                <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
              </a>
            )}
            <DeleteProjectButton slug={project.slug} name={project.name} variant="icon" />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-2.5">
          <span className="metric text-[10px] tracking-[0.12em] text-brand">
            {STATUS_LABELS[project.status] ?? project.status}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="metric text-[10px] tracking-[0.12em] text-zinc-500 uppercase">
            {kind === "client" ? project.client?.company ?? "Client" : "Produit"}
          </span>
          <span className="text-zinc-700">·</span>
          <span className="metric text-[10px] tracking-wide text-zinc-500">
            {project.type}
          </span>
          {project.port != null && (
            <>
              <span className="text-zinc-700">·</span>
              <span className="metric text-[10px] text-zinc-500">:{project.port}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex border-b border-white/[0.04] px-4 lg:px-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-2.5 lg:px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors duration-140 shrink-0",
              activeTab === tab.id
                ? "border-brand text-white font-display font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3 lg:p-4">
        {activeTab === "overview" && (
          <div className="space-y-3 max-w-md">
            <div className="flex items-center justify-between gap-2">
              <h2 className="metric text-[10px] text-zinc-400">Fiche</h2>
              <ProjectEditForm
                slug={project.slug}
                initial={{
                  name: project.name,
                  description: project.description,
                  nextAction: project.nextAction,
                  url: project.url,
                  port: project.port,
                  status: project.status,
                }}
              />
            </div>

            {project.description ? (
              <p className="text-[12px] text-zinc-300 leading-snug">{project.description}</p>
            ) : (
              <p className="text-[12px] text-zinc-500">Aucune description</p>
            )}

            <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-2.5 py-1">
              <MetaRow label="Slug">
                <code className="metric text-[11px] text-zinc-300">{project.slug}</code>
              </MetaRow>
              <MetaRow label="Statut">
                {STATUS_LABELS[project.status] ?? project.status}
              </MetaRow>
              <MetaRow label="Généré">
                {project.generated ? (
                  <span className="text-brand">Oui</span>
                ) : (
                  "Non"
                )}
              </MetaRow>
              {project.url && (
                <MetaRow label="URL">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline break-all"
                  >
                    {project.url}
                  </a>
                </MetaRow>
              )}
              {project.nextAction && (
                <MetaRow label="Suite">{project.nextAction}</MetaRow>
              )}
              {project.port != null && (
                <MetaRow label="Port">
                  <code className="metric text-[11px]">{project.port}</code>
                </MetaRow>
              )}
            </div>

            <div>
              <h2 className="metric text-[10px] text-zinc-400 mb-1.5">Stack</h2>
              {project.technologies.length === 0 ? (
                <p className="text-[12px] text-zinc-500">Aucune pour l’instant</p>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="metric text-[10px] px-1.5 py-0.5 rounded-md bg-elevated text-zinc-300 border border-white/[0.05]"
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
          <div className="space-y-3 max-w-md">
            <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-2.5 py-1">
              <MetaRow label="Type">
                {kind === "client" ? "Client" : "Produit"}
              </MetaRow>
              <MetaRow label="Modèle">
                <code className="metric text-[11px] text-zinc-300">{project.type}</code>
              </MetaRow>
              <MetaRow label="Chemin">
                <code className="metric text-[11px] text-zinc-300">{project.destination}</code>
              </MetaRow>
              <MetaRow label="Proprio">{project.owner}</MetaRow>
              {project.port != null && (
                <MetaRow label="Port">
                  <code className="metric text-[11px]">{project.port}</code>
                </MetaRow>
              )}
            </div>

            {lastJob && (
              <div>
                <h2 className="metric text-[10px] text-zinc-400 mb-1.5">Dernier job</h2>
                <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-2.5 py-2 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12px] text-zinc-200">{lastJob.action}</p>
                    <p
                      className="metric text-[10px] text-zinc-500 truncate"
                      title={lastJob.externalId}
                    >
                      {shortId(lastJob.externalId)}
                    </p>
                  </div>
                  <span
                    className={`metric text-[10px] shrink-0 ${JOB_STATE_COLORS[lastJob.state] ?? "text-zinc-500"}`}
                  >
                    {JOB_STATE_LABELS[lastJob.state] ?? lastJob.state}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/builder"
              className="inline-flex items-center gap-1.5 text-brand hover:opacity-80 transition-opacity duration-140"
            >
              <Wand2 className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="text-[12px] font-medium">Ouvrir le Builder</span>
            </Link>
          </div>
        )}

        {activeTab === "deployment" && (
          <div className="space-y-3 max-w-md">
            <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-2.5 py-1">
              <MetaRow label="GitHub">
                {project.generated ? (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline metric text-[11px]"
                  >
                    {githubOwner}/{repoName}
                  </a>
                ) : (
                  <span className="text-zinc-500">Pas encore généré</span>
                )}
              </MetaRow>
              <MetaRow label="Vercel">
                {project.generated ? (
                  <a
                    href={vercelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline metric text-[11px]"
                  >
                    {repoName}
                  </a>
                ) : (
                  <span className="text-zinc-500">Pas encore déployé</span>
                )}
              </MetaRow>
              <MetaRow label="Prod">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand hover:underline break-all"
                  >
                    {project.url}
                  </a>
                ) : (
                  <span className="text-zinc-500">—</span>
                )}
              </MetaRow>
              {deliveryEvent?.message && (
                <MetaRow label="Livraison">{deliveryEvent.message}</MetaRow>
              )}
            </div>

            <div className="flex flex-wrap items-start gap-2">
              <ProjectRedeployButton slug={project.slug} />
              <Link
                href="/builder"
                title="Via Builder"
                aria-label="Via Builder"
                className="inline-flex items-center justify-center p-2 border border-white/[0.08] text-zinc-300 rounded-lg hover:border-brand/40 hover:text-brand transition-colors duration-140"
              >
                <Wand2 className="w-3.5 h-3.5" strokeWidth={2} />
              </Link>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Voir le site"
                  aria-label="Voir le site"
                  className="inline-flex items-center justify-center p-2 border border-white/[0.08] text-zinc-300 rounded-lg hover:border-brand/40 hover:text-brand transition-colors duration-140"
                >
                  <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                </a>
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div>
            {project.jobs.length === 0 ? (
              <p className="text-sm text-zinc-500">Aucun job pour ce projet</p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-4xl">
                {project.jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-white/[0.08] bg-surface/80 overflow-hidden min-w-0"
                  >
                    <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 border-b border-white/[0.06]">
                      <div className="min-w-0">
                        <span className="text-[12px] font-medium text-zinc-100">
                          {job.action}
                        </span>
                        <p
                          className="metric text-[10px] text-zinc-500 truncate"
                          title={job.externalId}
                        >
                          {shortId(job.externalId)}
                        </p>
                      </div>
                      <span
                        className={`metric text-[10px] shrink-0 ${JOB_STATE_COLORS[job.state] ?? "text-zinc-500"}`}
                      >
                        {JOB_STATE_LABELS[job.state] ?? job.state}
                      </span>
                    </div>

                    {job.events.length > 0 && (
                      <div className="px-2 py-1 space-y-0.5">
                        {job.events.map((event) => (
                          <div
                            key={event.id}
                            className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-2 items-center py-0.5"
                          >
                            <span
                              className={[
                                "status-dot shrink-0",
                                event.state === "SUCCESS"
                                  ? "text-success"
                                  : event.state === "ERROR"
                                    ? "text-danger"
                                    : "text-zinc-600",
                              ].join(" ")}
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] text-zinc-200 truncate">
                                {STEP_LABELS[event.stepType] ?? event.stepType}
                              </p>
                              {event.message && (
                                <p
                                  className="text-[10px] text-zinc-500 truncate"
                                  title={event.message}
                                >
                                  {event.message}
                                </p>
                              )}
                            </div>
                            {event.durationMs !== null && (
                              <span className="metric text-[10px] text-zinc-400 tabular-nums shrink-0">
                                {formatDurationShort(event.durationMs)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "timings" && (
          <div>
            {project.jobs.filter((j) => j.timings.length > 0).length === 0 ? (
              <p className="text-sm text-zinc-500">
                Aucun timing. Lancez une génération pour collecter des données.
              </p>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-w-4xl">
                {project.jobs
                  .filter((j) => j.timings.length > 0)
                  .map((job) => {
                    const totalMs = job.timings.reduce((s, t) => s + t.durationMs, 0)
                    const byCategory: Record<string, typeof job.timings> = {}
                    for (const t of job.timings) {
                      byCategory[t.category] = [...(byCategory[t.category] ?? []), t]
                    }
                    return (
                      <div
                        key={job.id}
                        className="rounded-xl border border-white/[0.08] bg-surface/80 overflow-hidden min-w-0"
                      >
                        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 border-b border-white/[0.06]">
                          <div className="min-w-0">
                            <span className="text-[12px] font-medium text-zinc-100">
                              {job.action}
                            </span>
                            <p
                              className="metric text-[10px] text-zinc-500 truncate"
                              title={job.externalId}
                            >
                              {shortId(job.externalId)}
                            </p>
                          </div>
                          <span className="metric text-[12px] text-brand tabular-nums shrink-0">
                            {formatDurationShort(totalMs)}
                          </span>
                        </div>
                        <div className="px-2.5 py-1.5 space-y-1.5">
                          {Object.entries(byCategory).map(([category, entries]) => (
                            <div key={category}>
                              <p className="metric text-[10px] text-zinc-400 mb-0.5">
                                {TIMING_CATEGORY_LABELS[category] ?? category}
                              </p>
                              <div className="space-y-px">
                                {entries.map((t) => (
                                  <div
                                    key={t.id}
                                    className="flex justify-between gap-2 text-[11px]"
                                  >
                                    <span className="text-zinc-300 truncate">{t.label}</span>
                                    <span className="metric text-zinc-400 tabular-nums shrink-0">
                                      {formatDurationShort(t.durationMs)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}

        {activeTab === "business" && (
          <div className="space-y-3 max-w-md">
            <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-2.5 py-1">
              <MetaRow label="Client">
                {project.client
                  ? project.client.company || project.client.name
                  : "Produit interne"}
              </MetaRow>
              {project.client && (
                <>
                  <MetaRow label="Contact">
                    {project.client.contact || "—"}
                  </MetaRow>
                  <MetaRow label="Statut">
                    {project.client.status || "—"}
                  </MetaRow>
                </>
              )}
              <MetaRow label="Créé">
                {new Date(project.createdAt).toLocaleDateString("fr-FR")}
              </MetaRow>
            </div>
            <ProjectBusinessPanel
              templateId={project.type}
              clientCompany={project.client?.company ?? null}
            />
          </div>
        )}
      </div>
    </div>
  )
}
