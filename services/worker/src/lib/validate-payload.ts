import type { WorkerProjectPayload } from "@arkanya/contracts/worker"
import type { BuilderDelivery, BuilderPage } from "@arkanya/contracts/builder"

const DELIVERY_TARGETS = new Set(["database", "github", "vercel"])

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function parsePages(value: unknown): BuilderPage[] {
  if (!Array.isArray(value)) {
    throw new Error("pages must be an array")
  }

  return value.map((item, index) => {
    if (!isPlainObject(item)) {
      throw new Error(`pages[${index}] must be an object`)
    }
    const id = item["id"]
    const name = item["name"]
    const slug = item["slug"]
    const source = item["source"]
    const enabled = item["enabled"]
    if (typeof id !== "string" || !id) {
      throw new Error(`pages[${index}].id must be a non-empty string`)
    }
    if (typeof name !== "string" || !name) {
      throw new Error(`pages[${index}].name must be a non-empty string`)
    }
    if (typeof slug !== "string") {
      throw new Error(`pages[${index}].slug must be a string`)
    }
    if (source !== "template" && source !== "custom") {
      throw new Error(`pages[${index}].source must be "template" | "custom"`)
    }
    if (typeof enabled !== "boolean") {
      throw new Error(`pages[${index}].enabled must be a boolean`)
    }
    return { id, name, slug, source, enabled }
  })
}

function parseFeatures(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new Error("features must be an array")
  }
  return value.map((item, index) => {
    if (typeof item !== "string" || !item) {
      throw new Error(`features[${index}] must be a non-empty string`)
    }
    if (item.includes("..") || item.includes("/") || item.includes("\\")) {
      throw new Error(`features[${index}] contains an invalid path segment`)
    }
    return item
  })
}

function parseDelivery(value: unknown): BuilderDelivery {
  if (!isPlainObject(value)) {
    throw new Error("delivery must be an object")
  }
  const targetsRaw = value["targets"]
  if (!Array.isArray(targetsRaw) || targetsRaw.length === 0) {
    throw new Error("delivery.targets must be a non-empty array")
  }
  const targets = targetsRaw.map((t, index) => {
    if (typeof t !== "string" || !DELIVERY_TARGETS.has(t)) {
      throw new Error(`delivery.targets[${index}] is invalid`)
    }
    return t as BuilderDelivery["targets"][number]
  })
  return { targets }
}

function parseConfig(value: unknown): Record<string, string> {
  if (!isPlainObject(value)) {
    throw new Error("config must be a plain object")
  }
  const config: Record<string, string> = {}
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry !== "string") {
      throw new Error(`config.${key} must be a string`)
    }
    config[key] = entry
  }
  return config
}

export function validatePayload(body: unknown): WorkerProjectPayload {
  if (!isPlainObject(body)) {
    throw new Error("Request body must be a JSON object")
  }

  const required = [
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
  ] as const

  for (const key of required) {
    if (body[key] === undefined || body[key] === null) {
      throw new Error(`Missing required field: ${key}`)
    }
  }

  const jobId = body["jobId"]
  const projectSlug = body["projectSlug"]
  const projectName = body["projectName"]
  const projectKind = body["projectKind"]
  const description = body["description"]
  const template = body["template"]
  const objective = body["objective"]
  const clientId = body["clientId"]
  const clientCompany = body["clientCompany"]

  if (typeof jobId !== "string" || !jobId) {
    throw new Error("jobId must be a non-empty string")
  }
  if (typeof projectSlug !== "string" || !/^[a-z0-9-]+$/.test(projectSlug)) {
    throw new Error("projectSlug must match [a-z0-9-]+")
  }
  if (typeof projectName !== "string" || !projectName) {
    throw new Error("projectName must be a non-empty string")
  }
  if (projectKind !== "client" && projectKind !== "product") {
    throw new Error('projectKind must be "client" or "product"')
  }
  if (typeof description !== "string") {
    throw new Error("description must be a string")
  }
  if (typeof template !== "string" || !template) {
    throw new Error("template must be a non-empty string")
  }
  if (template.includes("..") || template.includes("/") || template.includes("\\")) {
    throw new Error("template contains an invalid path segment")
  }
  if (objective !== undefined && typeof objective !== "string") {
    throw new Error("objective must be a string when provided")
  }
  if (clientId !== undefined && typeof clientId !== "string") {
    throw new Error("clientId must be a string when provided")
  }
  if (clientCompany !== undefined && typeof clientCompany !== "string") {
    throw new Error("clientCompany must be a string when provided")
  }

  const payload: WorkerProjectPayload = {
    jobId,
    projectSlug,
    projectName,
    projectKind,
    description,
    template,
    pages: parsePages(body["pages"]),
    config: parseConfig(body["config"]),
    features: parseFeatures(body["features"]),
    delivery: parseDelivery(body["delivery"]),
  }

  if (typeof objective === "string") payload.objective = objective
  if (typeof clientId === "string") payload.clientId = clientId
  if (typeof clientCompany === "string") payload.clientCompany = clientCompany

  return payload
}
