import fs from "node:fs"
import path from "node:path"
import type {
  CatalogueFeature,
  CatalogueTemplate,
  FeatureSummary,
  TemplateSummary,
} from "@/types/catalogue"

const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
export const TEMPLATES_DIR = path.join(MONOREPO_ROOT, "templates")
export const FEATURES_DIR = path.join(MONOREPO_ROOT, "features")

export function readTemplates(): TemplateSummary[] {
  if (!fs.existsSync(TEMPLATES_DIR)) return []

  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => {
      const manifestPath = path.join(TEMPLATES_DIR, e.name, "template.json")
      if (!fs.existsSync(manifestPath)) return []
      return [JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as TemplateSummary]
    })
}

export function readFeatures(): FeatureSummary[] {
  if (!fs.existsSync(FEATURES_DIR)) return []

  return fs
    .readdirSync(FEATURES_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .flatMap((e) => {
      const manifestPath = path.join(FEATURES_DIR, e.name, "feature.json")
      if (!fs.existsSync(manifestPath)) return []
      const f = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as FeatureSummary
      return [{ id: f.id, name: f.name, description: f.description }]
    })
}

export function readCatalogueTemplates(): CatalogueTemplate[] {
  try {
    return fs
      .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => {
        try {
          return JSON.parse(
            fs.readFileSync(path.join(TEMPLATES_DIR, e.name, "template.json"), "utf-8"),
          ) as CatalogueTemplate
        } catch {
          return null
        }
      })
      .filter((t): t is CatalogueTemplate => t !== null)
  } catch {
    return []
  }
}

export function readCatalogueFeatures(): CatalogueFeature[] {
  try {
    return fs
      .readdirSync(FEATURES_DIR, { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => {
        try {
          return JSON.parse(
            fs.readFileSync(path.join(FEATURES_DIR, e.name, "feature.json"), "utf-8"),
          ) as CatalogueFeature
        } catch {
          return null
        }
      })
      .filter((f): f is CatalogueFeature => f !== null)
  } catch {
    return []
  }
}
