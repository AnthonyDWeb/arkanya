import type { WorkerProjectPayload } from "@arkanya/contracts/worker"

export function validatePayload(body: unknown): WorkerProjectPayload {
  if (!body || typeof body !== "object") {
    throw new Error("Request body must be a JSON object")
  }

  const b = body as Record<string, unknown>

  const required: string[] = [
    "jobId",
    "projectSlug",
    "projectName",
    "projectKind",
    "description",
    "template",
    "pages",
    "config",
    "features",
    "delivery",
  ]

  for (const key of required) {
    if (b[key] === undefined || b[key] === null) {
      throw new Error(`Missing required field: ${key}`)
    }
  }

  if (typeof b["jobId"] !== "string" || !b["jobId"]) {
    throw new Error("jobId must be a non-empty string")
  }
  if (typeof b["projectSlug"] !== "string" || !/^[a-z0-9-]+$/.test(b["projectSlug"])) {
    throw new Error("projectSlug must match [a-z0-9-]+")
  }
  if (typeof b["projectName"] !== "string" || !b["projectName"]) {
    throw new Error("projectName must be a non-empty string")
  }
  if (b["projectKind"] !== "client" && b["projectKind"] !== "product") {
    throw new Error('projectKind must be "client" or "product"')
  }
  if (typeof b["template"] !== "string" || !b["template"]) {
    throw new Error("template must be a non-empty string")
  }
  if (!Array.isArray(b["pages"])) {
    throw new Error("pages must be an array")
  }
  if (typeof b["config"] !== "object" || Array.isArray(b["config"])) {
    throw new Error("config must be a plain object")
  }
  if (!Array.isArray(b["features"])) {
    throw new Error("features must be an array")
  }

  return b as unknown as WorkerProjectPayload
}
