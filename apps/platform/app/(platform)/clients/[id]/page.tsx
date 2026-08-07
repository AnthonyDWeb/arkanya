import { prisma } from "@arkanya/database/client"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { EmptyState } from "@/components/ui/empty-state"
import { MetaRow } from "@/components/ui/meta-row"
import { SurfacePanel } from "@/components/ui/surface-panel"
import { PROJECT_ENVIRONMENT_LABELS } from "@/lib/projects/environment"
import { PROJECT_STATUS_LABELS } from "@/lib/projects/status"

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

function environmentTone(environment: keyof typeof PROJECT_ENVIRONMENT_LABELS): string {
  if (environment === "PRODUCTION") return "text-gold"
  if (environment === "ONLINE") return "text-brand"
  return "text-zinc-500"
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
    <div className="animate-page-in">
      <header className="px-4 lg:px-6 pt-4 pb-3 border-b border-white/[0.04]">
        <Link
          href="/clients"
          className="metric text-[10px] tracking-[0.14em] uppercase text-zinc-500 hover:text-zinc-300 transition-colors duration-140"
        >
          ← Clients
        </Link>
        <div className="flex items-start justify-between gap-3 mt-2">
          <div className="min-w-0">
            <h1 className="page-title break-words">{client.name}</h1>
            <p className="text-[12px] text-zinc-500 mt-1">{client.company}</p>
          </div>
          <span
            className={`metric text-[10px] tracking-[0.12em] uppercase shrink-0 flex items-center gap-1.5 ${STATUS_STYLES[client.status] ?? "text-zinc-500"}`}
          >
            <span
              className={`status-dot ${STATUS_STYLES[client.status] ?? "text-zinc-500"}`}
            />
            {STATUS_LABELS[client.status] ?? client.status}
          </span>
        </div>
      </header>

      <div className="p-3 sm:p-4 lg:px-6 space-y-3 max-w-md">
        <SurfacePanel padded>
          <MetaRow label="Contact">{client.contact || "—"}</MetaRow>
          <MetaRow label="Créé">
            {new Date(client.createdAt).toLocaleDateString("fr-FR")}
          </MetaRow>
        </SurfacePanel>

        <div>
          <h2 className="metric text-[10px] text-zinc-400 mb-1.5">
            Projets · {String(client.projects.length).padStart(2, "0")}
          </h2>
          {client.projects.length === 0 ? (
            <EmptyState
              title="Aucun projet"
              description="Ce client n’a pas encore de projet lié."
              actionHref="/builder"
              actionLabel="Créer via le Builder →"
            />
          ) : (
            <SurfacePanel>
              {client.projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  className="px-2.5 py-2 flex items-center justify-between gap-2 hover:bg-brand/[0.06] transition-colors duration-140"
                >
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium text-zinc-100 truncate">
                      {p.name}
                    </p>
                    <p className="metric text-[10px] text-zinc-500 mt-0.5 truncate">
                      {p.slug}
                      <span className="text-zinc-700"> · </span>
                      <span className={environmentTone(p.environment)}>
                        {PROJECT_ENVIRONMENT_LABELS[p.environment]}
                      </span>
                    </p>
                  </div>
                  <span className="metric text-[10px] text-zinc-400 shrink-0">
                    {PROJECT_STATUS_LABELS[p.status] ?? p.status}
                  </span>
                </Link>
              ))}
            </SurfacePanel>
          )}
        </div>
      </div>
    </div>
  )
}
