import { prisma } from "@arkanya/database/client"
import {
  AttentionBoard,
  CardBlock,
  CatalogCoverage,
  DeliverySplit,
  DonutChart,
  InsightCard,
  ShareMap,
  StackedMeter,
} from "@/components/dashboard/insight-charts"
import { WorkerPulse } from "@/components/dashboard/worker-pulse"
import { topSlices, type ChartSlice } from "@/lib/dashboard/chart"
import {
  CATALOG_PALETTE,
  CLIENT_BAR_PALETTE,
  DEST_COLORS,
  JOB_COLORS,
  PIPELINE_COLORS,
} from "@/lib/dashboard/colors"
import { formatAge, formatDurationMs } from "@/lib/dashboard/format"
import { readCatalogueTemplates } from "@/lib/catalogue/load-manifests"
import Link from "next/link"
import { Wand2 } from "lucide-react"

export const dynamic = "force-dynamic"

const JOB_LABELS = {
  SUCCESS: "Succès",
  ERROR: "Erreur",
  RUNNING: "En cours",
  PENDING: "Attente",
} as const

type AttentionItem = {
  id: string
  projectKey: string
  label: string
  href: string
  detail: string
  tone: "danger" | "warn" | "muted"
  priority: number
}

export default async function OverviewPage() {
  const [projects, clients, jobs, errorJobs, featureBenchmarks, templates] =
    await Promise.all([
      prisma.project.findMany({
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          type: true,
          nextAction: true,
          generated: true,
          url: true,
          destination: true,
          clientId: true,
          updatedAt: true,
          jobs: {
            select: {
              state: true,
              finishedAt: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.client.findMany({
        select: {
          id: true,
          name: true,
          company: true,
          _count: { select: { projects: true } },
        },
      }),
      prisma.job.findMany({
        select: {
          state: true,
          startedAt: true,
          finishedAt: true,
        },
      }),
      prisma.job.findMany({
        where: { state: "ERROR" },
        select: {
          id: true,
          projectSlug: true,
          action: true,
          finishedAt: true,
          createdAt: true,
          project: { select: { id: true, name: true } },
          events: {
            where: { state: "ERROR" },
            select: { message: true },
            orderBy: { startedAt: "desc" },
            take: 1,
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.timingBenchmark.findMany({
        where: { category: "feature" },
        select: { key: true, label: true, sampleCount: true },
        orderBy: { sampleCount: "desc" },
        take: 3,
      }),
      readCatalogueTemplates(),
    ])

  const counts = {
    total: projects.length,
    queue: projects.filter((p) => p.status === "TO_QUALIFY").length,
    build: projects.filter((p) => p.status === "IN_PROGRESS").length,
    check: projects.filter((p) => p.status === "IN_REVIEW").length,
    live: projects.filter((p) => p.generated && Boolean(p.url)).length,
  }

  const undelivered = projects.filter((p) => !p.generated || !p.url)
  const orphans = projects.filter((p) => p.clientId == null)
  const destClients = projects.filter((p) => p.destination.startsWith("clients/")).length
  const destProducts = projects.filter((p) =>
    p.destination.startsWith("products/"),
  ).length

  const nextActions = projects
    .filter((p) => Boolean(p.nextAction?.trim()))
    .slice(0, 2)

  const pipelineSlices: ChartSlice[] = [
    {
      id: "TO_QUALIFY",
      label: "File",
      value: counts.queue,
      color: PIPELINE_COLORS.TO_QUALIFY,
    },
    {
      id: "IN_PROGRESS",
      label: "En cours",
      value: counts.build,
      color: PIPELINE_COLORS.IN_PROGRESS,
    },
    {
      id: "IN_REVIEW",
      label: "Revue",
      value: counts.check,
      color: PIPELINE_COLORS.IN_REVIEW,
    },
  ]

  const jobCounts = {
    SUCCESS: jobs.filter((j) => j.state === "SUCCESS").length,
    ERROR: jobs.filter((j) => j.state === "ERROR").length,
    RUNNING: jobs.filter((j) => j.state === "RUNNING").length,
    PENDING: jobs.filter((j) => j.state === "PENDING").length,
  }
  const jobSlices: ChartSlice[] = (
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
  const jobTotal = jobs.length
  const successRate =
    jobTotal === 0 ? 0 : Math.round((jobCounts.SUCCESS / jobTotal) * 100)

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
      : successDurations.reduce((sum, ms) => sum + ms, 0) / successDurations.length

  const clientSlices = topSlices(
    clients
      .filter((c) => c._count.projects > 0)
      .map((client, index) => ({
        id: client.id,
        label: client.company || client.name,
        value: client._count.projects,
        color: CLIENT_BAR_PALETTE[index % CLIENT_BAR_PALETTE.length]!,
        href: `/clients/${client.id}`,
      })),
    5,
  )

  const templateUsage = new Map<string, number>()
  for (const project of projects) {
    templateUsage.set(project.type, (templateUsage.get(project.type) ?? 0) + 1)
  }
  const templateNameById = new Map(templates.map((t) => [t.id, t.name]))
  const usedTemplateCount = templates.filter((t) => templateUsage.has(t.id)).length
  const templateSlices = topSlices(
    [...templateUsage.entries()].map(([id, value], index) => ({
      id,
      label: templateNameById.get(id) ?? id,
      value,
      color: CATALOG_PALETTE[index % CATALOG_PALETTE.length]!,
      href: "/catalogue",
    })),
    5,
  )

  const destinationSlices: ChartSlice[] = [
    {
      id: "clients",
      label: "Clients",
      value: destClients,
      color: DEST_COLORS.clients,
    },
    {
      id: "products",
      label: "Produits",
      value: destProducts,
      color: DEST_COLORS.products,
    },
  ].filter((s) => s.value > 0)

  const now = Date.now()

  const attentionRaw: AttentionItem[] = []

  for (const job of errorJobs) {
    attentionRaw.push({
      id: `err-${job.id}`,
      projectKey: job.project.id,
      label: job.project.name,
      href: `/projects/${job.projectSlug}`,
      detail: `Erreur · ${job.events[0]?.message?.slice(0, 48) ?? job.action} · ${formatAge(job.finishedAt ?? job.createdAt, now)}`,
      tone: "danger",
      priority: 0,
    })
  }

  for (const project of undelivered.slice(0, 6)) {
    attentionRaw.push({
      id: `undel-${project.id}`,
      projectKey: project.id,
      label: project.name,
      href: `/projects/${project.slug}`,
      detail: project.generated ? "À livrer · sans URL" : "À livrer · non généré",
      tone: "warn",
      priority: 1,
    })
  }

  for (const project of orphans.slice(0, 6)) {
    attentionRaw.push({
      id: `orph-${project.id}`,
      projectKey: project.id,
      label: project.name,
      href: `/projects/${project.slug}`,
      detail: project.destination.startsWith("clients/")
        ? "Sans client · destination client"
        : "Sans client · produit / interne",
      tone: "warn",
      priority: 2,
    })
  }

  const staleProjects = projects
    .map((project) => {
      const lastJob = project.jobs[0]
      const lastAt = lastJob
        ? (lastJob.finishedAt ?? lastJob.createdAt)
        : project.updatedAt
      return {
        project,
        lastAt,
        hasJob: Boolean(lastJob),
        ageMs: now - lastAt.getTime(),
      }
    })
    .filter((row) => row.ageMs > 7 * 24 * 60 * 60 * 1000)
    .sort((a, b) => b.ageMs - a.ageMs)
    .slice(0, 5)

  for (const row of staleProjects) {
    attentionRaw.push({
      id: `stale-${row.project.id}`,
      projectKey: row.project.id,
      label: row.project.name,
      href: `/projects/${row.project.slug}`,
      detail: row.hasJob
        ? `Inactif · dernier job ${formatAge(row.lastAt, now)}`
        : `Inactif · jamais lancé · ${formatAge(row.lastAt, now)}`,
      tone: "muted",
      priority: 3,
    })
  }

  // Une entrée par projet : garde le signal le plus critique, fusionne le détail.
  const attentionByProject = new Map<string, AttentionItem>()
  const sortedAttention = [...attentionRaw].sort((a, b) => a.priority - b.priority)
  for (const item of sortedAttention) {
    const existing = attentionByProject.get(item.projectKey)
    if (!existing) {
      attentionByProject.set(item.projectKey, item)
      continue
    }
    if (item.priority < existing.priority) {
      attentionByProject.set(item.projectKey, {
        ...item,
        detail: `${item.detail} · ${existing.detail.split(" · ").slice(0, 2).join(" · ")}`,
      })
    } else if (!existing.detail.includes(item.detail.split(" · ")[0]!)) {
      attentionByProject.set(item.projectKey, {
        ...existing,
        detail: `${existing.detail} · ${item.detail}`,
      })
    }
  }

  const attentionItems = [...attentionByProject.values()]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4)
    .map(({ id, label, href, detail, tone }) => ({
      id,
      label,
      href,
      detail,
      tone,
    }))

  const featureBars = featureBenchmarks.map((b) => ({
    id: b.key,
    label: b.label,
    value: b.sampleCount,
  }))

  return (
    <div className="animate-page-in flex flex-col min-h-0 lg:h-full lg:overflow-hidden">
      <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-12 pt-3 pb-5">
        <div className="min-w-0 flex items-baseline gap-3">
          <h1 className="page-title !text-[1.15rem] sm:!text-[1.25rem]">
            Production
          </h1>
          <p className="metric text-[11px] text-zinc-500 tabular-nums hidden sm:block">
            {counts.total} projets · {counts.live} en ligne
          </p>
        </div>
        <Link
          href="/builder"
          className="slab inline-flex items-center gap-1.5 !px-3 !py-2 text-[12px] touch-manipulation"
        >
          <Wand2 className="w-3.5 h-3.5" strokeWidth={2} />
          Générer
        </Link>
      </div>

      {/*
        Mobile : pile Projets → Catalogue → Clients → Console.
        Desktop : espaces 1fr égaux autour de P / Cat / Console ;
        Clients = largeur P + espace + Cat, hauteur contenu ; Console pleine hauteur.
      */}
      <div className="px-12 lg:px-16 pb-8 flex-1 min-h-0 lg:overflow-hidden">
        <div className="flex flex-col gap-8 w-full lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-y-4 lg:h-full lg:min-h-0 lg:overflow-hidden">
          <InsightCard
            title="Projets"
            href="/projects"
            linkLabel="Projets →"
            fill
            className="lg:col-start-2 lg:row-start-1 lg:w-[28rem]"
            empty={counts.total === 0}
            emptyLabel="Aucun projet — lance une génération"
          >
            <div className="space-y-5 lg:space-y-3">
              <CardBlock title="Pipeline">
                <StackedMeter
                  slices={pipelineSlices}
                  href="/projects"
                  compact
                />
                {nextActions.length > 0 ? (
                  <ul className="mt-3.5 flex flex-wrap gap-1.5">
                    {nextActions.map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/projects/${p.slug}`}
                          className="inline-flex items-center gap-1.5 max-w-full rounded-md border border-white/[0.08] bg-well/40 px-2 py-1 text-[11px] text-zinc-300 hover:border-brand/40 hover:text-brand transition-[color,border-color] duration-140"
                        >
                          <span className="font-medium truncate">{p.name}</span>
                          <span className="text-zinc-600">·</span>
                          <span className="text-zinc-500 truncate max-w-[8rem]">
                            {p.nextAction}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </CardBlock>
              <div className="border-t border-white/[0.06] pt-5 lg:pt-3">
                <CardBlock title="Livraison">
                  <DeliverySplit
                    live={counts.live}
                    undelivered={undelivered.length}
                    orphans={orphans.length}
                  />
                </CardBlock>
              </div>
            </div>
          </InsightCard>

          <InsightCard
            title="Catalogue"
            href="/catalogue"
            linkLabel="Catalogue →"
            fill
            className="lg:col-start-4 lg:row-start-1 lg:w-[28rem]"
            empty={templates.length === 0 && featureBars.length === 0}
            emptyLabel="Aucun modèle"
          >
            <CatalogCoverage
              slices={templateSlices}
              usedCount={usedTemplateCount}
              totalCount={templates.length}
              features={featureBars}
            />
          </InsightCard>

          <InsightCard
            title="Clients & destinations"
            href="/clients"
            linkLabel="Clients →"
            className="lg:col-start-2 lg:col-span-3 lg:row-start-2 lg:self-start lg:w-auto"
            empty={clientSlices.length === 0 && destinationSlices.length === 0}
            emptyLabel="Aucun projet rattaché"
          >
            <div className="space-y-5">
              {destinationSlices.length > 0 ? (
                <CardBlock title="Destination">
                  <StackedMeter
                    slices={destinationSlices}
                    href="/projects"
                    compact
                  />
                </CardBlock>
              ) : null}
              {clientSlices.length > 0 ? (
                <div
                  className={
                    destinationSlices.length > 0
                      ? "pt-5 border-t border-white/[0.06]"
                      : undefined
                  }
                >
                  <ShareMap slices={clientSlices} />
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500">Aucun client</p>
              )}
            </div>
          </InsightCard>

          <InsightCard
            title="Console"
            href="/console"
            linkLabel="Console →"
            fill
            className="lg:col-start-6 lg:row-start-1 lg:row-span-2 lg:w-80 lg:min-h-0 lg:h-full"
          >
            <div className="space-y-5">
              <CardBlock title="Jobs & Worker">
                {jobTotal > 0 ? (
                  <DonutChart
                    slices={jobSlices}
                    centerLabel="succès"
                    centerPercent={successRate}
                    footer={
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-well/40 px-2.5 py-2">
                          <span className="metric text-[10px] text-zinc-400">
                            Durée moy.
                          </span>
                          <span className="metric text-[11px] text-zinc-200 tabular-nums">
                            {avgSuccessMs != null
                              ? formatDurationMs(avgSuccessMs)
                              : "—"}
                          </span>
                        </div>
                        <WorkerPulse inline />
                      </div>
                    }
                  />
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-zinc-500 text-center py-2">
                      Aucun job exécuté
                    </p>
                    <WorkerPulse inline />
                  </div>
                )}
              </CardBlock>
              <div className="border-t border-white/[0.06] pt-5">
                <CardBlock title="À traiter">
                  <AttentionBoard
                    items={attentionItems}
                    emptyLabel="Rien à traiter"
                  />
                </CardBlock>
              </div>
            </div>
          </InsightCard>
        </div>
      </div>
    </div>
  )
}
