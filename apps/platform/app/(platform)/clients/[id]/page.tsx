import { prisma } from "@arkanya/database/client"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

export const dynamic = "force-dynamic"

type ClientPageProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ClientPageProps): Promise<Metadata> {
  const { id } = await params
  const client = await prisma.client.findUnique({ where: { id } })
  return { title: client?.name ?? "Client" }
}

const STATUS_LABELS: Record<string, string> = {
  prospect: "Prospect",
  active: "Actif",
  archived: "Archivé",
}

export default async function ClientDetailPage({ params }: ClientPageProps) {
  const { id } = await params
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      projects: { orderBy: { updatedAt: "desc" } },
    },
  })

  if (!client) notFound()

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-zinc-800">
        <div>
          <Link href="/clients" className="text-[11px] text-zinc-500 hover:text-zinc-300 cursor-pointer">
            ← Clients
          </Link>
          <h1 className="text-xl font-semibold text-zinc-100 leading-tight mt-0.5">{client.name}</h1>
          <p className="text-xs text-zinc-500">{client.company}</p>
        </div>
        <span className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded">
          {STATUS_LABELS[client.status] ?? client.status}
        </span>
      </div>

      <div className="p-4 lg:p-6 space-y-6 max-w-2xl">
        <div className="rounded-lg border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden text-sm">
          <div className="px-3 py-2 flex justify-between gap-4 bg-zinc-900/40">
            <span className="text-zinc-500">Contact</span>
            <span className="text-zinc-300">{client.contact || "—"}</span>
          </div>
          <div className="px-3 py-2 flex justify-between gap-4 bg-zinc-900/40">
            <span className="text-zinc-500">Créé le</span>
            <span className="text-zinc-300">
              {new Date(client.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider mb-2">
            Projets ({client.projects.length})
          </h2>
          {client.projects.length === 0 ? (
            <p className="text-sm text-zinc-600">Aucun projet</p>
          ) : (
            <div className="rounded-lg border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
              {client.projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="px-3 py-2.5 flex items-center justify-between gap-3 bg-zinc-900/40 hover:bg-zinc-800/60 cursor-pointer transition-colors duration-[120ms] ease-out"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-zinc-200 truncate">{p.name}</p>
                    <p className="text-[11px] text-zinc-600 font-mono">{p.slug}</p>
                  </div>
                  <span className="text-[11px] text-zinc-500 shrink-0">{p.status}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
