import fs from "node:fs"
import http from "node:http"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { config } from "./config.js"
import { resolveUnderRoot } from "./lib/path-safe.js"
import { validatePayload } from "./lib/validate-payload.js"
import { runPipeline } from "./pipeline.js"
import { jobStore, subscribeJob } from "./job-store.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MONOREPO_ROOT = path.resolve(__dirname, "../../..")

const DESTINATION_RE = /^(clients|products)\/[a-z0-9][a-z0-9-]*$/i

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ""
    req.on("data", (chunk: Buffer) => {
      data += chunk.toString()
    })
    req.on("end", () => resolve(data))
    req.on("error", reject)
  })
}

function corsOrigin(req: http.IncomingMessage): string {
  const origin = req.headers["origin"]
  if (typeof origin === "string" && origin.length > 0) return origin
  return config.mode === "remote" ? "https://platform.arkanya.fr" : "http://localhost:3000"
}

function corsHeaders(req: http.IncomingMessage): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": corsOrigin(req),
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  }
}

function json(res: http.ServerResponse, req: http.IncomingMessage, status: number, body: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    ...corsHeaders(req),
  })
  res.end(JSON.stringify(body))
}

/** Auth Bearer requise dès qu'une WORKER_API_KEY est configurée (/health exclus). */
function isAuthorized(req: http.IncomingMessage): boolean {
  if (!config.apiKey) return true
  const header = req.headers["authorization"]
  if (typeof header !== "string") return false
  const [scheme, token] = header.split(" ")
  return scheme === "Bearer" && token === config.apiKey
}

function writeSse(
  res: http.ServerResponse,
  event: string,
  data: unknown,
): void {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

function handleJobEvents(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  jobId: string,
): void {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    ...corsHeaders(req),
  })

  const existing = jobStore.get(jobId)
  if (existing) {
    writeSse(res, "progress", existing)
    if (existing.state === "SUCCESS" || existing.state === "ERROR") {
      res.end()
      return
    }
  } else {
    writeSse(res, "progress", { steps: [], state: "RUNNING" })
  }

  const unsubscribe = subscribeJob(jobId, (progress) => {
    writeSse(res, "progress", progress)
    if (progress.state === "SUCCESS" || progress.state === "ERROR") {
      clearInterval(keepalive)
      unsubscribe()
      res.end()
    }
  })

  const keepalive = setInterval(() => {
    res.write(`: ping\n\n`)
  }, 15_000)

  req.on("close", () => {
    clearInterval(keepalive)
    unsubscribe()
  })
}

function deleteLocalProject(destination: string): { ok: boolean; error?: string } {
  if (config.mode === "remote") {
    return { ok: true }
  }

  if (!DESTINATION_RE.test(destination)) {
    return { ok: false, error: "Destination invalide" }
  }

  const [kind, slug] = destination.split("/") as [string, string]
  try {
    const kindRoot = path.resolve(MONOREPO_ROOT, kind)
    const target = resolveUnderRoot(kindRoot, slug, "destination")
    if (fs.existsSync(target)) {
      fs.rmSync(target, { recursive: true, force: true })
    }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) }
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders(req))
    res.end()
    return
  }

  if (req.method === "GET" && (req.url === "/health" || req.url === "/")) {
    json(res, req, 200, { status: "ok", mode: config.mode })
    return
  }

  if (!isAuthorized(req)) {
    json(res, req, 401, { error: "Unauthorized" })
    return
  }

  const progressMatch = req.method === "GET" && req.url?.match(/^\/v1\/jobs\/([^/]+)\/progress$/)
  if (progressMatch) {
    const jobId = progressMatch[1]
    const progress = jobId ? jobStore.get(jobId) : undefined
    if (!progress) {
      json(res, req, 404, { error: "Job introuvable" })
      return
    }
    json(res, req, 200, progress)
    return
  }

  const eventsMatch = req.method === "GET" && req.url?.match(/^\/v1\/jobs\/([^/]+)\/events$/)
  if (eventsMatch) {
    const jobId = eventsMatch[1]
    if (jobId) {
      handleJobEvents(req, res, jobId)
      return
    }
  }

  if (req.method === "POST" && req.url === "/v1/fs/delete") {
    try {
      const raw = await readBody(req)
      const body = JSON.parse(raw) as { destination?: string }
      const destination = body.destination?.trim()
      if (!destination) {
        json(res, req, 400, { error: "destination requis" })
        return
      }
      const result = deleteLocalProject(destination)
      json(res, req, result.ok ? 200 : 400, result)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue"
      json(res, req, 400, { error: message })
    }
    return
  }

  if (req.method === "POST" && req.url === "/v1/steps") {
    try {
      const raw = await readBody(req)
      const body = JSON.parse(raw) as unknown

      const payload = validatePayload(body)

      console.log(`[worker] Pipeline démarré — job:${payload.jobId} projet:${payload.projectSlug}`)

      const report = await runPipeline(payload)

      console.log(`[worker] Pipeline terminé — ${report.state} en ${report.durationMs}ms`)

      json(res, req, report.state === "SUCCESS" ? 200 : 422, report)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue"
      console.error(`[worker] Erreur :`, message)
      json(res, req, 400, { error: message })
    }
    return
  }

  json(res, req, 404, { error: "Not Found" })
})

server.listen(config.port, config.host, () => {
  console.log(`Worker [${config.mode}] listening on http://${config.host}:${config.port}`)
})
