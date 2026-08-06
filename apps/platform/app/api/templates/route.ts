import fs from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
const TEMPLATES_DIR = path.join(MONOREPO_ROOT, "templates")

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

export async function GET() {
  try {
    if (!fs.existsSync(TEMPLATES_DIR)) {
      return NextResponse.json([])
    }

    const entries = fs.readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    const templates: TemplateSummary[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const manifestPath = path.join(TEMPLATES_DIR, entry.name, "template.json")
      if (!fs.existsSync(manifestPath)) continue

      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as TemplateSummary
      templates.push(manifest)
    }

    return NextResponse.json(templates)
  } catch {
    return NextResponse.json({ error: "Erreur lecture templates" }, { status: 500 })
  }
}
