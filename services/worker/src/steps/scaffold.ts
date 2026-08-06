import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { WorkerProjectPayload, WorkerStepReport, TimingEntry } from "@arkanya/contracts/worker"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO_ROOT = path.resolve(__dirname, "../../../..")
const TEMPLATES_DIR = path.join(MONOREPO_ROOT, "templates")

type TemplatePage = {
  id: string
  name: string
  slug: string
  required: boolean
  file: string | null
}

type TemplateConfigField = {
  id: string
  label: string
  type: "text" | "color" | "select"
  required: boolean
  default: string
  options?: string[]
}

type TemplateManifest = {
  id: string
  name: string
  pages: TemplatePage[]
  config: TemplateConfigField[]
  features: string[]
  technologies: string[]
}

function replaceTokens(content: string, config: Record<string, string>): string {
  return content.replace(/\{\{([\w-]+)\}\}/g, (_, key: string) => config[key] ?? "")
}

function toComponentName(id: string): string {
  return id
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("") || "Custom"
}

type RouteParam = {
  name: string
  kind: "dynamic" | "catchAll" | "optionalCatchAll"
}

function normalizeRouteSegment(seg: string): string | null {
  if (!seg) return null

  const optionalCatchAll = seg.match(/^\[\[\.\.\.([A-Za-z_][A-Za-z0-9_]*)\]\]$/)
  if (optionalCatchAll) return `[[...${optionalCatchAll[1].toLowerCase()}]]`

  const catchAll = seg.match(/^\[\.\.\.([A-Za-z_][A-Za-z0-9_]*)\]$/)
  if (catchAll) return `[...${catchAll[1].toLowerCase()}]`

  const dynamic = seg.match(/^\[([A-Za-z_][A-Za-z0-9_]*)\]$/)
  if (dynamic) return `[${dynamic[1].toLowerCase()}]`

  const group = seg.match(/^\(([A-Za-z0-9_-]+)\)$/)
  if (group) return `(${group[1].toLowerCase()})`

  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(seg)) return seg.toLowerCase()

  return null
}

function normalizeRoutePath(raw: string): string | null {
  const trimmed = raw
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+|\/+$/g, "")
    .replace(/\/+/g, "/")
  if (!trimmed) return null

  const segments = trimmed.split("/")
  const normalized: string[] = []
  for (const seg of segments) {
    const next = normalizeRouteSegment(seg)
    if (!next) return null
    normalized.push(next)
  }
  return normalized.join("/")
}

function extractRouteParams(routePath: string): RouteParam[] {
  const params: RouteParam[] = []
  for (const seg of routePath.split("/")) {
    const optionalCatchAll = seg.match(/^\[\[\.\.\.(\w+)\]\]$/)
    if (optionalCatchAll) {
      params.push({ name: optionalCatchAll[1], kind: "optionalCatchAll" })
      continue
    }
    const catchAll = seg.match(/^\[\.\.\.(\w+)\]$/)
    if (catchAll) {
      params.push({ name: catchAll[1], kind: "catchAll" })
      continue
    }
    const dynamic = seg.match(/^\[(\w+)\]$/)
    if (dynamic) {
      params.push({ name: dynamic[1], kind: "dynamic" })
    }
  }
  return params
}

