"use client"

import type { BuilderState, BuilderDeliveryTarget } from "./types"

type StepDeliveryProps = {
  state: BuilderState
  onChange: (patch: Partial<BuilderState>) => void
  onNext: () => void
  onBack: () => void
}

const TARGETS: Array<{
  id: BuilderDeliveryTarget
  label: string
  description: string
  simulated: boolean
}> = [
  {
    id: "github",
    label: "GitHub",
    description: `Push sur un repo privé github.com/${process.env["NEXT_PUBLIC_GITHUB_OWNER"] ?? "AnthonyDWeb"}`,
    simulated: false,
  },
  {
    id: "vercel",
    label: "Vercel",
    description: "Déploiement automatique via API Vercel",
    simulated: false,
  },
  {
    id: "database",
    label: "Base de données",
    description: "Enregistrement du projet en DB Platform",
    simulated: false,
  },
]

export function StepDelivery({ state, onChange, onNext, onBack }: StepDeliveryProps) {
  function toggleTarget(id: BuilderDeliveryTarget) {
    const targets = state.delivery.targets.includes(id)
      ? state.delivery.targets.filter((t) => t !== id)
      : [...state.delivery.targets, id]
    onChange({ delivery: { targets } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">Livraison</h2>
        <p className="text-xs text-zinc-500">Définissez où le projet généré doit être livré.</p>
      </div>

      <div className="space-y-2">
        {TARGETS.map((target) => {
          const selected = state.delivery.targets.includes(target.id)
          return (
            <button
              key={target.id}
              onClick={() => toggleTarget(target.id)}
              className={[
                "w-full text-left p-4 rounded-lg border transition-all duration-[120ms] ease-out",
                selected
                  ? "border-brand bg-brand-muted"
                  : "border-zinc-700 bg-zinc-800/40 hover:border-zinc-600",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-zinc-100">{target.label}</p>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{target.description}</p>
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
