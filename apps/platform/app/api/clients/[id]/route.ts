import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@arkanya/database/client"
import { auth } from "@/lib/auth"

const STATUSES = new Set(["prospect", "active", "archived"])

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const body = (await req.json()) as {
    name?: string
    company?: string
    contact?: string
    status?: string
  }

  const data: {
    name?: string
    company?: string
    contact?: string
    status?: string
  } = {}

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim()
  if (typeof body.company === "string") data.company = body.company.trim() || data.name
  if (typeof body.contact === "string") data.contact = body.contact.trim()
  if (typeof body.status === "string" && STATUSES.has(body.status)) data.status = body.status

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 })
  }

  try {
    const client = await prisma.client.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        company: true,
        contact: true,
        status: true,
      },
    })
    return NextResponse.json(client)
  } catch {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 })
  }
}
