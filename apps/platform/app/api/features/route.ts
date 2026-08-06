import fs from "node:fs"
import path from "node:path"
import { NextResponse } from "next/server"

const MONOREPO_ROOT = path.resolve(process.cwd(), "../..")
const FEATURES_DIR = path.join(MONOREPO_ROOT, "features")

export type FeatureSummary = {
  id: string
  name: string
  description: string
}

export async function GET() {
  try {
    if (!fs.existsSync(FEATURES_DIR)) {
      return NextResponse.json([])
    }

    const entries = fs.readdirSync(FEATURES_DIR, { withFileTypes: true })
    const features: FeatureSummary[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const manifestPath = path.join(FEATURES_DIR, entry.name, "feature.json")
      if (!fs.existsSync(manifestPath)) continue

      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as FeatureSummary
      features.push({ id: manifest.id, name: manifest.name, description: manifest.description })
    }

    return NextResponse.json(features)
  } catch {
    return NextResponse.json({ error: "Erreur lecture features" }, { status: 500 })
  }
}
