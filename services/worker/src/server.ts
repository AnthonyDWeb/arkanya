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

function json(res: http.ServerResponse, status: number, body: unknown) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  })
  res.end(JSON.stringify(body))
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    })
    res.end()
    return
  }

  if (req.method === "GET" && req.url === "/health") {
    json(res, 200, { status: "ok", mode: config.mode })
    return
  }

  const progressMatch = req.method === "GET" && req.url?.match(/^\/v1\/jobs\/([^/]+)\/progress$/)
  if (progressMatch) {
    const jobId = progressMatch[1]
    const progress = jobId ? jobStore.get(jobId) : undefined
    if (!progress) {
      json(res, 404, { error: "Job introuvable" })
      return
    }
    json(res, 200, progress)
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

      json(res, report.state === "SUCCESS" ? 200 : 422, report)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur inconnue"
      console.error(`[worker] Erreur :`, message)
      json(res, 400, { error: message })
    }
    return
  }

  json(res, 404, { error: "Not Found" })
})

server.listen(config.port, config.host, () => {
  console.log(`Worker [${config.mode}] listening on http://${config.host}:${config.port}`)
})
