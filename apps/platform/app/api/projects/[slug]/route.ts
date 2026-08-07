import { NextRequest, NextResponse } from "next/server"
import { deleteProject, updateProject } from "@/lib/actions/projects"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const body = (await req.json()) as Parameters<typeof updateProject>[1]
  const result = await updateProject(slug, body)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }
  return NextResponse.json(result.data)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const result = await deleteProject(slug)
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }
  return NextResponse.json({
    ok: true,
    steps: result.data.steps,
    warnings: result.data.warnings,
  })
}
