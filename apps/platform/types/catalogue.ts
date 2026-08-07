export type TemplateConfigField = {
  id: string
  label: string
  type: "text" | "color" | "select"
  required: boolean
  default: string
  options?: string[]
}

export type TemplatePage = {
  id: string
  name: string
  slug: string
  required: boolean
  file: string
}

export type TemplateSummary = {
  id: string
  name: string
  description: string
  type: string
  pages: TemplatePage[]
  config: TemplateConfigField[]
  features: string[]
  technologies: string[]
}

export type FeatureSummary = {
  id: string
  name: string
  description: string
}

export type CatalogueTemplate = {
  id: string
  name: string
  description: string
  type: string
  pages: { id: string; name: string; required: boolean }[]
  config: { id: string; label: string; type: string; required: boolean }[]
  features: string[]
  technologies: string[]
}

export type CatalogueFeature = {
  id: string
  name: string
  description: string
  dependencies?: Record<string, string>
}

export type CatalogueBenchmark = {
  avgMs: number
  sampleCount: number
}
