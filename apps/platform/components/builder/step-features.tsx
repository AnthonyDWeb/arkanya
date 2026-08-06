"use client"

import type { BuilderState, FeatureSummary } from "./types"

type StepFeaturesProps = {
  state: BuilderState
  features: FeatureSummary[]
  onChange: (patch: Partial<BuilderState>) => void
  onNext: () => void
  onBack: () => void
}

export function StepFeatures({ state, features, onChange, onNext, onBack }: StepFeaturesProps) {
  const compatible = state.templateData?.features ?? []
  const compatibleFeatures = features.filter((f) => compatible.includes(f.id))

  function toggleFeature(id: string) {
    const next = state.features.includes(id)
      ? state.features.filter((f) => f !== id)
      : [...state.features, id]
    onChange({ features: next })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">Fonctionnalités</h2>
        <p className="text-xs text-zinc-500">
          Features compatibles avec le template <span className="text-zinc-400">{state.templateData?.name ?? state.template}</span>.
        </p>
      </div>

      {compatibleFeatures.length === 0 ? (
        <p className="text-sm text-zinc-600">Aucune feature compatible avec ce template.</p>
      ) : (
        <div className="space-y-2">
          {compatibleFeatures.map((feature) => {
            const selected = state.features.includes(feature.id)
            return (
              <button
                key={feature.id}
                onClick={() => toggleFeature(feature.id)}
                className={[
                  "w-full text-left p-4 rounded-lg border transition-all duration-[120ms] ease-out",
                  selected
                    ? "border-brand bg-brand-muted"
                    : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-600",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-100">{feature.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{feature.description}</p>
                  </div>
                  <div
                    className={[
                      "w-4 h-4 rounded border-2 flex items-center justify-center shrink-0",
                      selected ? "border-brand bg-brand" : "border-zinc-600",
                    ].join(" ")}
                  >
                    {selected && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 4l3 3 5-6" />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
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
          className="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out hover:opacity-90"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
