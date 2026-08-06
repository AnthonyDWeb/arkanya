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

/** Retire les sections landing désactivées et ajuste le CTA hero. */
function applyLandingPageSections(
  content: string,
  enabledPageIds: Set<string>,
  pages: WorkerProjectPayload["pages"],
): string {
  let next = content

  const sectionIds = ["hero", "about", "services", "contact"] as const
  for (const id of sectionIds) {
    if (enabledPageIds.has(id)) continue
    const pattern = new RegExp(
      `\\s*/\\*\\s*@arkanya-section begin:${id}\\s*\\*/[\\s\\S]*?/\\*\\s*@arkanya-section end:${id}\\s*\\*/`,
      "g",
    )
    next = next.replace(pattern, "\n")
  }

  const firstTarget = pages.find(
    (p) => p.enabled && p.id !== "hero" && !p.id.startsWith("custom-"),
  )
  const ctaPattern =
    /\/\*\s*@arkanya-hero-cta begin\s*\*\/[\s\S]*?\/\*\s*@arkanya-hero-cta end\s*\*\//

  if (!firstTarget) {
    next = next.replace(ctaPattern, "")
  } else {
    const href = `#${firstTarget.slug.replace(/^\//, "")}`
    next = next.replace(ctaPattern, (block) =>
      block.replace(/href="#[^"]*"/, `href="${href}"`),
    )
  }

  return next
}

function applySiteVitrineHomeCta(
  content: string,
  pages: WorkerProjectPayload["pages"],
): string {
  const first = pages.find(
    (p) => p.enabled && p.slug !== "/" && p.slug !== "" && !p.id.startsWith("custom-"),
  )
  if (!first) {
    return content.replace(
      /<Link[\s\S]*?>[\s\S]*?En savoir plus[\s\S]*?<\/Link>/,
      "",
    )
  }
  const href = `/${first.slug.replace(/^\//, "")}`
  return content.replace(/href="\/[^"]*"/, `href="${href}"`)
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
  const optionalCatchAllName = optionalCatchAll?.[1]
  if (optionalCatchAllName) return `[[...${optionalCatchAllName.toLowerCase()}]]`

  const catchAll = seg.match(/^\[\.\.\.([A-Za-z_][A-Za-z0-9_]*)\]$/)
  const catchAllName = catchAll?.[1]
  if (catchAllName) return `[...${catchAllName.toLowerCase()}]`

  const dynamic = seg.match(/^\[([A-Za-z_][A-Za-z0-9_]*)\]$/)
  const dynamicName = dynamic?.[1]
  if (dynamicName) return `[${dynamicName.toLowerCase()}]`

  const group = seg.match(/^\(([A-Za-z0-9_-]+)\)$/)
  const groupName = group?.[1]
  if (groupName) return `(${groupName.toLowerCase()})`

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
    const optionalCatchAllName = optionalCatchAll?.[1]
    if (optionalCatchAllName) {
      params.push({ name: optionalCatchAllName, kind: "optionalCatchAll" })
      continue
    }
    const catchAll = seg.match(/^\[\.\.\.(\w+)\]$/)
    const catchAllName = catchAll?.[1]
    if (catchAllName) {
      params.push({ name: catchAllName, kind: "catchAll" })
      continue
    }
    const dynamic = seg.match(/^\[(\w+)\]$/)
    const dynamicName = dynamic?.[1]
    if (dynamicName) {
      params.push({ name: dynamicName, kind: "dynamic" })
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

    const homePagePath = path.join(projectDir, "app", "page.tsx")
    if (fs.existsSync(homePagePath)) {
      const homeRaw = fs.readFileSync(homePagePath, "utf-8")
      if (payload.template === "landing-page") {
        fs.writeFileSync(
          homePagePath,
          applyLandingPageSections(homeRaw, enabledPageIds, payload.pages),
          "utf-8",
        )
      } else if (payload.template === "site-vitrine") {
        fs.writeFileSync(
          homePagePath,
          applySiteVitrineHomeCta(homeRaw, payload.pages),
          "utf-8",
        )
      }
    }

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
