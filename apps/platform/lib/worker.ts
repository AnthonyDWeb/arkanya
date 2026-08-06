const WORKER_URL = process.env["WORKER_URL"] ?? "http://127.0.0.1:4000"
const WORKER_API_KEY = process.env["WORKER_API_KEY"] ?? ""

export function getWorkerUrl(): string {
  return WORKER_URL
}

/** Headers HTTP pour appeler le Worker (Bearer si WORKER_API_KEY défini). */
export function workerHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra }
  if (WORKER_API_KEY) {
    headers["Authorization"] = `Bearer ${WORKER_API_KEY}`
  }
  return headers
}
