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
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">Choisir un template</h2>
        <p className="text-xs text-zinc-500">Le template définit la structure de base du projet généré.</p>
      </div>

      {templates.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucun template disponible.</p>
      ) : (
        <div className="grid gap-3">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => selectTemplate(t)}
              className={[
                "text-left p-4 rounded-lg border transition-all duration-[120ms] ease-out",
                state.template === t.id
                  ? "border-brand bg-brand-muted"
                  : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-600",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-100">{t.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{t.description}</p>
                </div>
                {state.template === t.id && (
                  <span className="text-xs px-2 py-0.5 bg-brand text-white rounded shrink-0">
                    Sélectionné
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {t.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-1.5 py-0.5 bg-zinc-700 text-zinc-400 rounded font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-2">
                {t.pages.length} page{t.pages.length > 1 ? "s" : ""} · {t.features.length} feature{t.features.length !== 1 ? "s" : ""} compatible{t.features.length !== 1 ? "s" : ""}
              </p>
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2 text-zinc-400 hover:text-zinc-200 rounded-lg text-sm transition-colors duration-[120ms] ease-out"
        >
          ← Retour
        </button>
        <button
          onClick={onNext}
          disabled={!state.template}
          className="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out disabled:opacity-40 hover:opacity-90"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
