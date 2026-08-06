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

export function StepProject({ state, clients: initialClients, onChange, onNext }: StepProjectProps) {
  const canContinue =
    state.name.trim().length > 0 &&
    state.slug.length > 0

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
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-4">Type de projet</h2>
        <div className="flex gap-3">
          {(["client", "product"] as const).map((kind) => (
            <button
              key={kind}
              onClick={() => onChange({ kind })}
              className={[
                "flex-1 py-3 px-4 rounded-lg border text-sm font-medium transition-colors duration-[120ms] ease-out",
                state.kind === kind
                  ? "border-brand bg-brand-muted text-brand-light"
                  : "border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300",
              ].join(" ")}
            >
              {kind === "client" ? "Client" : "Produit Arkanya"}
            </button>
          ))}
        </div>
      </div>

      {state.kind === "client" && (
        <div className="space-y-2">
          <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Client
          </label>

          {!creating ? (
            <>
              <select
                value={state.clientId}
                onChange={(e) => onChange({ clientId: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
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
                className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors duration-[120ms] ease-out"
              >
                + Nouveau client
              </button>
            </>
          ) : (
            <div className="space-y-2 p-3 bg-zinc-800/60 border border-zinc-700/60 rounded-lg">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nom du client *"
                autoFocus
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600"
              />
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="Entreprise (optionnel)"
                className="w-full bg-zinc-900 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600"
              />
              {createError && (
                <p className="text-xs text-red-400">{createError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  disabled={!newName.trim() || creating_loading}
                  className="px-3 py-1.5 bg-brand text-white rounded-lg text-xs font-medium transition-opacity duration-[120ms] ease-out disabled:opacity-40"
                >
                  {creating_loading ? "Création…" : "Créer"}
                </button>
                <button
                  type="button"
                  onClick={() => { setCreating(false); setNewName(""); setNewCompany(""); setCreateError(null) }}
                  className="px-3 py-1.5 text-zinc-500 hover:text-zinc-300 rounded-lg text-xs transition-colors duration-[120ms] ease-out"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Nom du projet <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={state.name}
          onChange={handleNameChange}
          placeholder="Mon projet"
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Slug
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 font-mono">
            {state.kind === "client" ? "clients/" : "products/"}
          </span>
          <input
            type="text"
            value={state.slug}
            onChange={(e) => onChange({ slug: e.target.value.replace(/[^a-z0-9-]/g, "") })}
            className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-brand"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Description
        </label>
        <textarea
          value={state.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          placeholder="Ce projet est un site vitrine pour…"
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Objectif
        </label>
        <input
          type="text"
          value={state.objective}
          onChange={(e) => onChange({ objective: e.target.value })}
          placeholder="Générer des leads, présenter les services…"
          className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600"
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out disabled:opacity-40 hover:opacity-90"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
