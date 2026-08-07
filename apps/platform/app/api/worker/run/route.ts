import { NextRequest, NextResponse } from "next/server"
import type { WorkerProjectPayload } from "@arkanya/contracts/worker"
import { runWorkerJob } from "@/lib/actions/worker-run"

export async function POST(req: NextRequest) {
  try {
    let payload: WorkerProjectPayload
    try {
      payload = (await req.json()) as WorkerProjectPayload
    } catch {
      return NextResponse.json({ error: "Body JSON invalide" }, { status: 400 })
    }

    const result = await runWorkerJob(payload)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
    }
    return NextResponse.json(result.data, {
      status: result.data.state === "SUCCESS" ? 200 : 422,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur serveur"
    console.error("[worker/run] Erreur non capturée :", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
