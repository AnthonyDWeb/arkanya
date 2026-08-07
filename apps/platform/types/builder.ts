import type { BuilderDeliveryTarget as ContractDeliveryTarget } from "@arkanya/contracts/builder"
import type { FeatureSummary, TemplateSummary } from "@/types/catalogue"

export type { FeatureSummary, TemplateSummary }
export type { TemplateConfigField, TemplatePage } from "@/types/catalogue"

export type ClientOption = {
  id: string
  name: string
  company: string
}

export type BuilderDeliveryTarget = ContractDeliveryTarget

export type BuilderPageDraft = {
  id: string
  name: string
  slug: string
  enabled: boolean
  source: "template" | "custom"
}

export type BuilderState = {
  kind: "client" | "product"
  name: string
  slug: string
  clientId: string
  description: string
  objective: string
  template: string
  templateData: TemplateSummary | null
  pages: BuilderPageDraft[]
  config: Record<string, string>
  features: string[]
  delivery: { targets: BuilderDeliveryTarget[] }
}

export type BuilderStep =
  | "project"
  | "template"
  | "pages"
  | "config"
  | "features"
  | "delivery"
  | "summary"
  | "execution"

export type BenchmarkEntry = {
  key: string
  label: string
  category: string
  avgMs: number
  minMs: number
  maxMs: number
  sampleCount: number
}
