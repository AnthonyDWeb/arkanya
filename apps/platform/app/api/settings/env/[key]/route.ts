import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const ALLOWED_KEYS = new Set([
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "WORKER_URL",
  "WORKER_API_KEY",
  "GITHUB_TOKEN",
  "GITHUB_OWNER",
  "VERCEL_TOKEN",
  "VERCEL_ORG_ID",
  "NEXT_PUBLIC_APP_URL",
])

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { key } = await params
  if (!ALLOWED_KEYS.has(key)) {
    return NextResponse.json({ error: "Clé non autorisée" }, { status: 404 })
  }

  const value = process.env[key] ?? ""
  if (!value) {
    return NextResponse.json({ error: "Variable manquante" }, { status: 404 })
  }

  return NextResponse.json({ key, value })
}
