import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.resolve(__dirname, "../.env")

try {
  const content = fs.readFileSync(envPath, "utf-8")
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([^#=\s][^=]*?)\s*=\s*(['"]?)(.*)\2\s*$/)
    if (m?.[1] && m[3] !== undefined) {
      process.env[m[1]] = m[3]
    }
  }
} catch {
  // Pas de .env local — on utilise les variables d'environnement système (Railway/CI)
}

const mode = process.env["WORKER_MODE"] ?? "local"
if (mode !== "local" && mode !== "remote") {
  throw new Error(`Invalid WORKER_MODE: ${mode}. Expected "local" or "remote".`)
}

export const config = {
  port: parseInt(process.env["WORKER_PORT"] ?? "4000", 10),
  host: "127.0.0.1",
  mode: mode as "local" | "remote",
  github: {
    token: process.env["GITHUB_TOKEN"] ?? "",
    owner: process.env["GITHUB_OWNER"] ?? "",
  },
  vercel: {
    token: process.env["VERCEL_TOKEN"] ?? "",
    orgId: process.env["VERCEL_ORG_ID"] ?? "",
  },
} as const
