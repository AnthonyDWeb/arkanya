"use client"

import { useState } from "react"
import type {
  CatalogueBenchmark,
  CatalogueFeature,
  CatalogueTemplate,
} from "@/types/catalogue"

type CatalogueViewProps = {
  templates: CatalogueTemplate[]
  features: CatalogueFeature[]
  benchmarkMap: Record<string, CatalogueBenchmark>
}

type Tab = "templates" | "features"

function formatAvg(ms: number): string {
  if (ms < 1000) return `~${Math.round(ms)}ms`
  if (ms < 60_000) return `~${(ms / 1000).toFixed(1)}s`
  const m = Math.floor(ms / 60_000)
  const s = Math.floor((ms % 60_000) / 1000)
  return `~${m}m ${s}s`
}

export function CatalogueView({ templates, features, benchmarkMap }: CatalogueViewProps) {
  const [tab, setTab] = useState<Tab>("templates")

  return (
    <div>
      <div className="px-4 lg:px-6">
        <div className="segment-group segment-group-fit">
          {(["templates", "features"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              data-active={tab === t}
              onClick={() => setTab(t)}
              className="segment"
            >
              {t === "templates"
                ? `Modèles (${templates.length})`
                : `Fonctionnalités (${features.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4">
        {tab === "templates" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 max-w-5xl">
            {templates.map((t) => {
              const scaffoldBench = benchmarkMap[`scaffold:${t.id}:copy-files`]
              const installBench = benchmarkMap["validate:npm-install"]
              const buildBench = benchmarkMap["validate:next-build"]
              const featureBenches = t.features
                .map((f) => benchmarkMap[`feature:${f}`])
                .filter(Boolean) as CatalogueBenchmark[]
              const featureAvg = featureBenches.reduce((s, b) => s + b.avgMs, 0)
              const totalAvg =
                scaffoldBench || installBench || buildBench || featureAvg > 0
                  ? (scaffoldBench?.avgMs ?? 0) +
                    featureAvg +
                    (installBench?.avgMs ?? 0) +
                    (buildBench?.avgMs ?? 0)
                  : null

              return (
                <article
                  key={t.id}
                  className="rounded-xl border border-white/[0.08] bg-surface/80 px-3 py-2.5 space-y-2 min-w-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-[14px] font-semibold text-white truncate">
                        {t.name}
                      </h2>
                      <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">
                        {t.description}
                      </p>
                    </div>
                    {totalAvg !== null && (
                      <div className="shrink-0 text-right">
                        <p className="metric text-[10px] text-zinc-400">Estimé</p>
                        <p className="metric text-[13px] text-brand tabular-nums">
                          {formatAvg(totalAvg)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {t.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="metric text-[10px] px-1.5 py-0.5 rounded-md text-zinc-300 bg-elevated border border-white/[0.05]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1.5 border-t border-white/[0.06] space-y-1.5">
                    <div>
                      <p className="metric text-[10px] text-zinc-400 mb-1">Pages</p>
                      <div className="flex flex-wrap gap-1">
                        {t.pages.map((p) => (
                          <span
                            key={p.id}
                            className={[
                              "inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-md border",
                              p.required
                                ? "text-zinc-200 border-brand/30 bg-brand/10"
                                : "text-zinc-400 border-white/[0.06] bg-well/40",
                            ].join(" ")}
                          >
                            {p.name}
                            {p.required && (
                              <span className="metric text-[9px] text-brand">req.</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="metric text-[10px] text-zinc-400 mb-1">Fonctionnalités</p>
                      {t.features.length === 0 ? (
                        <p className="text-[11px] text-zinc-500">Aucune</p>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {t.features.map((f) => {
                            const bench = benchmarkMap[`feature:${f}`]
                            return (
                              <span
                                key={f}
                                className="metric text-[10px] px-1.5 py-0.5 rounded-md text-zinc-300 bg-well/50 border border-white/[0.05]"
                                title={bench ? formatAvg(bench.avgMs) : undefined}
                              >
                                {f}
                                {bench ? ` · ${formatAvg(bench.avgMs)}` : ""}
                              </span>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}

        {tab === "features" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5 max-w-5xl">
            {features.map((f) => {
              const bench = benchmarkMap[`feature:${f.id}`]
              const deps = Object.entries(f.dependencies ?? {})

              return (
                <article
                  key={f.id}
                  className="rounded-xl border border-white/[0.08] bg-surface/80 px-3 py-2.5 space-y-2 min-w-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-[14px] font-semibold text-white truncate">
                        {f.name}
                      </h2>
                      <p className="metric text-[10px] text-zinc-500 mt-0.5 truncate">
                        {f.id}
                      </p>
                    </div>
                    {bench && (
                      <div className="shrink-0 text-right">
                        <p className="metric text-[10px] text-zinc-400">
                          Moy. · {bench.sampleCount}
                        </p>
                        <p className="metric text-[13px] text-brand tabular-nums">
                          {formatAvg(bench.avgMs)}
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-[11px] text-zinc-400 line-clamp-2">{f.description}</p>

                  {deps.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-white/[0.06]">
                      {deps.map(([pkg, ver]) => (
                        <span
                          key={pkg}
                          className="metric text-[10px] px-1.5 py-0.5 rounded-md text-zinc-400 bg-well/50 border border-white/[0.05]"
                        >
                          {pkg}@{ver}
                        </span>
                      ))}
                    </div>
                  )}

                  {!bench && (
                    <p className="text-[11px] text-zinc-500">
                      Pas encore de timing mesuré.
                    </p>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
