import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@arkanya/database/client"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = (await req.json()) as { name?: string; company?: string }
  const name = body.name?.trim()
  const company = body.company?.trim() || name

  if (!name) return NextResponse.json({ error: "Nom requis" }, { status: 400 })

  const client = await prisma.client.create({
    data: {
      name,
      company: company ?? name,
      status: "prospect",
      contact: "",
    },
    select: { id: true, name: true, company: true },
  })

  return NextResponse.json(client, { status: 201 })
}
