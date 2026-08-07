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
    <div className="space-y-3">
      <div>
        <h2 className="text-[13px] font-semibold text-white">Fonctionnalités</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Compatibles avec{" "}
          <span className="text-zinc-300">{state.templateData?.name ?? state.template}</span>.
        </p>
      </div>

      {compatibleFeatures.length === 0 ? (
        <p className="text-[12px] text-zinc-500">
          Aucune fonctionnalité compatible avec ce modèle.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {compatibleFeatures.map((feature) => {
            const selected = state.features.includes(feature.id)
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => toggleFeature(feature.id)}
                className={[
                  "text-left rounded-xl border px-2.5 py-2 transition-[background-color,border-color] duration-140 min-w-0",
                  selected
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/[0.08] bg-well/40 hover:border-brand/30",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-white truncate">
                      {feature.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">
                      {feature.description}
                    </p>
                  </div>
                  <div
                    className={[
                      "w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center shrink-0 mt-0.5",
                      selected ? "border-brand bg-brand" : "border-zinc-600",
                    ].join(" ")}
                  >
                    {selected && (
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
                  </div>
                </div>
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
        <button type="button" onClick={onNext} className="slab">
          Suivant →
        </button>
      </div>
    </div>
  )
}
