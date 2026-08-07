import { prisma } from "@arkanya/database/client"
import { ClientsInsights } from "@/components/dashboard/clients-insights"
import { ClientsView } from "@/components/clients-view"
import { topSlices, type ChartSlice } from "@/lib/dashboard/chart"
import {
  CLIENT_BAR_PALETTE,
  CLIENT_STATUS_COLORS,
} from "@/lib/dashboard/colors"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Clients" }
export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  })

  const statusCounts = {
    prospect: clients.filter((c) => c.status === "prospect").length,
    active: clients.filter((c) => c.status === "active").length,
    archived: clients.filter((c) => c.status === "archived").length,
  }

  const statusSlices: ChartSlice[] = [
    {
      id: "prospect",
      label: "Prospect",
      value: statusCounts.prospect,
      color: CLIENT_STATUS_COLORS.prospect,
    },
    {
      id: "active",
      label: "Actif",
      value: statusCounts.active,
      color: CLIENT_STATUS_COLORS.active,
    },
    {
      id: "archived",
      label: "Archivé",
      value: statusCounts.archived,
      color: CLIENT_STATUS_COLORS.archived,
    },
  ].filter((s) => s.value > 0)

  const portfolioSlices = topSlices(
    clients
      .filter((c) => c._count.projects > 0)
      .map((client, index) => ({
        id: client.id,
        label: client.company || client.name,
        value: client._count.projects,
        color: CLIENT_BAR_PALETTE[index % CLIENT_BAR_PALETTE.length]!,
        href: `/clients/${client.id}`,
      })),
    5,
  )

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
      insights={
        clients.length > 0 ? (
          <ClientsInsights
            statusSlices={statusSlices}
            portfolioSlices={portfolioSlices}
          />
        ) : null
      }
    />
  )
}
