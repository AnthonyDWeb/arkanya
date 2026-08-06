/**
 * Charge DATABASE_URL depuis apps/platform/.env (contexte monorepo)
 * ou depuis packages/database/.env (contexte standalone / CI).
 * Puis exécute la commande passée en argument.
 *
 * Usage : tsx scripts/with-env.ts prisma migrate dev
 */

import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

function parseDotenv(content: string): Record<string, string> {
  const vars: Record<string, string> = {}
  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx < 0) continue
    const key = trimmed.slice(0, eqIdx).trim()
    const rawVal = trimmed.slice(eqIdx + 1).trim()
    vars[key] = rawVal.replace(/^["']|["']$/g, "")
  }
  return vars
}

const candidates = [
  resolve(process.cwd(), "../../apps/platform/.env"),
  resolve(process.cwd(), ".env"),
]

for (const envPath of candidates) {
  if (!existsSync(envPath)) continue
  const vars = parseDotenv(readFileSync(envPath, "utf-8"))
  for (const [key, value] of Object.entries(vars)) {
    if (process.env[key] === undefined) process.env[key] = value
  }
  break
}

const cmd = process.argv.slice(2).join(" ")
if (!cmd) {
  console.error("Usage : tsx scripts/with-env.ts <commande>")
  process.exit(1)
}

execSync(cmd, { stdio: "inherit", shell: true })
