import type { Metadata } from "next"
import { prisma } from "@arkanya/database/client"
import { BuilderWizard } from "@/components/builder/builder-wizard"
import { readFeatures, readTemplates } from "@/lib/catalogue/load-manifests"

export const metadata: Metadata = { title: "Builder" }
export const dynamic = "force-dynamic"

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
    <div className="h-full flex flex-col overflow-hidden animate-page-in">
      <div className="shrink-0 px-4 lg:px-6 pt-3 pb-2 flex items-baseline gap-3">
        <h1 className="page-title">Builder</h1>
        <p className="metric text-[11px] text-zinc-400">
          {String(templates.length).padStart(2, "0")} modèles
          <span className="mx-1 text-zinc-600">·</span>
          {String(features.length).padStart(2, "0")} fonctionnalités
        </p>
      </div>
      <div className="flex-1 min-h-0 px-4 lg:px-6 pb-3">
        <BuilderWizard
          templates={templates}
          features={features}
          clients={clients}
        />
      </div>
    </div>
  )
}