function buildCustomPageSource(
  pageId: string,
  pageName: string,
  routePath: string,
  config: Record<string, string>,
): string {
  const title = pageName.replace(/"/g, '\\"')
  const component = toComponentName(pageId)
  const params = extractRouteParams(routePath)
  const color = config["primary-color"] ?? "#0f172a"

  if (params.length === 0) {
    return `import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "${title}",
}

export default function ${component}Page() {
  return (
    <main className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6" style={{ color: "${color}" }}>
          ${title}
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Contenu à personnaliser.
        </p>
      </div>
    </main>
  )
}
`
  }

  const paramTypeFields = params
    .map((p) => {
      if (p.kind === "dynamic") return `  ${p.name}: string`
      return `  ${p.name}?: string[]`
    })
    .join("\n")

  const paramReads = params
    .map((p) => {
      if (p.kind === "dynamic") {
        return `          <p className="text-sm text-gray-500 font-mono">${p.name}: {${p.name}}</p>`
      }
      return `          <p className="text-sm text-gray-500 font-mono">${p.name}: {${p.name}?.join(" / ") ?? "—"}</p>`
    })
    .join("\n")

  const destructure = params.map((p) => p.name).join(", ")

  return `type ${component}PageProps = {
  params: Promise<{
${paramTypeFields}
  }>
}

export default async function ${component}Page({ params }: ${component}PageProps) {
  const { ${destructure} } = await params

  return (
    <main className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6" style={{ color: "${color}" }}>
          ${title}
        </h1>
        <div className="space-y-1">
${paramReads}
        </div>
      </div>
    </main>
  )
}
`
}

function copyDir(src: string, dest: string, config: Record<string, string>, skip: Set<string>) {
  fs.mkdirSync(dest, { recursive: true })

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, config, skip)
    } else {
      if (skip.has(srcPath)) continue

      const raw = fs.readFileSync(srcPath, "utf-8")
      const processed = replaceTokens(raw, config)
      fs.mkdirSync(path.dirname(destPath), { recursive: true })
      fs.writeFileSync(destPath, processed, "utf-8")
    }
  }
}

export async function runScaffold(
  payload: WorkerProjectPayload,
  projectDir: string,
): Promise<WorkerStepReport> {
  const startedAt = new Date().toISOString()
  const start = Date.now()

  try {
    const templateDir = path.join(TEMPLATES_DIR, payload.template)
    const filesDir = path.join(templateDir, "files")
    const manifestPath = path.join(templateDir, "template.json")

    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Template introuvable : ${payload.template}`)
    }

    const manifest: TemplateManifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"))

    const enabledPageIds = new Set(
      payload.pages.filter((p) => p.enabled).map((p) => p.id),
    )

    const skippedFiles = new Set<string>(
      manifest.pages
        .filter((p: TemplatePage) => !p.required && !enabledPageIds.has(p.id) && p.file !== null)
        .map((p: TemplatePage) => path.join(filesDir, p.file as string)),
    )

    const config = {
      ...manifest.config.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = field.default
        return acc
      }, {}),
      ...payload.config,
      "project-name": payload.projectName,
      "project-slug": payload.projectSlug,
    }

    const timings: TimingEntry[] = []

    const tCopy = Date.now()
    copyDir(filesDir, projectDir, config, skippedFiles)
    timings.push({
      key: `scaffold:${payload.template}:copy-files`,
      label: `Copie fichiers (${payload.template})`,
      category: "scaffold",
      durationMs: Date.now() - tCopy,
    })

    const enabledPages = payload.pages.filter((p) => p.enabled)
    const customPages = enabledPages.filter((p) => p.source === "custom")

    for (const page of customPages) {
      const routePath = normalizeRoutePath(page.slug)
      if (!routePath) continue

      const segments = routePath.split("/")
      const pageDir = path.join(projectDir, "app", ...segments)
      const pageFile = path.join(pageDir, "page.tsx")
      if (fs.existsSync(pageFile)) continue

      fs.mkdirSync(pageDir, { recursive: true })
      fs.writeFileSync(
        pageFile,
        buildCustomPageSource(page.id, page.name, routePath, config),
        "utf-8",
      )
    }

    timings.push({
      key: `scaffold:pages:${enabledPages.length}`,
      label: `Pages activées (${enabledPages.length})`,
      category: "scaffold",
      durationMs: Date.now() - tCopy,
    })

    return {
      stepId: crypto.randomUUID(),
      stepType: "scaffold",
      state: "SUCCESS",
      message: `Template "${payload.template}" appliqué — ${enabledPages.length} pages (${customPages.length} custom)`,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
      timings,
    }
  } catch (err) {
    return {
      stepId: crypto.randomUUID(),
      stepType: "scaffold",
      state: "ERROR",
      message: err instanceof Error ? err.message : String(err),
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    }
  }
}
