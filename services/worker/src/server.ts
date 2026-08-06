import http from "node:http"
import { config } from "./config.js"
import { validatePayload } from "./validate-payload.js"
import { runPipeline } from "./pipeline.js"
import { jobStore } from "./job-store.js"

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

function json(res: http.ServerResponse, req: http.IncomingMessage, status: number, body: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": corsOrigin(req),
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": corsOrigin(req),
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })
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
