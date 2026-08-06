import { NextRequest, NextResponse } from "next/server"
import type { JobProgress } from "@/app/api/worker/progress/types"

const WORKER_URL = process.env["WORKER_URL"] ?? "http://127.0.0.1:4000"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params

  try {
    const res = await fetch(`${WORKER_URL}/v1/jobs/${jobId}/progress`, {
      signal: AbortSignal.timeout(3_000),
    })

    if (!res.ok) {
      return NextResponse.json<JobProgress>({ steps: [], state: "RUNNING" })
    }

    const data = (await res.json()) as JobProgress
    return NextResponse.json(data)
  } catch {
    return NextResponse.json<JobProgress>({ steps: [], state: "RUNNING" })
  }
}
