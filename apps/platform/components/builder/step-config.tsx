"use client"

import type { BuilderState } from "./types"

type StepConfigProps = {
  state: BuilderState
  onChange: (patch: Partial<BuilderState>) => void
  onNext: () => void
  onBack: () => void
}

export function StepConfig({ state, onChange, onNext, onBack }: StepConfigProps) {
  const fields = state.templateData?.config ?? []

  function updateConfig(id: string, value: string) {
    onChange({ config: { ...state.config, [id]: value } })
  }

  const requiredMissing = fields
    .filter((f) => f.required)
    .some((f) => !(state.config[f.id] ?? f.default))

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[13px] font-semibold text-white">Configuration</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Tokens injectés dans les fichiers générés.
        </p>
      </div>

      {fields.length === 0 ? (
        <p className="text-[12px] text-zinc-500">Pas de champs de configuration.</p>
      ) : (
        <div className="space-y-2.5">
          {fields.map((field) => {
            const value = state.config[field.id] ?? field.default
            return (
              <div key={field.id}>
                <label className="field-label flex items-center gap-2">
                  {field.label}
                  {field.required && <span className="text-danger">*</span>}
                </label>

                {field.type === "color" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateConfig(field.id, e.target.value)}
                      className="w-10 h-10 rounded-[3px] border border-white/[0.06] cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateConfig(field.id, e.target.value)}
                      className="well w-full metric"
                    />
                    <div
                      className="w-10 h-10 rounded-[3px] border border-white/[0.06] shrink-0"
                      style={{ backgroundColor: value }}
                    />
                  </div>
                ) : field.type === "select" && field.options ? (
                  <select
                    value={value}
                    onChange={(e) => updateConfig(field.id, e.target.value)}
                    className="well w-full"
                  >
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => updateConfig(field.id, e.target.value)}
                    placeholder={field.default}
                    className="well w-full"
                  />
                )}
              </div>
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
          disabled={requiredMissing}
          className="slab"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
