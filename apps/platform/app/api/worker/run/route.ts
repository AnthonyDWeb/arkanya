import fs from "node:fs"
import path from "node:path"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@arkanya/database/client"
import { auth } from "@/lib/auth"
import type { WorkerProjectPayload, WorkerReport, TimingEntry } from "@arkanya/contracts/worker"

const WORKER_URL = process.env["WORKER_URL"] ?? "http://127.0.0.1:4000"
const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
const TEMPLATES_DIR = path.join(MONOREPO_ROOT, "templates")

function readTemplateTechnologies(templateId: string): string[] {
  try {
    const manifestPath = path.join(TEMPLATES_DIR, templateId, "template.json")
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as { technologies?: string[] }
    return manifest.technologies ?? []
  } catch {
    return []
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    let payload: WorkerProjectPayload
    try {
      payload = (await req.json()) as WorkerProjectPayload
    } catch {
      return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 })
    }

    const { jobId, projectSlug, projectName, projectKind, clientId, description, template, pages, config, features, delivery } = payload

    if (!jobId || !projectSlug || !projectName || !template) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 })
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
          destination: projectKind === "client" ? `clients/${projectSlug}` : `products/${projectSlug}`,
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
        action: "generate",
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
      return NextResponse.json(
        { error: `Worker hors ligne (${WORKER_URL}). Lance : pnpm --filter @arkanya/worker dev` },
        { status: 503 },
      )
    }

    let report: WorkerReport
    try {
      const workerRes = await fetch(`${WORKER_URL}/v1/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, projectSlug, projectName, projectKind, clientId, clientCompany, description, template, pages, config, features, delivery }),
        signal: AbortSignal.timeout(600_000),
      })

      report = (await workerRes.json()) as WorkerReport
    } catch (err) {
      const message = err instanceof Error ? err.message : "Worker injoignable"

      await prisma.job.update({
        where: { id: job.id },
        data: { state: "ERROR", finishedAt: new Date() },
      })

      return NextResponse.json({ error: `Worker injoignable : ${message}` }, { status: 502 })
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
      // Le projet vient d'être créé mais la génération a échoué — on nettoie
      await prisma.jobTiming.deleteMany({ where: { jobId: job.id } })
      await prisma.jobEvent.deleteMany({ where: { jobId: job.id } })
      await prisma.job.delete({ where: { id: job.id } })
      await prisma.project.delete({ where: { slug: projectSlug } })
    }

    return NextResponse.json(report, { status: report.state === "SUCCESS" ? 200 : 422 })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur"
    console.error("[worker/run] Erreur non capturée :", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
