"use client"

import { ExternalLink, Wand2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeleteProjectButton } from "./delete-project-button"
import { ProjectRedeployButton } from "./project-redeploy-button"
import { ProjectBusinessPanel } from "./project-business-panel"
import { ProjectFiche } from "./project-fiche"
import { EmptyState } from "@/components/ui/empty-state"
import { MetaRow } from "@/components/ui/meta-row"
import { SurfacePanel } from "@/components/ui/surface-panel"
import { buildRepoName } from "@/lib/repo-name"
import {
  formatDurationShort,
  jobActionLabel,
  JOB_STATE_COLORS,
  JOB_STATE_LABELS_LONG,
  shortId,
  STEP_LABELS,
  TIMING_CATEGORY_LABELS,
} from "@/lib/jobs/labels"
import { PROJECT_ENVIRONMENT_LABELS } from "@/lib/projects/environment"
import { PROJECT_STATUS_LABELS } from "@/lib/projects/status"
import type { ProjectDetailTab, ProjectWithRelations } from "@/types/projects"

type ProjectDetailProps = {
  project: ProjectWithRelations
  githubOwner: string
}

const TABS: { id: ProjectDetailTab; label: string }[] = [
  { id: "fiche", label: "Fiche" },
  { id: "livraison", label: "Livraison" },
  { id: "pipeline", label: "Suivi" },
  { id: "offre", label: "Offre" },
]

export function ProjectDetail({ project, githubOwner }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<ProjectDetailTab>("fiche")
  const repoName = buildRepoName(project)
  const githubUrl = `https://github.com/${githubOwner}/${repoName}`
  const vercelUrl = `https://vercel.com/${githubOwner}/${repoName}`
  const lastJob = project.jobs[0]
  const deliveryEvent = lastJob?.events.find((e) => e.stepType === "delivery")
  const kind = project.destination.startsWith("clients/") ? "client" : "product"
  const envTone =
    project.environment === "PRODUCTION"
      ? "text-gold bg-gold/10"
      : project.environment === "ONLINE"
        ? "text-brand bg-brand/10"
        : "text-zinc-400 bg-white/[0.04]"

  const jobsWithTimings = project.jobs.filter((j) => j.timings.length > 0)

  return (
    <div>
      <div className="px-4 lg:px-6 pt-4 pb-3 border-b border-white/[0.04]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="metric text-[9px] tracking-[0.14em] text-zinc-500 uppercase">
                Projet
              </span>
              <span
                className={`metric text-[9px] tracking-[0.12em] uppercase px-1.5 py-px rounded-full ${envTone}`}
              >
                {PROJECT_ENVIRONMENT_LABELS[project.environment]}
              </span>
            </div>
            <h1 className="page-title break-words">{project.name}</h1>
            {project.description && (
              <p className="text-xs text-zinc-500 mt-1.5 max-w-xl line-clamp-1 sm:line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              title="Ouvrir le site"
              aria-label="Ouvrir le site"
              className="p-2.5 min-h-11 min-w-11 inline-flex items-center justify-center rounded-full bg-brand/12 text-brand hover:bg-brand/22 transition-colors duration-140 shrink-0 touch-manipulation"
            >
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
            </a>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-2">
          <span className="metric text-[10px] tracking-[0.12em] text-brand">
            {PROJECT_STATUS_LABELS[project.status] ?? project.status}
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

      <div className="tabs-rail border-b border-white/[0.04] px-2 sm:px-4 lg:px-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={[
              "px-2.5 sm:px-3 min-h-11 py-2.5 text-[11px] sm:text-xs font-medium border-b-2 -mb-px transition-colors duration-140 shrink-0 touch-manipulation",
              activeTab === tab.id
                ? "border-brand text-white font-display font-semibold"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3 sm:p-4 lg:p-4">
        {activeTab === "fiche" && (
          <div className="max-w-4xl space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:items-stretch">
              <div className="min-w-0 lg:h-full">
                <ProjectFiche project={project} />
              </div>

              <div className="flex flex-col gap-2.5 min-w-0 lg:h-full">
                <SurfacePanel padded>
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
                </SurfacePanel>

                <div>
                  <h2 className="metric text-[10px] text-zinc-400 mb-1">Technos</h2>
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

                {lastJob && (
                  <div>
                    <h2 className="metric text-[10px] text-zinc-400 mb-1">Dernier job</h2>
                    <SurfacePanel className="!divide-y-0">
                      <div className="px-2.5 py-1.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[12px] text-zinc-200">
                            {jobActionLabel(lastJob.action)}
                          </p>
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
                          {JOB_STATE_LABELS_LONG[lastJob.state] ?? lastJob.state}
                        </span>
                      </div>
                    </SurfacePanel>
                  </div>
                )}

                <div className="flex justify-center lg:mt-auto lg:pt-6 pt-1">
                  <Link
                    href="/builder"
                    className="slab inline-flex w-full sm:w-auto items-center justify-center gap-1.5 !px-3 !py-2.5 text-[12px] touch-manipulation"
                  >
                    <Wand2 className="w-3.5 h-3.5" strokeWidth={2} />
                    Ouvrir le Builder
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <DeleteProjectButton
                slug={project.slug}
                name={project.name}
                variant="label"
              />
            </div>
          </div>
        )}

        {activeTab === "livraison" && (
          <div className="space-y-3 max-w-md">
            <SurfacePanel padded>
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
            </SurfacePanel>

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

        {activeTab === "pipeline" && (
          <div className="space-y-4 max-w-4xl">
            <div>
              <h2 className="metric text-[10px] text-zinc-400 mb-2">Activité</h2>
              {project.jobs.length === 0 ? (
                <EmptyState
                  title="Aucun job"
                  description="Lance une génération pour voir l’activité ici."
                  actionHref="/builder"
                  actionLabel="Ouvrir le Builder →"
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {project.jobs.map((job) => (
                    <SurfacePanel key={job.id} className="min-w-0 !divide-y-0">
                      <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 border-b border-white/[0.06]">
                        <div className="min-w-0">
                          <span className="text-[12px] font-medium text-zinc-100">
                            {jobActionLabel(job.action)}
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
                          {JOB_STATE_LABELS_LONG[job.state] ?? job.state}
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
                    </SurfacePanel>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="metric text-[10px] text-zinc-400 mb-2">Mesures</h2>
              {jobsWithTimings.length === 0 ? (
                <EmptyState
                  title="Aucune mesure"
                  description="Les timings apparaissent après une génération."
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                  {jobsWithTimings.map((job) => {
                    const totalMs = job.timings.reduce((s, t) => s + t.durationMs, 0)
                    const byCategory: Record<string, typeof job.timings> = {}
                    for (const t of job.timings) {
                      byCategory[t.category] = [...(byCategory[t.category] ?? []), t]
                    }
                    return (
                      <SurfacePanel key={job.id} className="min-w-0 !divide-y-0">
                        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 border-b border-white/[0.06]">
                          <div className="min-w-0">
                            <span className="text-[12px] font-medium text-zinc-100">
                              {jobActionLabel(job.action)}
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
                      </SurfacePanel>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "offre" && (
          <div className="space-y-3 max-w-md">
            <SurfacePanel padded>
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
            </SurfacePanel>
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
