import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { WorkerProjectPayload, WorkerStepReport, TimingEntry } from "@arkanya/contracts/worker"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO_ROOT = path.resolve(__dirname, "../../../..")
const FEATURES_DIR = path.join(MONOREPO_ROOT, "features")

function replaceTokens(content: string, config: Record<string, string>): string {
  return content.replace(/\{\{([\w-]+)\}\}/g, (_, key: string) => config[key] ?? "")
}

type FeatureFile = {
  src: string
  dest: string
}

type FeatureSlot = {
  template?: string
  file: string
  find: string
  replace: string
}

type FeatureManifest = {
  id: string
  name: string
  description: string
  files: FeatureFile[]
  slots?: FeatureSlot[]
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

function toNavHref(slug: string, isLanding: boolean, pageId: string): string | null {
  const raw = slug.replace(/^\//, "")

  if (isLanding && !pageId.startsWith("custom-")) {
    const section = raw === "/" || pageId === "hero" || raw === "hero" ? "hero" : raw
    if (section.includes("[")) return null
    return `#${section}`
  }

  if (!raw || raw === "/") return "/"

  // Segments dynamiques / catch-all : pas de lien nav concret
  if (raw.includes("[")) return null

  // Route groups (marketing) n'apparaissent pas dans l'URL
  const parts = raw.split("/").filter((seg) => !/^\(.+\)$/.test(seg))
  if (parts.length === 0) return "/"
  return `/${parts.join("/")}`
}

function buildNavLinks(payload: WorkerProjectPayload): string {
  const enabled = payload.pages.filter((p) => p.enabled)
  const isLanding = payload.template === "landing-page"

  return enabled
    .map((p) => {
      const href = toNavHref(p.slug, isLanding, p.id)
      if (!href) return null
      const label = p.name.replace(/"/g, '\\"')
      return `{ href: "${href}", label: "${label}" }`
    })
    .filter((line): line is string => line !== null)
    .join(",\n          ")
}

function resolveSlotReplace(replace: string, payload: WorkerProjectPayload): string {
  if (!replace.includes("{{arkanya-nav-links}}")) return replace
  return replace.replace("{{arkanya-nav-links}}", buildNavLinks(payload))
}

function mergeDependencies(
  projectPackageJsonPath: string,
  deps: Record<string, string>,
  devDeps: Record<string, string>,
) {
  if (!fs.existsSync(projectPackageJsonPath)) return

  const pkg = JSON.parse(fs.readFileSync(projectPackageJsonPath, "utf-8")) as Record<string, unknown>

  if (Object.keys(deps).length > 0) {
    pkg["dependencies"] = { ...(pkg["dependencies"] as Record<string, string> | undefined ?? {}), ...deps }
  }
  if (Object.keys(devDeps).length > 0) {
    pkg["devDependencies"] = { ...(pkg["devDependencies"] as Record<string, string> | undefined ?? {}), ...devDeps }
  }

  fs.writeFileSync(projectPackageJsonPath, JSON.stringify(pkg, null, 2), "utf-8")
}

export async function runFeature(
  payload: WorkerProjectPayload,
  projectDir: string,
): Promise<WorkerStepReport> {
  const startedAt = new Date().toISOString()
  const start = Date.now()

  const installed: string[] = []
  const errors: string[] = []
  const timings: TimingEntry[] = []

  try {
    for (const featureId of payload.features) {
      const featureStart = Date.now()
      const featureDir = path.join(FEATURES_DIR, featureId)
      const manifestPath = path.join(featureDir, "feature.json")

      if (!fs.existsSync(manifestPath)) {
        errors.push(`Feature introuvable : ${featureId}`)
        continue
      }

      const manifest: FeatureManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))

      for (const fileEntry of manifest.files) {
        const src = path.join(featureDir, "files", fileEntry.src)
        const dest = path.join(projectDir, fileEntry.dest)

        if (!fs.existsSync(src)) {
          errors.push(`Fichier manquant dans feature ${featureId} : ${fileEntry.src}`)
          continue
        }

        fs.mkdirSync(path.dirname(dest), { recursive: true })

        const raw = fs.readFileSync(src, "utf-8")
        const processed = replaceTokens(raw, payload.config)
        fs.writeFileSync(dest, processed, "utf-8")
      }

      mergeDependencies(
        path.join(projectDir, "package.json"),
        manifest.dependencies ?? {},
        manifest.devDependencies ?? {},
      )

      for (const slot of manifest.slots ?? []) {
        if (slot.template && slot.template !== payload.template) continue

        const targetPath = path.join(projectDir, slot.file)
        if (!fs.existsSync(targetPath)) {
          errors.push(`Slot cible introuvable (${featureId}) : ${slot.file}`)
          continue
        }
        const content = fs.readFileSync(targetPath, "utf-8")
        if (!content.includes(slot.find)) {
          errors.push(`Marqueur introuvable (${featureId}) : "${slot.find}" dans ${slot.file}`)
          continue
        }
        const resolvedReplace = resolveSlotReplace(slot.replace, payload)
        fs.writeFileSync(targetPath, content.replace(slot.find, resolvedReplace), "utf-8")
      }

      installed.push(featureId)
      timings.push({
        key: `feature:${featureId}`,
        label: manifest.name,
        category: "feature",
        durationMs: Date.now() - featureStart,
      })
    }

    if (errors.length > 0 && installed.length === 0) {
      return {
        stepId: crypto.randomUUID(),
        stepType: "feature",
        state: "ERROR",
        message: errors.join(" | "),
        startedAt,
        finishedAt: new Date().toISOString(),
        durationMs: Date.now() - start,
        timings,
      }
    }

    return {
      stepId: crypto.randomUUID(),
      stepType: "feature",
      state: "SUCCESS",
      message:
        installed.length === 0
          ? "Aucune feature à installer"
          : `Features installées : ${installed.join(", ")}${errors.length > 0 ? ` | Avertissements : ${errors.join(", ")}` : ""}`,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      timings,
    }
  } catch (err) {
    return {
      stepId: crypto.randomUUID(),
      stepType: "feature",
      state: "ERROR",
      message: err instanceof Error ? err.message : String(err),
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      timings,
    }
  }
}
