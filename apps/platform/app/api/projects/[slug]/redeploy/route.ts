import { NextResponse } from "next/server"
import { redeployProject } from "@/lib/actions/worker-run"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const result = await redeployProject(slug)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }
  return NextResponse.json(result.data, {
    status: result.data.state === "SUCCESS" ? 200 : 422,
  })
}
