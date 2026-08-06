import { prisma } from "@arkanya/database/client"
import type { Metadata } from "next"
import { ClientsView } from "@/components/clients-view"

export const metadata: Metadata = { title: "Clients" }
export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <ClientsView
      clients={clients.map((c) => ({
        id: c.id,
        name: c.name,
        company: c.company,
        contact: c.contact,
        status: c.status,
        projectCount: c._count.projects,
      }))}
    />
  )
}
