import type { TemplateSummary, TemplateConfigField, TemplatePage } from "@/app/api/templates/route"
import type { FeatureSummary } from "@/app/api/features/route"

export type { TemplateSummary, TemplateConfigField, TemplatePage, FeatureSummary }

export type ClientOption = {
  id: string
  name: string
  company: string
}

export type BuilderDeliveryTarget = "database" | "github" | "vercel"

export type BuilderState = {
  kind: "client" | "product"
  name: string
  slug: string
  clientId: string
  description: string
  objective: string
  template: string
  templateData: TemplateSummary | null
  pages: Array<{ id: string; name: string; slug: string; enabled: boolean; source: "template" | "custom" }>
  config: Record<string, string>
  features: string[]
  delivery: { targets: BuilderDeliveryTarget[] }
}

export const INITIAL_STATE: BuilderState = {
  kind: "client",
  name: "",
  slug: "",
  clientId: "",
  description: "",
  objective: "",
  template: "",
  templateData: null,
  pages: [],
  config: {},
  features: [],
  delivery: { targets: ["github", "vercel", "database"] },
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

export const BUILDER_STEPS: Array<{ id: BuilderStep; label: string }> = [
  { id: "project", label: "Projet" },
  { id: "template", label: "Modèle" },
  { id: "pages", label: "Pages" },
  { id: "config", label: "Config" },
  { id: "features", label: "Fonct." },
  { id: "delivery", label: "Livraison" },
  { id: "summary", label: "Résumé" },
  { id: "execution", label: "Lancement" },
]
