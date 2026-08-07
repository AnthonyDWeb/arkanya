"use client"

import type { BuilderState, TemplateSummary } from "./types"

type StepTemplateProps = {
  state: BuilderState
  templates: TemplateSummary[]
  onChange: (patch: Partial<BuilderState>) => void
  onNext: () => void
  onBack: () => void
}

export function StepTemplate({ state, templates, onChange, onNext, onBack }: StepTemplateProps) {
  function selectTemplate(t: TemplateSummary) {
    const pages = t.pages.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      enabled: true,
      source: "template" as const,
    }))

    const config = t.config.reduce<Record<string, string>>((acc, field) => {
      if (field.id === "site-name" && state.name.trim()) {
        acc[field.id] = state.name.trim()
      } else {
        acc[field.id] = field.default
      }
      return acc
    }, {})

    const features = t.features.includes("navigation") ? ["navigation"] : []

    onChange({
      template: t.id,
      templateData: t,
      pages,
      config,
      features,
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[13px] font-semibold text-white">Choisir un modèle</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Structure de base du projet généré.
        </p>
      </div>

      {templates.length === 0 ? (
        <p className="text-[12px] text-zinc-500">Aucun modèle disponible.</p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {templates.map((t) => {
            const selected = state.template === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTemplate(t)}
                className={[
                  "text-left rounded-xl border px-2.5 py-2 transition-[background-color,border-color] duration-140 min-w-0",
                  selected
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/[0.08] bg-well/40 hover:border-brand/30",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <p className="text-[12px] font-semibold text-white truncate">{t.name}</p>
                  {selected && (
                    <span className="metric text-[9px] text-brand shrink-0">OK</span>
                  )}
                </div>
                <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">{t.description}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {t.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="metric text-[9px] px-1 py-px rounded text-zinc-400 bg-elevated/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="metric text-[9px] text-zinc-500 mt-1.5">
                  {t.pages.length} pages · {t.features.length} fonctionnalités
                </p>
              </button>
            )
          })}
        </div>
      )}

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
          disabled={!state.template}
          className="slab"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
