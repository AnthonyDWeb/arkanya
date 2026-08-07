import fs from "node:fs"
import path from "node:path"
import { prisma } from "@arkanya/database/client"
import { CatalogueView } from "@/components/catalogue-view"

export const dynamic = "force-dynamic"
export const metadata = { title: "Catalogue" }

type TemplateManifest = {
  id: string
  name: string
  description: string
  type: string
  pages: { id: string; name: string; required: boolean }[]
  config: { id: string; label: string; type: string; required: boolean }[]
  features: string[]
  technologies: string[]
}

type FeatureManifest = {
  id: string
  name: string
  description: string
  dependencies?: Record<string, string>
}

const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
const TEMPLATES_DIR = path.join(MONOREPO_ROOT, "templates")
const FEATURES_DIR = path.join(MONOREPO_ROOT, "features")

function readTemplates(): TemplateManifest[] {
  try {
    return fs
      .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => {
        try {
          return JSON.parse(
            fs.readFileSync(path.join(TEMPLATES_DIR, e.name, "template.json"), "utf-8"),
          ) as TemplateManifest
        } catch {
          return null
        }
      })
      .filter(Boolean) as TemplateManifest[]
  } catch {
    return []
  }
}

function readFeatures(): FeatureManifest[] {
  try {
    return fs
      .readdirSync(FEATURES_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => {
        try {
          return JSON.parse(
            fs.readFileSync(path.join(FEATURES_DIR, e.name, "feature.json"), "utf-8"),
          ) as FeatureManifest
        } catch {
          return null
        }
      })
      .filter(Boolean) as FeatureManifest[]
  } catch {
    return []
  }
}

export default async function CataloguePage() {
  const templates = readTemplates()
  const features = readFeatures()

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
