"use client"

import type { BuilderState } from "./types"
import { formatEstimateMs, useBuilderEstimate } from "./use-builder-estimate"

type StepSummaryProps = {
  state: BuilderState
  onLaunch: () => void
  onBack: () => void
}

type SummaryRowProps = {
  label: string
  value: string
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="grid grid-cols-[5rem_minmax(0,1fr)] gap-2 py-1 border-b border-white/[0.05] last:border-0">
      <span className="metric text-[10px] text-zinc-400">{label}</span>
      <span className="text-[12px] text-zinc-200 truncate">{value}</span>
    </div>
  )
}

export function StepSummary({ state, onLaunch, onBack }: StepSummaryProps) {
  const primaryColor = state.config["primary-color"] ?? "#0f172a"
  const secondaryColor = state.config["secondary-color"] ?? "#6366f1"
  const { benchmarks, loading, totalAvgMs, known, expected } = useBuilderEstimate(state)

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[13px] font-semibold text-white">Récapitulatif</h2>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Vérifiez avant de lancer la génération.
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-well/30 px-2.5 py-1">
        <SummaryRow
          label="Type"
          value={state.kind === "client" ? "Projet client" : "Produit Arkanya"}
        />
        <SummaryRow label="Nom" value={state.name} />
        <SummaryRow
          label="Slug"
          value={`${state.kind === "client" ? "clients" : "products"}/${state.slug}`}
        />
        <SummaryRow label="Modèle" value={state.templateData?.name ?? state.template} />
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
        <SummaryRow
          label="Fonct."
          value={state.features.length === 0 ? "Aucune" : state.features.join(", ")}
        />
        <SummaryRow
          label="Livraison"
          value={
            state.delivery.targets.length === 0
              ? "Aucune"
              : state.delivery.targets.join(", ")
          }
        />
      </div>

      {(state.config["primary-color"] ?? state.config["secondary-color"]) && (
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md border border-white/[0.08]"
              style={{ backgroundColor: primaryColor }}
            />
            <span className="metric text-[10px] text-zinc-500">{primaryColor}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-md border border-white/[0.08]"
              style={{ backgroundColor: secondaryColor }}
            />
            <span className="metric text-[10px] text-zinc-500">{secondaryColor}</span>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.08] bg-well/30 px-2.5 py-2">
        <p className="metric text-[10px] text-zinc-400 mb-1">Temps estimé</p>
        {loading ? (
          <p className="text-[11px] text-zinc-500">Calcul…</p>
        ) : known === 0 ? (
          <p className="text-[11px] text-zinc-500">Pas encore de données</p>
        ) : (
          <div className="space-y-0.5">
            {benchmarks.slice(0, 4).map((b) => (
              <div key={b.key} className="flex justify-between gap-2 text-[11px]">
                <span className="text-zinc-400 truncate">{b.label}</span>
                <span className="metric text-zinc-300 shrink-0">
                  ~{formatEstimateMs(Math.round(b.avgMs))}
                </span>
              </div>
            ))}
            {known < expected && (
              <p className="text-[10px] text-zinc-500">
                {expected - known} ops sans historique
              </p>
            )}
            <div className="flex justify-between items-baseline pt-1 mt-1 border-t border-white/[0.06]">
              <span className="text-[11px] text-zinc-300">Total</span>
              <span className="heading text-base text-brand tabular-nums">
                ~{formatEstimateMs(Math.round(totalAvgMs))}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="text-[12px] text-zinc-400 hover:text-zinc-200 transition-colors duration-140"
        >
          ← Retour
        </button>
        <button type="button" onClick={onLaunch} className="slab">
          Lancer la génération
        </button>
      </div>
    </div>
  )
}
