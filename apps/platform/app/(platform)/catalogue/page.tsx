import { prisma } from "@arkanya/database/client"
import { CatalogueInsights } from "@/components/dashboard/catalogue-insights"
import { CatalogueView } from "@/components/catalogue-view"
import {
  readCatalogueFeatures,
  readCatalogueTemplates,
} from "@/lib/catalogue/load-manifests"
import { topSlices } from "@/lib/dashboard/chart"
import { CATALOG_PALETTE } from "@/lib/dashboard/colors"

export const dynamic = "force-dynamic"
export const metadata = { title: "Catalogue" }

export default async function CataloguePage() {
  const templates = readCatalogueTemplates()
  const features = readCatalogueFeatures()

  const templateKeys = templates.map((t) => `scaffold:${t.id}:copy-files`)
  const featureKeys = features.map((f) => `feature:${f.id}`)
  const validateKeys = ["validate:npm-install", "validate:next-build"]
  const allKeys = [...templateKeys, ...featureKeys, ...validateKeys]

  const [benchmarks, projects, featureBenchmarks] = await Promise.all([
    prisma.timingBenchmark.findMany({
      where: { key: { in: allKeys } },
      select: { key: true, avgMs: true, sampleCount: true },
    }),
    prisma.project.findMany({
      select: { type: true },
    }),
    prisma.timingBenchmark.findMany({
      where: { category: "feature" },
      select: { key: true, label: true, sampleCount: true },
      orderBy: { sampleCount: "desc" },
      take: 3,
    }),
  ])

  const benchmarkMap = Object.fromEntries(benchmarks.map((b) => [b.key, b]))

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
  const featureBars = featureBenchmarks.map((b) => ({
    id: b.key,
    label: b.label,
    value: b.sampleCount,
  }))

  return (
    <div className="min-h-full animate-page-in">
      <header className="page-head">
        <div className="flex items-baseline gap-3 min-w-0">
          <h1 className="page-title">Catalogue</h1>
          <span className="metric text-xs text-brand tabular-nums">
            {String(templates.length).padStart(2, "0")}
            <span className="text-zinc-700 mx-1">·</span>
            {String(features.length).padStart(2, "0")}
          </span>
        </div>
      </header>
      <div className="px-4 lg:px-6 pb-8">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-8">
          <div className="w-full max-w-sm shrink-0">
            <CatalogueInsights
              slices={templateSlices}
              usedCount={usedTemplateCount}
              totalCount={templates.length}
              features={featureBars}
            />
          </div>
          <div className="w-full max-w-sm lg:max-w-none lg:flex-1 min-w-0">
            <CatalogueView
              templates={templates}
              features={features}
              benchmarkMap={benchmarkMap}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
