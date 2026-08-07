"use server"

import { prisma } from "@arkanya/database/client"
import { fail, ok, type ActionResult } from "@/lib/actions/result"
import { requireSession } from "@/lib/actions/session"

const STATUSES = new Set(["prospect", "active", "archived"])

type ClientInput = {
  name?: string
  company?: string
  contact?: string
  status?: string
}

type ClientDto = {
  id: string
  name: string
  company: string
  contact: string
  status: string
}

export async function createClient(
  body: ClientInput,
): Promise<ActionResult<ClientDto>> {
  try {
    await requireSession()
  } catch {
    return fail("Non autorisé", 401)
  }

  const name = body.name?.trim()
  const company = body.company?.trim() || name
  const contact = body.contact?.trim() ?? ""
  const status =
    body.status === "active" || body.status === "archived" ? body.status : "prospect"

  if (!name) return fail("Nom requis")

  const client = await prisma.client.create({
    data: {
      name,
      company: company ?? name,
      status,
      contact,
    },
    select: {
      id: true,
      name: true,
      company: true,
      contact: true,
      status: true,
    },
  })

  return ok(client)
}

export async function updateClient(
  id: string,
  body: ClientInput,
): Promise<ActionResult<ClientDto>> {
  try {
    await requireSession()
  } catch {
    return fail("Non autorisé", 401)
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
    return fail("Aucun champ à mettre à jour")
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
    return ok(client)
  } catch {
    return fail("Client introuvable", 404)
  }
}

export async function deleteClient(id: string): Promise<ActionResult<{ deleted: true }>> {
  try {
    await requireSession()
  } catch {
    return fail("Non autorisé", 401)
  }

  const projectCount = await prisma.project.count({ where: { clientId: id } })
  if (projectCount > 0) {
    return fail(`Impossible : ${projectCount} projet(s) encore liés`, 409)
  }

  try {
    await prisma.client.delete({ where: { id } })
    return ok({ deleted: true })
  } catch {
    return fail("Client introuvable", 404)
  }
}
