"use client"

import type { Project, ProjectEnvironment, ProjectStatus } from "@arkanya/database"
import { Pencil, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"
import { updateProject } from "@/lib/actions/projects"
import { MetaRow } from "@/components/ui/meta-row"
import { SurfacePanel } from "@/components/ui/surface-panel"
import {
  PROJECT_ENVIRONMENT_LABELS,
  PROJECT_ENVIRONMENTS,
} from "@/lib/projects/environment"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUSES,
} from "@/lib/projects/status"

type ProjectFicheProps = {
  project: Pick<
    Project,
    | "slug"
    | "name"
    | "description"
    | "status"
    | "environment"
    | "generated"
    | "url"
    | "port"
    | "nextAction"
  >
}

type Draft = {
  name: string
  description: string
  status: ProjectStatus
  environment: ProjectEnvironment
  url: string
  port: string
  nextAction: string
}

function dash(value: string | null | undefined): ReactNode {
  if (!value) return <span className="text-zinc-500">—</span>
  return value
}

function toDraft(project: ProjectFicheProps["project"]): Draft {
  return {
    name: project.name,
    description: project.description,
    status: project.status,
    environment: project.environment,
    url: project.url ?? "",
    port: project.port?.toString() ?? "",
    nextAction: project.nextAction ?? "",
  }
}

export function ProjectFiche({ project }: ProjectFicheProps) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(() => toDraft(project))

  useEffect(() => {
    if (!editing) setDraft(toDraft(project))
  }, [project, editing])

  function cancel() {
    setDraft(toDraft(project))
    setError(null)
    setEditing(false)
  }

  async function save() {
    setSaving(true)
    setError(null)
    try {
      const portRaw = draft.port.trim()
      const port =
        portRaw === ""
          ? null
          : Number.isFinite(Number(portRaw))
            ? Number(portRaw)
            : undefined

      if (port === undefined) {
        setError("Port invalide")
        setSaving(false)
        return
      }

      if (!draft.name.trim()) {
        setError("Le nom est requis")
        setSaving(false)
        return
      }

      const result = await updateProject(project.slug, {
        name: draft.name.trim(),
        description: draft.description.trim(),
        status: draft.status,
        environment: draft.environment,
        url: draft.url.trim() || null,
        port,
        nextAction: draft.nextAction.trim() || null,
      })
      if (!result.ok) {
        setError(result.error)
        return
      }
      setEditing(false)
      router.refresh()
    } catch {
      setError("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-2 h-full flex flex-col min-w-0">
      <div className="flex items-center justify-between gap-2 shrink-0">
        <h2 className="metric text-[10px] text-zinc-400">Fiche</h2>
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            title="Modifier la fiche"
            aria-label="Modifier la fiche"
            className="p-1.5 min-h-8 min-w-8 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors duration-140 touch-manipulation"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        ) : (
          <button
            type="button"
            onClick={cancel}
            title="Annuler"
            aria-label="Annuler"
            className="p-1.5 min-h-8 min-w-8 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors duration-140 touch-manipulation"
          >
            <X className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        )}
      </div>

      <SurfacePanel padded className="!py-0.5 flex-1">
        {!editing ? (
          <>
            <MetaRow label="Nom">{project.name}</MetaRow>
            <MetaRow label="Description">{dash(project.description)}</MetaRow>
            <MetaRow label="Statut">
              {PROJECT_STATUS_LABELS[project.status] ?? project.status}
            </MetaRow>
            <MetaRow label="Hébergement">
              {PROJECT_ENVIRONMENT_LABELS[project.environment]}
            </MetaRow>
            <MetaRow label="Slug">
              <code className="metric text-[11px] text-zinc-300">{project.slug}</code>
            </MetaRow>
            <MetaRow label="Généré">
              {project.generated ? (
                <span className="text-brand">Oui</span>
              ) : (
                "Non"
              )}
            </MetaRow>
            <MetaRow label="URL" valueClassName="lg:truncate">
              {project.url ? (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={project.url}
                  className="text-brand hover:underline break-all lg:break-normal lg:truncate lg:block"
                >
                  {project.url}
                </a>
              ) : (
                dash(null)
              )}
            </MetaRow>
            <MetaRow label="Port">
              {project.port != null ? (
                <code className="metric text-[11px]">{project.port}</code>
              ) : (
                dash(null)
              )}
            </MetaRow>
            <MetaRow label="Suite">{dash(project.nextAction)}</MetaRow>
          </>
        ) : (
          <>
            <MetaRow label="Nom">
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                className="well w-full !py-1 !px-2 !text-[12px]"
              />
            </MetaRow>
            <MetaRow label="Description">
              <textarea
                value={draft.description}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, description: e.target.value }))
                }
                rows={2}
                className="well w-full !py-1 !px-2 !text-[12px]"
              />
            </MetaRow>
            <MetaRow label="Statut">
              <select
                value={draft.status}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    status: e.target.value as ProjectStatus,
                  }))
                }
                className="well w-full !py-1 !px-2 !text-[12px]"
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </MetaRow>
            <MetaRow label="Hébergement">
              <select
                value={draft.environment}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    environment: e.target.value as ProjectEnvironment,
                  }))
                }
                className="well w-full !py-1 !px-2 !text-[12px]"
              >
                {PROJECT_ENVIRONMENTS.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.label}
                  </option>
                ))}
              </select>
            </MetaRow>
            <MetaRow label="Slug">
              <code className="metric text-[11px] text-zinc-500">{project.slug}</code>
            </MetaRow>
            <MetaRow label="Généré">
              {project.generated ? (
                <span className="text-brand">Oui</span>
              ) : (
                "Non"
              )}
            </MetaRow>
            <MetaRow label="URL">
              <input
                value={draft.url}
                onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
                className="well w-full !py-1 !px-2 !text-[12px] metric"
                placeholder="https://"
              />
            </MetaRow>
            <MetaRow label="Port">
              <input
                value={draft.port}
                onChange={(e) => setDraft((d) => ({ ...d, port: e.target.value }))}
                className="well w-full !py-1 !px-2 !text-[12px] metric"
                inputMode="numeric"
              />
            </MetaRow>
            <MetaRow label="Suite">
              <input
                value={draft.nextAction}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, nextAction: e.target.value }))
                }
                className="well w-full !py-1 !px-2 !text-[12px]"
              />
            </MetaRow>
          </>
        )}
      </SurfacePanel>

      {editing && (
        <div className="flex flex-wrap items-center gap-2">
          {error && <p className="metric text-[11px] text-danger w-full">{error}</p>}
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="slab text-xs px-4 py-2 min-h-9 touch-manipulation"
          >
            {saving ? "…" : "Enregistrer"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={cancel}
            className="px-3 py-2 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors duration-140 touch-manipulation"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  )
}
