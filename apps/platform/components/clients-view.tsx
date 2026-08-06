"use client"

import { Eye, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ClientRow = {
  id: string
  name: string
  company: string
  contact: string
  status: string
  projectCount: number
}

type ClientsViewProps = {
  clients: ClientRow[]
}

const STATUS_OPTIONS = [
  { id: "prospect", label: "Prospect" },
  { id: "active", label: "Actif" },
  { id: "archived", label: "Archivé" },
] as const

const STATUS_STYLES: Record<string, string> = {
  prospect: "bg-amber-500/15 text-amber-400",
  active: "bg-emerald-500/15 text-emerald-400",
  archived: "bg-zinc-700 text-zinc-400",
}

type Draft = {
  name: string
  company: string
  contact: string
  status: string
}

const EMPTY_DRAFT: Draft = {
  name: "",
  company: "",
  contact: "",
  status: "prospect",
}

export function ClientsView({ clients }: ClientsViewProps) {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function startCreate() {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setCreating(true)
    setError(null)
  }

  function startEdit(client: ClientRow) {
    setCreating(false)
    setEditingId(client.id)
    setDraft({
      name: client.name,
      company: client.company,
      contact: client.contact,
      status: client.status || "prospect",
    })
    setError(null)
  }

  function cancel() {
    setCreating(false)
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
    setError(null)
  }

  async function remove(client: ClientRow) {
    if (client.projectCount > 0) {
      setError(`Impossible de supprimer : ${client.projectCount} projet(s) liés`)
      return
    }
    if (!window.confirm(`Supprimer ${client.name} ?`)) return
    setError(null)
    try {
      const res = await fetch(`/api/clients/${client.id}`, { method: "DELETE" })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Erreur")
        return
      }
      router.refresh()
    } catch {
      setError("Erreur réseau")
    }
  }

  async function save() {
    if (!draft.name.trim()) {
      setError("Nom requis")
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = editingId
        ? await fetch(`/api/clients/${editingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
          })
        : await fetch("/api/clients", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(draft),
          })

      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error ?? "Erreur")
        return
      }
      cancel()
      router.refresh()
    } catch {
      setError("Erreur réseau")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">Clients</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{clients.length} clients</p>
        </div>
        {!creating && !editingId && (
          <button
            type="button"
            onClick={startCreate}
            className="px-3 py-1.5 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out hover:opacity-90"
          >
            + Nouveau
          </button>
        )}
      </div>

      <div className="p-4 lg:p-6 space-y-3 max-w-2xl">
        {(creating || editingId) && (
          <div className="p-4 bg-zinc-800/60 border border-zinc-700 rounded-lg space-y-3">
            <p className="text-sm font-medium text-zinc-200">
              {editingId ? "Modifier le client" : "Nouveau client"}
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block space-y-1">
                <span className="text-xs text-zinc-500">Nom</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 outline-none focus:border-brand"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-zinc-500">Société</span>
                <input
                  value={draft.company}
                  onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 outline-none focus:border-brand"
                />
              </label>
              <label className="block space-y-1 sm:col-span-2">
                <span className="text-xs text-zinc-500">Contact</span>
                <input
                  value={draft.contact}
                  onChange={(e) => setDraft((d) => ({ ...d, contact: e.target.value }))}
                  placeholder="email ou téléphone"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 outline-none focus:border-brand"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-xs text-zinc-500">Statut</span>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 outline-none focus:border-brand"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="px-4 py-2 bg-brand text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-opacity duration-[120ms] ease-out"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="px-4 py-2 text-zinc-400 hover:text-zinc-200 text-sm transition-colors duration-[120ms] ease-out"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {clients.length === 0 && !creating ? (
          <div className="p-8 text-center border border-dashed border-zinc-800 rounded-lg">
            <p className="text-sm text-zinc-500 mb-3">Aucun client pour l’instant</p>
            <button
              type="button"
              onClick={startCreate}
              className="text-sm text-brand hover:underline"
            >
              Créer le premier client
            </button>
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client.id}
              className="p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-sm font-medium text-zinc-100 hover:text-white cursor-pointer"
                    >
                      {client.name}
                    </Link>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${STATUS_STYLES[client.status] ?? STATUS_STYLES["prospect"]}`}
                    >
                      {STATUS_OPTIONS.find((s) => s.id === client.status)?.label ?? client.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{client.company}</p>
                  {client.contact && (
                    <p className="text-xs text-zinc-600 mt-1">{client.contact}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-zinc-600 font-mono">
                    {client.projectCount} projets
                  </span>
                  <Link
                    href={`/clients/${client.id}`}
                    title="Voir"
                    aria-label="Voir"
                    className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors duration-[120ms] ease-out"
                  >
                    <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => startEdit(client)}
                    title="Modifier"
                    aria-label="Modifier"
                    className="p-1 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors duration-[120ms] ease-out"
                  >
                    <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(client)}
                    title="Supprimer"
                    aria-label="Supprimer"
                    className="p-1 text-red-400/80 hover:text-red-400 cursor-pointer transition-colors duration-[120ms] ease-out"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
