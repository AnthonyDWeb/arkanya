"use client"

import { useEffect, useState } from "react"
import type { BuilderState } from "./types"

type StepSummaryProps = {
  state: BuilderState
  onLaunch: () => void
  onBack: () => void
}

type SummaryRowProps = {
  label: string
  value: string
}

type BenchmarkEntry = {
  key: string
  label: string
  category: string
  avgMs: number
  minMs: number
  maxMs: number
  sampleCount: number
}

function formatMsVerbose(ms: number): string {
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  const rem = ms % 1000
  if (min > 0) return `${min}m ${sec}s ${rem}ms`
  if (sec > 0) return `${sec}s ${rem}ms`
  return `${rem}ms`
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-start gap-4 py-2.5 border-b border-zinc-800 last:border-0">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-zinc-200">{value}</span>
    </div>
  )
}

function buildBenchmarkKeys(state: BuilderState): string[] {
  const keys: string[] = []
  keys.push(`scaffold:${state.template}:copy-files`)
  const enabledCount = state.pages.filter((p) => p.enabled).length
  if (enabledCount > 0) keys.push(`scaffold:pages:${enabledCount}`)
  for (const f of state.features) keys.push(`feature:${f}`)
  keys.push("validate:npm-install")
  keys.push("validate:next-build")
  return keys
}

function useEstimate(state: BuilderState) {
  const [benchmarks, setBenchmarks] = useState<BenchmarkEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const keys = buildBenchmarkKeys(state)
    if (keys.length === 0) { setLoading(false); return }

    setLoading(true)
    fetch(`/api/timings/benchmarks?keys=${encodeURIComponent(keys.join(","))}`)
      .then((r) => r.json())
      .then((data: BenchmarkEntry[]) => { setBenchmarks(data); setLoading(false) })
      .catch(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.template, state.features.join(","), state.pages.filter(p=>p.enabled).length])

  const totalAvgMs = benchmarks.reduce((acc, b) => acc + b.avgMs, 0)
  const known = benchmarks.length
  const expected = buildBenchmarkKeys(state).length

  return { benchmarks, loading, totalAvgMs, known, expected }
}

export function StepSummary({ state, onLaunch, onBack }: StepSummaryProps) {
  const primaryColor = state.config["primary-color"] ?? "#0f172a"
  const secondaryColor = state.config["secondary-color"] ?? "#6366f1"
  const { benchmarks, loading, totalAvgMs, known, expected } = useEstimate(state)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">Récapitulatif</h2>
        <p className="text-xs text-zinc-500">Vérifiez les paramètres avant de lancer la génération.</p>
      </div>

      <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 px-4">
        <SummaryRow
          label="Type"
          value={state.kind === "client" ? "Projet client" : "Produit Arkanya"}
        />
        <SummaryRow label="Nom" value={state.name} />
        <SummaryRow
          label="Slug"
          value={`${state.kind === "client" ? "clients" : "products"}/${state.slug}`}
        />
        <SummaryRow label="Template" value={state.templateData?.name ?? state.template} />
        <SummaryRow
          label="Pages"
          value={
            state.pages.filter((p) => p.enabled).length === 0
              ? "Aucune"
              : state.pages
                  .filter((p) => p.enabled)
                  .map((p) => p.name)
                  .join(", ")
          }
        />
        {Object.keys(state.config).length > 0 && (
          <SummaryRow
            label="Config"
            value={Object.entries(state.config)
              .map(([k, v]) => `${k}: ${v}`)
              .join(" · ")}
          />
        )}
        <SummaryRow
          label="Features"
          value={state.features.length === 0 ? "Aucune" : state.features.join(", ")}
        />
        <SummaryRow
          label="Livraison"
          value={state.delivery.targets.length === 0 ? "Aucune" : state.delivery.targets.join(", ")}
        />
      </div>

      {(state.config["primary-color"] ?? state.config["secondary-color"]) && (
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
            Aperçu couleurs
          </p>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-zinc-700"
                style={{ backgroundColor: primaryColor }}
              />
              <span className="text-xs text-zinc-500 font-mono">{primaryColor}</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-zinc-700"
                style={{ backgroundColor: secondaryColor }}
              />
              <span className="text-xs text-zinc-500 font-mono">{secondaryColor}</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-zinc-800/30 rounded-lg border border-zinc-700/40 px-4 py-3">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
          Temps estimé
        </p>
        {loading ? (
          <p className="text-xs text-zinc-600">Calcul en cours…</p>
        ) : known === 0 ? (
          <p className="text-xs text-zinc-600">Pas encore de données (premier run)</p>
        ) : (
          <div className="space-y-1.5">
            {benchmarks.map((b) => (
              <div key={b.key} className="flex justify-between text-xs">
                <span className="text-zinc-500">{b.label}</span>
                <span className="text-zinc-400 font-mono">
                  ~{formatMsVerbose(Math.round(b.avgMs))}
                  <span className="text-zinc-600 ml-1">({b.sampleCount} run{b.sampleCount > 1 ? "s" : ""})</span>
                </span>
              </div>
            ))}
            {known < expected && (
              <p className="text-xs text-zinc-600 mt-1">
                {expected - known} opération{expected - known > 1 ? "s" : ""} sans données historiques
              </p>
            )}
            <div className="flex justify-between text-xs pt-1.5 mt-1 border-t border-zinc-700/60">
              <span className="text-zinc-400 font-medium">Total estimé</span>
              <span className="text-zinc-200 font-mono font-medium">~{formatMsVerbose(Math.round(totalAvgMs))}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button
          onClick={onBack}
          className="px-5 py-2 text-zinc-400 hover:text-zinc-200 rounded-lg text-sm transition-colors duration-[120ms] ease-out"
        >
          ← Retour
        </button>
        <button
          onClick={onLaunch}
          className="px-6 py-2.5 bg-brand text-white rounded-lg text-sm font-semibold transition-opacity duration-[120ms] ease-out hover:opacity-90"
        >
          Lancer la génération
        </button>
      </div>
    </div>
  )
}
