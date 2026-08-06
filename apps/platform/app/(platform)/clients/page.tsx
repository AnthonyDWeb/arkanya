import { prisma } from "@arkanya/database/client"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Clients" }
export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { _count: { select: { projects: true } } },
    orderBy: { name: "asc" },
  })

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex flex-col justify-center border-b border-zinc-800">
        <h1 className="text-xl font-semibold text-zinc-100">Clients</h1>
        <p className="text-xs text-zinc-500 mt-0.5">{clients.length} clients</p>
      </div>
      <div className="p-4 lg:p-6 grid gap-3 max-w-2xl">
        {clients.map((client) => (
          <div
            key={client.id}
            className="p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">{client.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{client.company}</p>
              </div>
              <span className="text-xs text-zinc-600 font-mono">
                {client._count.projects} projets
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
