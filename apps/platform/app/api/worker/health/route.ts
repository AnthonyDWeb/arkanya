import { NextResponse } from "next/server"
import { getWorkerUrl } from "@/lib/worker"

export async function GET() {
  const workerUrl = getWorkerUrl()

  try {
    const res = await fetch(`${workerUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    })
    const data = (await res.json()) as { status: string; mode?: string }
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ status: "offline" }, { status: 503 })
  }
}
