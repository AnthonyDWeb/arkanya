import type { Metadata } from "next"
import fs from "node:fs"
import path from "node:path"
import { prisma } from "@arkanya/database/client"
import { BuilderWizard } from "@/components/builder/builder-wizard"
import type { TemplateSummary } from "@/app/api/templates/route"
import type { FeatureSummary } from "@/app/api/features/route"

export const metadata: Metadata = { title: "Builder" }
export const dynamic = "force-dynamic"

const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")

function readTemplates(): TemplateSummary[] {
  const dir = path.join(MONOREPO_ROOT, "templates")
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => {
      const manifestPath = path.join(dir, e.name, "template.json")
      if (!fs.existsSync(manifestPath)) return []
      return [JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as TemplateSummary]
    })
}

function readFeatures(): FeatureSummary[] {
  const dir = path.join(MONOREPO_ROOT, "features")
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => {
      const manifestPath = path.join(dir, e.name, "feature.json")
      if (!fs.existsSync(manifestPath)) return []
      const f = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as FeatureSummary
      return [{ id: f.id, name: f.name, description: f.description }]
    })
}

export default async function BuilderPage() {
  const [templates, features, clients] = await Promise.all([
    Promise.resolve(readTemplates()),
    Promise.resolve(readFeatures()),
    prisma.client.findMany({
      select: { id: true, name: true, company: true },
      orderBy: { name: "asc" },
    }),
  ])

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Builder</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          {templates.length} template{templates.length !== 1 ? "s" : ""} ·{" "}
          {features.length} feature{features.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="p-4 lg:p-6">
        <BuilderWizard
          templates={templates}
          features={features}
          clients={clients}
        />
      </div>
    </div>
  )
}
