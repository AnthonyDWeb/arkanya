"use client"

import { Eye, Pencil, Search, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { createClient, deleteClient, updateClient } from "@/lib/actions/clients"
import { ConfirmActionModal } from "./confirm-action-modal"
import type { ClientDraft, ClientRow } from "@/types/clients"

type ClientsViewProps = {
  clients: ClientRow[]
}

const STATUS_OPTIONS = [
  { id: "prospect", label: "Prospect" },
  { id: "active", label: "Actif" },
  { id: "archived", label: "Archivé" },
] as const

const STATUS_STYLES: Record<string, string> = {
  prospect: "text-warning",
  active: "text-success",
  archived: "text-zinc-500",
}

type Draft = ClientDraft

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
  const [deleteTarget, setDeleteTarget] = useState<ClientRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase()
    return clients.filter((client) => {
      if (statusFilter !== "all" && client.status !== statusFilter) return false
      if (!q) return true
      return (
        client.name.toLowerCase().includes(q) ||
        client.company.toLowerCase().includes(q) ||
        client.contact.toLowerCase().includes(q)
      )
    })
  }, [clients, query, statusFilter])

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

  function requestRemove(client: ClientRow) {
    if (client.projectCount > 0) {
      setError(`Impossible de supprimer : ${client.projectCount} projet(s) liés`)
      return
    }
    setDeleteError(null)
    setDeleteTarget(client)
  }

  async function confirmRemove() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const result = await deleteClient(deleteTarget.id)
      if (!result.ok) {
        setDeleteError(result.error)
        return
      }
      setDeleteTarget(null)
      router.refresh()
    } catch {
      setDeleteError("Erreur réseau")
    } finally {
      setDeleting(false)
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
      const result = editingId
        ? await updateClient(editingId, draft)
        : await createClient(draft)

      if (!result.ok) {
        setError(result.error)
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
    <div className="min-h-full animate-page-in">
      <header className="page-head">
        <div className="flex items-baseline gap-3 min-w-0">
          <h1 className="page-title">Clients</h1>
          <span className="metric text-xs text-brand tabular-nums">
            {String(clients.length).padStart(2, "0")}
          </span>
        </div>
        {!creating && !editingId && (
          <button type="button" onClick={startCreate} className="slab shrink-0">
            + Nouveau
          </button>
        )}
      </header>

      <div className="px-4 lg:px-6 pb-8 space-y-3">
        {(creating || editingId) && (
          <div className="max-w-2xl p-4 chassis trim-gold space-y-3">
            <p className="heading text-sm text-white">
              {editingId ? "Modifier le client" : "Nouveau client"}
            </p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Nom</span>
                <input
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  className="well w-full"
                />
              </label>
              <label className="block">
                <span className="field-label">Société</span>
                <input
                  value={draft.company}
                  onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
                  className="well w-full"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="field-label">Contact</span>
                <input
                  value={draft.contact}
                  onChange={(e) => setDraft((d) => ({ ...d, contact: e.target.value }))}
                  placeholder="email ou téléphone"
                  className="well w-full"
                />
              </label>
              <label className="block">
                <span className="field-label">Statut</span>
                <select
                  value={draft.status}
                  onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                  className="well w-full"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {error && <p className="metric text-xs text-danger">{error}</p>}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={saving}
                onClick={() => void save()}
                className="slab"
              >
                {saving ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="px-4 py-2.5 text-zinc-400 hover:text-zinc-200 text-sm transition-colors duration-140"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {clients.length === 0 && !creating ? (
          <div className="flex flex-col items-start justify-center py-14 gap-2.5">
            <p className="heading text-xl text-white">Aucun client.</p>
            <p className="text-sm text-zinc-500">Vos clients apparaîtront ici une fois créés.</p>
            <button type="button" onClick={startCreate} className="slab mt-1">
              Créer le premier client
            </button>
          </div>
        ) : (
          <>
            {clients.length > 5 && (
              <div className="flex items-center gap-2">
                <label className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
                    strokeWidth={2}
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher un client…"
                    className="well well-search w-full"
                  />
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="well shrink-0 w-[10.5rem] metric"
                >
                  <option value="all">Tous les statuts</option>
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {filteredClients.length === 0 && (
              <div className="flex items-center justify-center h-20">
                <p className="metric text-xs tracking-wide text-zinc-500 uppercase">
                  Aucun résultat
                </p>
              </div>
            )}

            <div className="border-t border-white/[0.04] divide-y divide-white/[0.04] -mx-4 lg:-mx-6">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="group grid grid-cols-[1fr_auto] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_auto_auto] gap-x-3 gap-y-1 items-center px-4 lg:px-6 py-2.5 hover:bg-brand/[0.04] transition-colors duration-140"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`status-dot ${STATUS_STYLES[client.status] ?? STATUS_STYLES["prospect"]}`}
                      />
                      <span
                        className={`metric text-[10px] tracking-[0.12em] uppercase ${STATUS_STYLES[client.status] ?? STATUS_STYLES["prospect"]}`}
                      >
                        {STATUS_OPTIONS.find((s) => s.id === client.status)?.label ??
                          client.status}
                      </span>
                    </div>
                    <Link
                      href={`/clients/${client.id}`}
                      className="text-sm font-semibold text-zinc-100 hover:text-brand truncate block transition-colors duration-140"
                    >
                      {client.name}
                    </Link>
                  </div>

                  <div className="hidden lg:block min-w-0">
                    <p className="text-xs text-zinc-500 truncate">{client.company}</p>
                    {client.contact && (
                      <p className="metric text-[11px] text-zinc-600 truncate mt-0.5">
                        {client.contact}
                      </p>
                    )}
                  </div>

                  <span className="metric text-xs text-zinc-600 justify-self-end">
                    {String(client.projectCount).padStart(2, "0")} proj.
                  </span>

                  <div className="justify-self-end flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-140">
                    <Link
                      href={`/clients/${client.id}`}
                      title="Voir"
                      aria-label="Voir"
                      className="p-1.5 text-zinc-400 hover:text-zinc-200 transition-colors duration-140"
                    >
                      <Eye className="w-3.5 h-3.5" strokeWidth={2} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEdit(client)}
                      title="Modifier"
                      aria-label="Modifier"
                      className="p-1.5 text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors duration-140"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                    <button
                      type="button"
                      onClick={() => requestRemove(client)}
                      title="Supprimer"
                      aria-label="Supprimer"
                      className="p-1.5 text-danger/80 hover:text-danger cursor-pointer transition-colors duration-140"
                    >
                      <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ConfirmActionModal
        open={deleteTarget !== null}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={() => void confirmRemove()}
        tone="danger"
        title="Supprimer le client"
        description="Cette action est irréversible."
        target={
          deleteTarget ? { label: "Client concerné", value: deleteTarget.name } : undefined
        }
        confirmLabel="Supprimer définitivement"
        confirmingLabel="Suppression…"
        pending={deleting}
        error={deleteError}
      />
    </div>
  )
}
