"use client"

import type { ProjectStatus } from "@arkanya/database"
import { Pencil } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ProjectEditFormProps = {
  slug: string
  initial: {
    name: string
    description: string
    nextAction: string | null
    url: string | null
    port: number | null
    status: ProjectStatus
  }
}

const STATUSES: Array<{ id: ProjectStatus; label: string }> = [
  { id: "TO_QUALIFY", label: "À qualifier" },
  { id: "IN_PROGRESS", label: "En cours" },
  { id: "IN_REVIEW", label: "En validation" },
]

export function ProjectEditForm({ slug, initial }: ProjectEditFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    name: initial.name,
    description: initial.description,
    nextAction: initial.nextAction ?? "",
    url: initial.url ?? "",
    port: initial.port?.toString() ?? "",
    status: initial.status,
  })

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

      const res = await fetch(`/api/projects/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          description: draft.description,
          nextAction: draft.nextAction.trim() || null,
          url: draft.url.trim() || null,
          port,
          status: draft.status,
        }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Erreur")
        return
      }
      setOpen(false)
      router.refresh()
    } catch {
      setError("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        title="Modifier"
        aria-label="Modifier"
        className="p-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors duration-140"
      >
        <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
      </button>
    )
  }

  return (
    <div className="p-4 chassis trim-gold space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="field-label">Nom</span>
          <input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            className="well w-full"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Description</span>
          <textarea
            value={draft.description}
            onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
            rows={2}
            className="well w-full"
          />
        </label>
        <label className="block">
          <span className="field-label">Statut</span>
          <select
            value={draft.status}
            onChange={(e) =>
              setDraft((d) => ({ ...d, status: e.target.value as ProjectStatus }))
            }
            className="well w-full"
          >
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="field-label">Port</span>
          <input
            value={draft.port}
            onChange={(e) => setDraft((d) => ({ ...d, port: e.target.value }))}
            className="well w-full metric"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">URL</span>
          <input
            value={draft.url}
            onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
            className="well w-full metric"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="field-label">Prochaine action</span>
          <input
            value={draft.nextAction}
            onChange={(e) => setDraft((d) => ({ ...d, nextAction: e.target.value }))}
            className="well w-full"
          />
        </label>
      </div>
      {error && <p className="metric text-xs text-danger">{error}</p>}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="slab text-xs px-4 py-2"
        >
          {saving ? "…" : "Enregistrer"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-zinc-400 hover:text-zinc-200 text-xs cursor-pointer transition-colors duration-140"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
