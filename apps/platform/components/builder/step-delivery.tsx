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
}> = [
  {
    id: "github",
    label: "GitHub",
    description: `Repo privé · ${process.env["NEXT_PUBLIC_GITHUB_OWNER"] ?? "owner non configuré"}`,
  },
  {
    id: "vercel",
    label: "Vercel",
    description: "Déploiement automatique",
  },
  {
    id: "database",
    label: "Base de données",
    description: "Enregistrement Platform",
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
    <div className="space-y-3">
      <div>
        <h2 className="text-[13px] font-semibold text-white">Livraison</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Où livrer le projet généré.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {TARGETS.map((target) => {
          const selected = state.delivery.targets.includes(target.id)
          return (
            <button
              key={target.id}
              type="button"
              onClick={() => toggleTarget(target.id)}
              className={[
                "text-left rounded-xl border px-2.5 py-2 transition-[background-color,border-color] duration-140 min-w-0",
                selected
                  ? "border-brand/50 bg-brand/10"
                  : "border-white/[0.08] bg-well/40 hover:border-brand/30",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-white">{target.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5 line-clamp-2">
                    {target.description}
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
