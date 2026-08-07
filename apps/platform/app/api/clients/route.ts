import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/actions/clients"

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Parameters<typeof createClient>[0]
  const result = await createClient(body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }
  return NextResponse.json(result.data, { status: 201 })
}
