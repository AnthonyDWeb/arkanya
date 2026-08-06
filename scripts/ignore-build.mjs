#!/usr/bin/env node
/**
 * Ignored Build Step — Vercel / Railway
 *
 * Usage:
 *   node scripts/ignore-build.mjs <target>
 *   node scripts/ignore-build.mjs --list
 *
 * Targets:
 *   platform | account | worker | anthony-delforge | arkanya-website
 *   arknest | arkcare | lesservicesdemathilde
 *   product:<slug>   (tous les produits internes)
 *   client:<slug>    (tous les clients, y compris Arkanya)
 *
 * Exit codes (convention Vercel):
 *   0 → skip build (aucun changement pertinent)
 *   1 → proceed with build
 */

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { projects, resolveDynamicTarget } from "./ignore-build.config.mjs"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function findMonorepoRoot(startDir) {
  let dir = startDir
  while (true) {
    if (fs.existsSync(path.join(dir, "pnpm-workspace.yaml"))) return dir
    const parent = path.dirname(dir)
    if (parent === dir) {
      throw new Error("Racine monorepo introuvable (pnpm-workspace.yaml)")
    }
    dir = parent
  }
}

function resolveTarget(name) {
  if (projects[name]) return projects[name]
  const dynamic = resolveDynamicTarget(name)
  if (dynamic) return dynamic
  return null
}

function gitDiffHasChanges(root, fromSha, toSha, watchPaths) {
  const existing = watchPaths.filter((p) => fs.existsSync(path.join(root, p)))
  if (existing.length === 0) return true

  try {
    execFileSync("git", ["diff", "--quiet", fromSha, toSha, "--", ...existing], {
      cwd: root,
      stdio: "ignore",
    })
    return false
  } catch {
    return true
  }
}

function printList() {
  console.log("Cibles ignore-build :\n")
  for (const [name, cfg] of Object.entries(projects)) {
    console.log(`  ${name}`)
    console.log(`    root: ${cfg.root ?? "(n/a)"}`)
    console.log(`    paths: ${cfg.paths.join(", ")}`)
    if (cfg.note) console.log(`    note: ${cfg.note}`)
    console.log()
  }
  console.log("  product:<slug>  → products/<slug> + packages")
  console.log("  client:<slug>   → clients/<slug> + packages")
}

function main() {
  const arg = process.argv[2]

  if (!arg || arg === "--help" || arg === "-h") {
    console.log("Usage: node scripts/ignore-build.mjs <target>")
    console.log("       node scripts/ignore-build.mjs --list")
    process.exit(1)
  }

  if (arg === "--list") {
    printList()
    process.exit(0)
  }

  const target = resolveTarget(arg)
  if (!target) {
    console.error(`Cible inconnue: ${arg}`)
    console.error("Utilise --list pour voir les cibles disponibles.")
    process.exit(1)
  }

  const root = findMonorepoRoot(__dirname)
  const prev = process.env["VERCEL_GIT_PREVIOUS_SHA"]
  const curr = process.env["VERCEL_GIT_COMMIT_SHA"] ?? "HEAD"

  // Premier déploiement ou SHA précédent absent → toujours builder
  if (!prev) {
    console.log(`[ignore-build:${arg}] Pas de commit précédent → build`)
    process.exit(1)
  }

  const changed = gitDiffHasChanges(root, prev, curr, target.paths)

  if (changed) {
    console.log(`[ignore-build:${arg}] Changements détectés → build`)
    process.exit(1)
  }

  console.log(`[ignore-build:${arg}] Aucun changement pertinent → skip`)
  process.exit(0)
}

main()
