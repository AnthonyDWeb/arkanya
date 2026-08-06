import fs from "node:fs"
import path from "node:path"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@arkanya/database/client"
import { auth } from "@/lib/auth"
import type { WorkerProjectPayload } from "@arkanya/contracts/worker"

const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
const TEMPLATES_DIR = path.join(MONOREPO_ROOT, "templates")

type TemplateManifest = {
  pages: Array<{ id: string; name: string; slug: string }>
  config: Array<{ id: string; default: string }>
  features: string[]
}

function buildPayloadFromProject(project: {
  slug: string
  name: string
  description: string
  type: string
  destination: string
  clientId: string | null
}): WorkerProjectPayload | { error: string } {
  const manifestPath = path.join(TEMPLATES_DIR, project.type, "template.json")
  if (!fs.existsSync(manifestPath)) {
    return { error: `Template introuvable : ${project.type}` }
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as TemplateManifest
  const config = Object.fromEntries(manifest.config.map((f) => [f.id, f.default]))
  if (config["site-name"] !== undefined) config["site-name"] = project.name

  const projectKind = project.destination.startsWith("clients/") ? "client" : "product"

  return {
    jobId: crypto.randomUUID(),
    projectSlug: project.slug,
    projectName: project.name,
    projectKind,
    clientId: project.clientId ?? undefined,
    description: project.description,
    template: project.type,
    pages: manifest.pages.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      enabled: true,
      source: "template" as const,
    })),
    config,
    features: manifest.features ?? [],
    delivery: { targets: ["github", "vercel", "database"] },
  }
}

/** Reconstruit un payload depuis le projet + template, puis délègue à /api/worker/run. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { slug } = await params
  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 })

  const payload = buildPayloadFromProject(project)
  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 })
  }

  const origin = new URL(req.url).origin
  const cookie = req.headers.get("cookie") ?? ""

  const runRes = await fetch(`${origin}/api/worker/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie,
    },
    body: JSON.stringify(payload),
  })

  const data = (await runRes.json()) as unknown
  return NextResponse.json(data, { status: runRes.status })
}
