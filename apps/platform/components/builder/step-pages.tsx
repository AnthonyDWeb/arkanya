"use client"

import { useState } from "react"
import type { BuilderState } from "./types"

type StepPagesProps = {
  state: BuilderState
  onChange: (patch: Partial<BuilderState>) => void
  onNext: () => void
  onBack: () => void
}

/** Auto-slug depuis le nom (segment simple uniquement). */
function slugifyName(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
}

/** Nettoyage léger pendant la saisie — conserve / [ ] ( ) . */
function sanitizeRouteInput(value: string): string {
  return value
    .replace(/\\/g, "/")
    .replace(/[^a-zA-Z0-9/\[\]()._-]/g, "")
    .replace(/\/+/g, "/")
    .replace(/^\/+/, "")
}

function normalizeSegment(seg: string): string | null {
  if (!seg) return null

  const optionalCatchAll = seg.match(/^\[\[\.\.\.([A-Za-z_][A-Za-z0-9_]*)\]\]$/)
  if (optionalCatchAll?.[1]) return `[[...${optionalCatchAll[1].toLowerCase()}]]`

  const catchAll = seg.match(/^\[\.\.\.([A-Za-z_][A-Za-z0-9_]*)\]$/)
  if (catchAll?.[1]) return `[...${catchAll[1].toLowerCase()}]`

  const dynamic = seg.match(/^\[([A-Za-z_][A-Za-z0-9_]*)\]$/)
  if (dynamic?.[1]) return `[${dynamic[1].toLowerCase()}]`

  const group = seg.match(/^\(([A-Za-z0-9_-]+)\)$/)
  if (group?.[1]) return `(${group[1].toLowerCase()})`

  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(seg)) return seg.toLowerCase()

  return null
}

/** Valide et normalise une route App Router : `blog`, `test/detail`, `test/[slug]`, `[...slug]`. */
function normalizeRoutePath(raw: string): string | null {
  const trimmed = sanitizeRouteInput(raw).replace(/\/+$/, "")
  if (!trimmed) return null

  const segments = trimmed.split("/")
  const normalized: string[] = []

  for (const seg of segments) {
    const next = normalizeSegment(seg)
    if (!next) return null
    normalized.push(next)
  }

  return normalized.join("/")
}

function pageIdFromRoute(route: string): string {
  return `custom-${route.replace(/[/\[\]().]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")}`
}

export function StepPages({ state, onChange, onNext, onBack }: StepPagesProps) {
  const [newName, setNewName] = useState("")
  const [newSlug, setNewSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const required = state.templateData?.pages.filter((p) => p.required).map((p) => p.id) ?? []
  const canContinue = state.pages.some((p) => p.enabled)
  const isLanding = state.template === "landing-page"

  function togglePage(id: string) {
    const pages = state.pages.map((p) =>
      p.id === id ? { ...p, enabled: !p.enabled } : p,
    )
    onChange({ pages })
  }

  function removeCustomPage(id: string) {
    onChange({ pages: state.pages.filter((p) => p.id !== id) })
  }

  function addCustomPage() {
    const name = newName.trim()
    const slug = normalizeRoutePath(newSlug || slugifyName(name))

    if (!name) {
      setFormError("Nom requis")
      return
    }
    if (!slug) {
      setFormError("Route invalide. Ex. blog, test/detail, test/[slug], docs/[...slug]")
      return
    }
    if (state.pages.some((p) => p.slug.replace(/^\//, "") === slug)) {
      setFormError("Cette route existe déjà")
      return
    }

    onChange({
      pages: [
        ...state.pages,
        {
          id: pageIdFromRoute(slug),
          name,
          slug,
          enabled: true,
          source: "custom",
        },
      ],
    })
    setNewName("")
    setNewSlug("")
    setSlugTouched(false)
    setFormError(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">Pages du projet</h2>
        <p className="text-xs text-zinc-500">
          {isLanding
            ? "Sélectionnez les sections à afficher. Vous pouvez aussi ajouter des pages (routes) supplémentaires."
            : "Sélectionnez les pages à générer, ou ajoutez-en de nouvelles. Les pages obligatoires ne peuvent pas être désactivées."}
        </p>
      </div>

      <div className="space-y-2">
        {state.pages.map((page) => {
          const isRequired = required.includes(page.id)
          const isCustom = page.source === "custom"
          const displayPath =
            isLanding && !isCustom
              ? `#${page.slug || page.id}`
              : `/${page.slug === "/" ? "" : page.slug.replace(/^\//, "")}`

          return (
            <div
              key={page.id}
              className={[
                "flex items-center justify-between p-3 rounded-lg border transition-colors duration-[120ms] ease-out",
                page.enabled ? "border-zinc-700 bg-zinc-800/40" : "border-zinc-800 bg-zinc-900/40",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => !isRequired && togglePage(page.id)}
                  disabled={isRequired}
                  aria-checked={page.enabled}
                  role="checkbox"
                  className={[
                    "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors duration-[120ms] ease-out",
                    page.enabled
                      ? "border-brand bg-brand"
                      : "border-zinc-600 bg-transparent",
                    isRequired ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                  ].join(" ")}
                >
                  {page.enabled && (
                    <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 4l3 3 5-6" />
                    </svg>
                  )}
                </button>
                <div>
                  <p className={`text-sm ${page.enabled ? "text-zinc-200" : "text-zinc-600"}`}>
                    {page.name}
                    {isCustom && (
                      <span className="ml-2 text-[10px] uppercase tracking-wide text-blue-400">
                        custom
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-zinc-600 font-mono">
                    {displayPath}
                    {isRequired && <span className="ml-2 text-zinc-700">obligatoire</span>}
                  </p>
                </div>
              </div>
              {isCustom && (
                <button
                  onClick={() => removeCustomPage(page.id)}
                  className="text-xs text-red-400 cursor-pointer px-2 py-1"
                  title="Retirer cette page"
                >
                  Retirer
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="border border-zinc-800 rounded-lg p-4 space-y-3">
        <div>
          <p className="text-xs font-medium text-zinc-400">Ajouter une page</p>
          <p className="text-[11px] text-zinc-600 mt-0.5 font-mono">
            blog · test/detail · test/[slug] · docs/[...slug]
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Nom</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                const value = e.target.value
                setNewName(value)
                if (!slugTouched) setNewSlug(slugifyName(value))
              }}
              placeholder="Ex. Détail article"
              className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Route</label>
            <div className="flex items-center gap-1">
              <span className="text-xs text-zinc-600 font-mono">/</span>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setNewSlug(sanitizeRouteInput(e.target.value))
                }}
                placeholder="test/[slug]"
                className="w-full px-3 py-2 text-sm bg-zinc-950 border border-zinc-700 rounded-lg text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
              />
            </div>
          </div>
        </div>
        {formError && <p className="text-xs text-red-400">{formError}</p>}
        <button
          type="button"
          onClick={addCustomPage}
          className="px-4 py-2 text-sm text-blue-400 border border-blue-900/40 rounded-lg cursor-pointer hover:bg-blue-950/20 transition-colors duration-[120ms] ease-out"
        >
          + Ajouter la page
        </button>
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2 text-zinc-400 hover:text-zinc-200 rounded-lg text-sm transition-colors duration-[120ms] ease-out cursor-pointer"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!canContinue}
          className="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out disabled:opacity-40 hover:opacity-90 cursor-pointer"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
