import { NextRequest, NextResponse } from "next/server"
import type { JobProgress } from "@/types/projects"
import { getWorkerUrl, workerHeaders } from "@/lib/worker"

const WORKER_URL = getWorkerUrl()

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params

  try {
    const res = await fetch(`${WORKER_URL}/v1/jobs/${jobId}/progress`, {
      headers: workerHeaders(),
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
