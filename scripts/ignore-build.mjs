#!/usr/bin/env node
/**
 * Ignored Build Step — Vercel / Railway
 *
 * Usage:
 *   node scripts/ignore-build.mjs <target>
 *   node scripts/ignore-build.mjs --list
 *
 * Exit codes (convention Vercel):
 *   0 → skip build
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
  return resolveDynamicTarget(name)
}

function listChangedPaths(root, fromSha, toSha, watchPaths) {
  const existing = watchPaths.filter((p) => fs.existsSync(path.join(root, p)))
  if (existing.length === 0) return ["(aucun chemin watché sur le disque)"]

  try {
    const out = execFileSync(
      "git",
      ["diff", "--name-only", fromSha, toSha, "--", ...existing],
      { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    )
    return out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  } catch {
    // Diff impossible (force-push, historique manquant) → builder par sécurité
    return ["(diff git indisponible)"]
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
    process.exit(1)
  }

  const root = findMonorepoRoot(__dirname)
  const prev = process.env["VERCEL_GIT_PREVIOUS_SHA"]
  const curr = process.env["VERCEL_GIT_COMMIT_SHA"] ?? "HEAD"

  if (!prev) {
    console.log(`[ignore-build:${arg}] Pas de commit précédent → build`)
    process.exit(1)
  }

  if (prev === curr) {
    console.log(`[ignore-build:${arg}] SHA inchangé → skip`)
    process.exit(0)
  }

  const changed = listChangedPaths(root, prev, curr, target.paths)

  if (changed.length > 0) {
    console.log(`[ignore-build:${arg}] Changements → build`)
    for (const file of changed.slice(0, 20)) {
      console.log(`  - ${file}`)
    }
    process.exit(1)
  }

  console.log(`[ignore-build:${arg}] Aucun chemin pertinent modifié → skip`)
  process.exit(0)
}

main()
