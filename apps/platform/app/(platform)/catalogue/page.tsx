import { prisma } from "@arkanya/database/client"
import { CatalogueView } from "@/components/catalogue-view"
import {
  readCatalogueFeatures,
  readCatalogueTemplates,
} from "@/lib/catalogue/load-manifests"

export const dynamic = "force-dynamic"
export const metadata = { title: "Catalogue" }

export default async function CataloguePage() {
  const templates = readCatalogueTemplates()
  const features = readCatalogueFeatures()

  const templateKeys = templates.map((t) => `scaffold:${t.id}:copy-files`)
  const featureKeys = features.map((f) => `feature:${f.id}`)
  const validateKeys = ["validate:npm-install", "validate:next-build"]
  const allKeys = [...templateKeys, ...featureKeys, ...validateKeys]

  const benchmarks = await prisma.timingBenchmark.findMany({
    where: { key: { in: allKeys } },
    select: { key: true, avgMs: true, sampleCount: true },
  })

  const benchmarkMap = Object.fromEntries(benchmarks.map((b) => [b.key, b]))

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
      <CatalogueView
        templates={templates}
        features={features}
        benchmarkMap={benchmarkMap}
      />
    </div>
  )
}
