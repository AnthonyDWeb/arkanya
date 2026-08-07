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

const STATUS_STYLES: Record<string, string> = {
  prospect: "text-warning",
  active: "text-success",
  archived: "text-zinc-500",
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
    <div className="min-h-full animate-page-in">
      <div className="px-4 lg:px-8 pt-8 pb-6 lg:pt-10 border-b border-white/[0.04]">
        <Link
          href="/clients"
          className="metric text-[10px] tracking-[0.14em] uppercase text-zinc-600 hover:text-zinc-300 transition-colors duration-140"
        >
          ← Clients
        </Link>
        <div className="flex items-end justify-between gap-4 mt-3">
          <div className="min-w-0">
            <h1 className="heading text-4xl sm:text-5xl text-white leading-none truncate">
              {client.name}
            </h1>
            <p className="text-sm text-zinc-500 mt-3">{client.company}</p>
          </div>
          <span
            className={`metric text-[11px] tracking-[0.12em] uppercase shrink-0 ${STATUS_STYLES[client.status] ?? "text-zinc-500"}`}
          >
            <span className={`status-dot inline-block mr-1.5 align-middle ${STATUS_STYLES[client.status] ?? "text-zinc-500"}`} />
            {STATUS_LABELS[client.status] ?? client.status}
          </span>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-8 max-w-2xl">
        <div className="module border border-white/[0.04] px-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6 py-3 border-b border-white/[0.04]">
            <span className="metric text-[10px] tracking-[0.14em] uppercase text-zinc-600 w-36 shrink-0">
              Contact
            </span>
            <span className="text-sm text-zinc-300">{client.contact || "—"}</span>
          </div>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6 py-3">
            <span className="metric text-[10px] tracking-[0.14em] uppercase text-zinc-600 w-36 shrink-0">
              Créé le
            </span>
            <span className="metric text-sm text-zinc-300">
              {new Date(client.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>

        <div>
          <h2 className="metric text-[10px] tracking-[0.16em] text-zinc-600 uppercase mb-3">
            Projets · {String(client.projects.length).padStart(2, "0")}
          </h2>
          {client.projects.length === 0 ? (
            <p className="text-sm text-zinc-600">Aucun projet</p>
          ) : (
            <div className="border-t border-white/[0.04] divide-y divide-white/[0.04]">
              {client.projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="py-3.5 flex items-center justify-between gap-3 hover:bg-elevated/60 -mx-1 px-1 transition-colors duration-140"
                >
                  <div className="min-w-0">
                    <p className="heading text-sm text-zinc-100 truncate">{p.name}</p>
                    <p className="metric text-[11px] text-zinc-600 mt-0.5">{p.slug}</p>
                  </div>
                  <span className="metric text-[10px] tracking-[0.12em] uppercase text-zinc-500 shrink-0">
                    {p.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
