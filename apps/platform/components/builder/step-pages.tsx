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
    <div className="space-y-3">
      <div>
        <h2 className="text-[13px] font-semibold text-white">Pages du projet</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          {isLanding
            ? "Sections à afficher — vous pouvez aussi ajouter des routes."
            : "Pages à générer. Les obligatoires restent actives."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {state.pages.map((page) => {
          const isRequired = required.includes(page.id)
          const isCustom = page.source === "custom"
          const displayPath =
            isLanding && !isCustom
              ? `#${page.slug || page.id}`
              : `/${page.slug === "/" ? "" : page.slug.replace(/^\//, "")}`
          const isHash = displayPath.startsWith("#")

          return (
            <div
              key={page.id}
              className={[
                "flex items-start gap-2 rounded-xl border px-2.5 py-2 min-w-0",
                page.enabled
                  ? "border-brand/50 bg-brand/10"
                  : "border-white/[0.08] bg-well/40",
              ].join(" ")}
            >
              <button
                type="button"
                onClick={() => !isRequired && togglePage(page.id)}
                disabled={isRequired}
                aria-checked={page.enabled}
                role="checkbox"
                className={[
                  "w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5",
                  page.enabled ? "border-brand bg-brand" : "border-zinc-600",
                  isRequired ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
                ].join(" ")}
              >
                {page.enabled && (
                  <svg
                    viewBox="0 0 10 8"
                    className="w-2 h-2 text-ink-on-brand"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M1 4l3 3 5-6" />
                  </svg>
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={[
                    "text-[12px] font-medium truncate",
                    page.enabled ? "text-white" : "text-zinc-500",
                  ].join(" ")}
                >
                  {page.name}
                  {isCustom && (
                    <span className="ml-1 metric text-[9px] text-brand">custom</span>
                  )}
                </p>
                <p
                  className={[
                    "metric text-[11px] truncate",
                    isHash ? "text-gold" : "text-zinc-400",
                  ].join(" ")}
                >
                  {displayPath}
                  {isRequired && (
                    <span className="ml-1 text-zinc-500">· req.</span>
                  )}
                </p>
              </div>
              {isCustom && (
                <button
                  type="button"
                  onClick={() => removeCustomPage(page.id)}
                  className="metric text-[9px] text-danger shrink-0"
                  title="Retirer"
                >
                  ×
                </button>
              )}
            </div>
          )
        })}
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-well/30 p-2.5 space-y-2">
        <p className="metric text-[10px] text-zinc-400">Ajouter une page</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="field-label">Nom</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => {
                const value = e.target.value
                setNewName(value)
                if (!slugTouched) setNewSlug(slugifyName(value))
              }}
              placeholder="Détail article"
              className="well w-full"
            />
          </div>
          <div>
            <label className="field-label">Route</label>
            <div className="well flex items-center gap-1 !py-0 !px-0 overflow-hidden">
              <span className="metric text-[10px] text-zinc-500 pl-2.5 shrink-0">/</span>
              <input
                type="text"
                value={newSlug}
                onChange={(e) => {
                  setSlugTouched(true)
                  setNewSlug(sanitizeRouteInput(e.target.value))
                }}
                placeholder="test/[slug]"
                className="min-w-0 flex-1 bg-transparent px-1.5 py-2 metric text-[12px] outline-none"
              />
            </div>
          </div>
        </div>
        {formError && <p className="metric text-[11px] text-danger">{formError}</p>}
        <button
          type="button"
          onClick={addCustomPage}
          className="text-[11px] text-brand hover:text-brand-light transition-colors duration-140"
        >
          + Ajouter
        </button>
      </div>

      <div className="flex justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-[12px] text-zinc-400 hover:text-zinc-200 transition-colors duration-140"
        >
          ← Retour
        </button>
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
