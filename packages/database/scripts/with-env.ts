/**
 * Charge DATABASE_URL depuis apps/platform/.env (contexte monorepo)
 * ou depuis packages/database/.env (contexte standalone / CI).
 * Puis exécute la commande passée en argument.
 *
 * Usage : tsx scripts/with-env.ts prisma migrate dev
 */

import { execSync } from "node:child_process"
import { cpSync, existsSync, readFileSync, readdirSync } from "node:fs"
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

// Priorité : platform .env → local .env → env déjà défini
const candidates = [
  resolve(process.cwd(), "../../apps/platform/.env"),
  resolve(process.cwd(), ".env"),
]

let loaded = false
for (const candidate of candidates) {
  if (existsSync(candidate)) {
    const vars = parseDotenv(readFileSync(candidate, "utf-8"))
    for (const [key, val] of Object.entries(vars)) {
      process.env[key] ??= val
    }
    loaded = true
    break
  }
}

if (!loaded && !process.env["DATABASE_URL"]) {
  console.error(
    "Erreur : DATABASE_URL introuvable.\n" +
      "Créer apps/platform/.env ou packages/database/.env avec DATABASE_URL.",
  )
  process.exit(1)
}

const cmd = process.argv.slice(2).join(" ")
if (!cmd) {
  console.error("Usage : tsx scripts/with-env.ts <commande>")
  process.exit(1)
}

execSync(cmd, { stdio: "inherit", shell: true })

// Après prisma generate ou migrate : synchronise le client vers le store pnpm.
// Sans ça, @prisma/client dans le store charge un client stale (sans les nouveaux modèles).
if (cmd.includes("prisma generate") || cmd.includes("prisma migrate")) {
  syncPrismaClientToStore()
}

function syncPrismaClientToStore() {
  const generatedClient = resolve(process.cwd(), "node_modules/.prisma/client")
  if (!existsSync(generatedClient)) return

  // Trouve le répertoire @prisma/client dans le store pnpm
  const pnpmStore = resolve(process.cwd(), "../../node_modules/.pnpm")
  if (!existsSync(pnpmStore)) return

  const storeEntries = readdirSync(pnpmStore).filter((d) =>
    d.startsWith("@prisma+client@"),
  )

  for (const entry of storeEntries) {
    const storeClient = resolve(pnpmStore, entry, "node_modules/.prisma/client")
    if (existsSync(storeClient)) {
      cpSync(generatedClient, storeClient, { recursive: true, force: true })
    }
  }
}
