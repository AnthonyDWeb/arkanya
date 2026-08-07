import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getWorkerUrl, workerHeaders } from "@/lib/worker"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { jobId } = await params
  const workerUrl = getWorkerUrl()

  let upstream: Response
  try {
    upstream = await fetch(`${workerUrl}/v1/jobs/${jobId}/events`, {
      headers: workerHeaders({ Accept: "text/event-stream" }),
      cache: "no-store",
    })
  } catch {
    return NextResponse.json({ error: "Worker injoignable" }, { status: 502 })
  }

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Flux SSE indisponible" },
      { status: upstream.status || 502 },
    )
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  })
}
