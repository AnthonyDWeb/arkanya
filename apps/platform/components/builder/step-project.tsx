"use client"

import { useState } from "react"
import type { BuilderState, ClientOption } from "./types"

type StepProjectProps = {
  state: BuilderState
  clients: ClientOption[]
  onChange: (patch: Partial<BuilderState>) => void
  onNext: () => void
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48)
}

export function StepProject({
  state,
  clients: initialClients,
  onChange,
  onNext,
}: StepProjectProps) {
  const canContinue = state.name.trim().length > 0 && state.slug.length > 0

  const [clients, setClients] = useState<ClientOption[]>(initialClients)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [newCompany, setNewCompany] = useState("")
  const [creating_loading, setCreatingLoading] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  async function handleCreate() {
    const name = newName.trim()
    if (!name) return
    setCreatingLoading(true)
    setCreateError(null)
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company: newCompany.trim() || name }),
      })
      if (!res.ok) throw new Error("Erreur création client")
      const client = (await res.json()) as ClientOption
      setClients((prev) => [...prev, client])
      onChange({ clientId: client.id })
      setCreating(false)
      setNewName("")
      setNewCompany("")
    } catch {
      setCreateError("Impossible de créer le client")
    } finally {
      setCreatingLoading(false)
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    const patch: Partial<BuilderState> = { name, slug: slugify(name) }
    if ("site-name" in state.config) {
      patch.config = { ...state.config, "site-name": name }
    }
    onChange(patch)
  }

  return (
    <div className="space-y-2.5">
      <div>
        <h2 className="text-[13px] font-semibold text-white mb-1.5">Type de projet</h2>
        <div className="segment-group segment-group-fit">
          {(["client", "product"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              data-active={state.kind === kind}
              onClick={() => onChange({ kind })}
              className="segment"
            >
              {kind === "client" ? "Client" : "Produit"}
            </button>
          ))}
        </div>
      </div>

      {state.kind === "client" && (
        <div className="space-y-1.5">
          <label className="field-label">Client</label>

          {!creating ? (
            <>
              <select
                value={state.clientId}
                onChange={(e) => onChange({ clientId: e.target.value })}
                className="well w-full"
              >
                <option value="">Aucun client associé</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} — {c.company}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="metric text-[10px] text-brand hover:text-brand-light transition-colors duration-140"
              >
                + Nouveau client
              </button>
            </>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-well/40 p-2.5 space-y-1.5">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom du client *"
                autoFocus
                className="well w-full"
              />
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Entreprise (optionnel)"
                className="well w-full"
              />
              {createError && (
                <p className="metric text-[11px] text-danger">{createError}</p>
              )}
              <div className="flex gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  disabled={!newName.trim() || creating_loading}
                  className="slab text-xs !px-3 !py-1.5"
                >
                  {creating_loading ? "Création…" : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreating(false)
                    setNewName("")
                    setNewCompany("")
                    setCreateError(null)
                  }}
                  className="px-2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors duration-140"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="field-label">
            Nom <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            value={state.name}
            onChange={handleNameChange}
            placeholder="Mon projet"
            className="well w-full"
          />
        </div>
        <div>
          <label className="field-label">Slug</label>
          <div className="well flex items-center !py-0 !px-0 overflow-hidden min-w-0">
            <span className="metric text-[10px] text-gold/80 pl-2.5 pr-1 shrink-0 border-r border-white/[0.06]">
              {state.kind === "client" ? "clients/" : "products/"}
            </span>
            <input
              type="text"
              value={state.slug}
              onChange={(e) =>
                onChange({ slug: e.target.value.replace(/[^a-z0-9-]/g, "") })
              }
              className="min-w-0 flex-1 bg-transparent px-2 py-2 metric text-[12px] outline-none"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="field-label">Description</label>
        <textarea
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
          placeholder="Ce projet est un site vitrine pour…"
          className="well w-full"
        />
      </div>

      <div>
        <label className="field-label">Objectif</label>
        <input
          type="text"
          value={state.objective}
          onChange={(e) => onChange({ objective: e.target.value })}
          placeholder="Générer des leads, présenter les services…"
          className="well w-full"
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="slab"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
