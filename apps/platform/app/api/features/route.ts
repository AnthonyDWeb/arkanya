import { NextResponse } from "next/server"
import { readFeatures } from "@/lib/catalogue/load-manifests"

export type { FeatureSummary } from "@/types/catalogue"

export async function GET() {
  try {
    return NextResponse.json(readFeatures())
  } catch {
    return NextResponse.json({ error: "Erreur lecture features" }, { status: 500 })
  }
}
