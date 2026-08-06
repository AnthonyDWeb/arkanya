import fs from "node:fs"
import path from "node:path"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@arkanya/database/client"
import { auth } from "@/lib/auth"

const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
const GITHUB_TOKEN = process.env["GITHUB_TOKEN"] ?? ""
const GITHUB_OWNER = process.env["GITHUB_OWNER"] ?? ""
const VERCEL_TOKEN = process.env["VERCEL_TOKEN"] ?? ""
const VERCEL_ORG_ID = process.env["VERCEL_ORG_ID"] ?? ""

type DeletionResult = {
  step: string
  ok: boolean
  error?: string
}

async function deleteGithubRepo(repoName: string): Promise<DeletionResult> {
  if (!GITHUB_TOKEN || !GITHUB_OWNER) return { step: "github", ok: true }
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${repoName}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    )
    if (!res.ok && res.status !== 404) {
      return { step: "github", ok: false, error: `GitHub ${res.status}` }
    }
    return { step: "github", ok: true }
  } catch (e) {
    return { step: "github", ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

async function deleteVercelProject(projectName: string): Promise<DeletionResult> {
  if (!VERCEL_TOKEN) return { step: "vercel", ok: true }
  try {
    const res = await fetch(
      `https://api.vercel.com/v9/projects/${projectName}?teamId=${VERCEL_ORG_ID}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      },
    )
    if (!res.ok && res.status !== 404) {
      const body = await res.text()
      return { step: "vercel", ok: false, error: `Vercel ${res.status}: ${body.slice(0, 200)}` }
    }
    return { step: "vercel", ok: true }
  } catch (e) {
    return { step: "vercel", ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

function deleteLocalDir(destination: string): DeletionResult {
  try {
    const localPath = path.join(/* turbopackIgnore: true */ MONOREPO_ROOT, destination)
    if (fs.existsSync(localPath)) {
      fs.rmSync(localPath, { recursive: true, force: true })
    }
    return { step: "local", ok: true }
  } catch (e) {
    return { step: "local", ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

function buildRepoName(project: {
  type: string
  slug: string
  client: { company: string; name: string } | null
}): string {
  function slugify(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40)
  }
  if (project.client) {
    // `ac` = arkanya-client — ne pas rajouter le segment "client"
    const company = slugify(project.client.company || project.client.name)
    if (company && company !== "client") {
      return `ac-${company}-${project.slug}`
    }
    return `ac-${project.slug}`
  }
  return `ap-${project.slug}`
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { slug } = await params

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { client: true },
  })

  if (!project) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 })

  const results: DeletionResult[] = []

  // 1. Snapshot FormerClient (toujours, avant toute suppression)
  try {
    await prisma.formerClient.create({
      data: {
        clientName: project.client?.name ?? "Inconnu",
        clientCompany: project.client?.company ?? "",
        clientContact: project.client?.contact ?? "",
        clientStatus: project.client?.status ?? "",
        projectSlug: project.slug,
        projectName: project.name,
        projectType: project.type,
        projectTechnologies: project.technologies,
        projectUrl: project.url ?? null,
        projectDestination: project.destination,
        projectDescription: project.description,
        projectCreatedAt: project.createdAt,
        githubRepo: project.generated ? buildRepoName(project) : null,
        vercelProject: project.generated ? buildRepoName(project) : null,
      },
    })
  } catch (e) {
    console.error("[delete-project] FormerClient snapshot failed:", e)
  }

  // 2. Vercel (si généré)
  if (project.generated) {
    const repoName = buildRepoName(project)
    results.push(await deleteVercelProject(repoName))
    results.push(await deleteGithubRepo(repoName))
  }

  // 3. Filesystem local
  results.push(deleteLocalDir(project.destination))

  // 4. DB — cascade manuelle
  const jobs = await prisma.job.findMany({ where: { projectSlug: slug }, select: { id: true } })
  const jobIds = jobs.map((j) => j.id)

  await prisma.jobTiming.deleteMany({ where: { jobId: { in: jobIds } } })
  await prisma.jobEvent.deleteMany({ where: { jobId: { in: jobIds } } })
  await prisma.job.deleteMany({ where: { projectSlug: slug } })
  await prisma.project.delete({ where: { slug } })

  // 5. Archiver le client si plus aucun projet
  if (project.clientId) {
    const remaining = await prisma.project.count({ where: { clientId: project.clientId } })
    if (remaining === 0) {
      await prisma.client.delete({ where: { id: project.clientId } })
    }
  }

  const errors = results.filter((r) => !r.ok)

  return NextResponse.json({
    ok: true,
    steps: results,
    warnings: errors.length > 0 ? errors.map((e) => `${e.step}: ${e.error}`) : undefined,
  })
}
