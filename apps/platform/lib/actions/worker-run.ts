"use server"

import fs from "node:fs"
import path from "node:path"
import { prisma } from "@arkanya/database/client"
import type { WorkerProjectPayload, WorkerReport, TimingEntry } from "@arkanya/contracts/worker"
import { getWorkerUrl, workerHeaders } from "@/lib/worker"
import { fail, ok, type ActionResult } from "@/lib/actions/result"
import { requireSession } from "@/lib/actions/session"

const WORKER_URL = getWorkerUrl()
const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
const TEMPLATES_DIR = path.join(MONOREPO_ROOT, "templates")

function readTemplateTechnologies(templateId: string): string[] {
  try {
    const manifestPath = path.join(TEMPLATES_DIR, templateId, "template.json")
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as {
      technologies?: string[]
    }
    return manifest.technologies ?? []
  } catch {
    return []
  }
}

type TemplateManifest = {
  pages: Array<{ id: string; name: string; slug: string }>
  config: Array<{ id: string; default: string }>
  features: string[]
}

export async function runWorkerJob(
  payload: WorkerProjectPayload,
  options?: { action?: string },
): Promise<ActionResult<WorkerReport>> {
  try {
    await requireSession()
  } catch {
    return fail("Non autorisé", 401)
  }

  const {
    jobId,
    projectSlug,
    projectName,
    projectKind,
    clientId,
    description,
    template,
    pages,
    config,
    features,
    delivery,
  } = payload

  if (!jobId || !projectSlug || !projectName || !template) {
    return fail("Champs requis manquants")
  }

  let clientCompany: string | undefined
  if (clientId) {
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    clientCompany = client?.company ?? client?.name
  }

  let project = await prisma.project.findUnique({ where: { slug: projectSlug } })
  const wasCreated = !project

  if (!project) {
    project = await prisma.project.create({
      data: {
        slug: projectSlug,
        name: projectName,
        owner: "Arkanya",
        type: template,
        status: "IN_PROGRESS",
        destination:
          projectKind === "client" ? `clients/${projectSlug}` : `products/${projectSlug}`,
        description,
        technologies: [],
        generated: false,
        clientId: clientId ?? null,
      },
    })
  }

  const job = await prisma.job.create({
    data: {
      externalId: jobId,
      projectSlug,
      action: options?.action ?? "generate",
      state: "RUNNING",
      startedAt: new Date(),
    },
  })

  try {
    const healthRes = await fetch(`${WORKER_URL}/health`, {
      signal: AbortSignal.timeout(3_000),
    })
    if (!healthRes.ok) throw new Error("Worker health check failed")
  } catch {
    await prisma.job.update({
      where: { id: job.id },
      data: { state: "ERROR", finishedAt: new Date() },
    })
    return fail(
      `Worker hors ligne (${WORKER_URL}). Lance : pnpm --filter @arkanya/worker dev`,
      503,
    )
  }

  let report: WorkerReport
  try {
    const workerRes = await fetch(`${WORKER_URL}/v1/steps`, {
      method: "POST",
      headers: workerHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        jobId,
        projectSlug,
        projectName,
        projectKind,
        clientId,
        clientCompany,
        description,
        template,
        pages,
        config,
        features,
        delivery,
      }),
      signal: AbortSignal.timeout(600_000),
    })

    report = (await workerRes.json()) as WorkerReport
  } catch (err) {
    const message = err instanceof Error ? err.message : "Worker injoignable"
    await prisma.job.update({
      where: { id: job.id },
      data: { state: "ERROR", finishedAt: new Date() },
    })
    return fail(`Worker injoignable : ${message}`, 502)
  }

  const jobState = report.state === "SUCCESS" ? "SUCCESS" : "ERROR"

  await prisma.job.update({
    where: { id: job.id },
    data: { state: jobState, finishedAt: new Date() },
  })

  await prisma.jobEvent.createMany({
    data: report.steps.map((step) => ({
      jobId: job.id,
      stepId: step.stepId,
      stepType: step.stepType,
      state: step.state,
      message: step.message ?? null,
      startedAt: new Date(step.startedAt),
      finishedAt: step.finishedAt ? new Date(step.finishedAt) : null,
      durationMs: step.durationMs ?? null,
    })),
  })

  const allTimings: TimingEntry[] = report.steps.flatMap((s) => s.timings ?? [])

  if (allTimings.length > 0) {
    await prisma.jobTiming.createMany({
      data: allTimings.map((t) => ({
        jobId: job.id,
        key: t.key,
        label: t.label,
        category: t.category,
        durationMs: t.durationMs,
      })),
    })

    for (const t of allTimings) {
      const existing = await prisma.timingBenchmark.findUnique({ where: { key: t.key } })
      if (existing) {
        const newCount = existing.sampleCount + 1
        const newAvg = (existing.avgMs * existing.sampleCount + t.durationMs) / newCount
        await prisma.timingBenchmark.update({
          where: { key: t.key },
          data: {
            avgMs: newAvg,
            minMs: Math.min(existing.minMs, t.durationMs),
            maxMs: Math.max(existing.maxMs, t.durationMs),
            sampleCount: newCount,
          },
        })
      } else {
        await prisma.timingBenchmark.create({
          data: {
            key: t.key,
            label: t.label,
            category: t.category,
            avgMs: t.durationMs,
            minMs: t.durationMs,
            maxMs: t.durationMs,
            sampleCount: 1,
          },
        })
      }
    }
  }

  if (report.state === "SUCCESS") {
    const deliveryStep = report.steps.find((s) => s.stepType === "delivery")
    const deployUrl = deliveryStep?.url

    await prisma.project.update({
      where: { slug: projectSlug },
      data: {
        generated: true,
        status: "IN_REVIEW",
        technologies: readTemplateTechnologies(template),
        ...(deployUrl ? { url: deployUrl } : {}),
      },
    })
  } else if (wasCreated) {
    await prisma.jobTiming.deleteMany({ where: { jobId: job.id } })
    await prisma.jobEvent.deleteMany({ where: { jobId: job.id } })
    await prisma.job.delete({ where: { id: job.id } })
    await prisma.project.delete({ where: { slug: projectSlug } })
  }

  return ok(report)
}

export async function redeployProject(slug: string): Promise<ActionResult<WorkerReport>> {
  try {
    await requireSession()
  } catch {
    return fail("Non autorisé", 401)
  }

  const project = await prisma.project.findUnique({ where: { slug } })
  if (!project) return fail("Projet introuvable", 404)

  const manifestPath = path.join(TEMPLATES_DIR, project.type, "template.json")
  if (!fs.existsSync(manifestPath)) {
    return fail(`Template introuvable : ${project.type}`)
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as TemplateManifest
  const config = Object.fromEntries(manifest.config.map((f) => [f.id, f.default]))
  if (config["site-name"] !== undefined) config["site-name"] = project.name

  const projectKind = project.destination.startsWith("clients/") ? "client" : "product"

  const payload: WorkerProjectPayload = {
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

  return runWorkerJob(payload, { action: "redeploy" })
}
