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
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">Configuration du template</h2>
        <p className="text-xs text-zinc-500">Ces valeurs seront injectées comme tokens dans les fichiers générés.</p>
      </div>

      {fields.length === 0 ? (
        <p className="text-sm text-zinc-600">Ce template n'a pas de champs de configuration.</p>
      ) : (
        <div className="space-y-4">
          {fields.map((field) => {
            const value = state.config[field.id] ?? field.default
            return (
              <div key={field.id}>
                <label className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
                  {field.label}
                  {field.required && <span className="text-red-400">*</span>}
                </label>

                {field.type === "color" ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => updateConfig(field.id, e.target.value)}
                      className="w-10 h-10 rounded border border-zinc-700 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => updateConfig(field.id, e.target.value)}
                      className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-brand"
                    />
                    <div
                      className="w-10 h-10 rounded border border-zinc-700 shrink-0"
                      style={{ backgroundColor: value }}
                    />
                  </div>
                ) : field.type === "select" && field.options ? (
                  <select
                    value={value}
                    onChange={(e) => updateConfig(field.id, e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand"
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
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand placeholder:text-zinc-600"
                  />
                )}
              </div>
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
          disabled={requiredMissing}
          className="px-5 py-2 bg-brand text-white rounded-lg text-sm font-medium transition-opacity duration-[120ms] ease-out disabled:opacity-40 hover:opacity-90"
        >
          Suivant →
        </button>
      </div>
    </div>
  )
}
