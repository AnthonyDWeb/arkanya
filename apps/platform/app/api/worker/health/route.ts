import { NextResponse } from "next/server"

export async function GET() {
  const workerUrl = process.env["WORKER_URL"] ?? "http://127.0.0.1:4000"

  try {
    const res = await fetch(`${workerUrl}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    })
    const data = (await res.json()) as { status: string }
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json({ status: "offline" }, { status: 503 })
  }
}
