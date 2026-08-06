import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import type { WorkerProjectPayload, WorkerStepReport } from "@arkanya/contracts/worker"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO_ROOT = path.resolve(__dirname, "../../../..")

export function getProjectDir(payload: WorkerProjectPayload): string {
  const base = payload.projectKind === "client" ? "clients" : "products"
  const root = path.resolve(MONOREPO_ROOT, base)
  const resolved = path.resolve(root, payload.projectSlug)

  const rel = path.relative(root, resolved)
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    throw new Error("Path traversal detected in projectSlug")
  }

  return resolved
}

export async function runInitialize(payload: WorkerProjectPayload): Promise<WorkerStepReport> {
  const startedAt = new Date().toISOString()
  const start = Date.now()

  try {
    const projectDir = getProjectDir(payload)

    fs.mkdirSync(projectDir, { recursive: true })

    const manifest = {
      jobId: payload.jobId,
      projectSlug: payload.projectSlug,
      projectName: payload.projectName,
      template: payload.template,
      generatedAt: startedAt,
    }

    fs.writeFileSync(
      path.join(projectDir, ".arkanya-generated.json"),
      JSON.stringify(manifest, null, 2),
    )

    return {
      stepId: crypto.randomUUID(),
      stepType: "initialize",
      state: "SUCCESS",
      message: `Dossier créé : ${projectDir}`,
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    }
  } catch (err) {
    return {
      stepId: crypto.randomUUID(),
      stepType: "initialize",
      state: "ERROR",
      message: err instanceof Error ? err.message : String(err),
      startedAt,
      finishedAt: new Date().toISOString(),
      durationMs: Date.now() - start,
    }
  }
}
