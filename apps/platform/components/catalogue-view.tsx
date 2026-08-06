"use client"

import { useState } from "react"

type TemplateManifest = {
  id: string
  name: string
  description: string
  type: string
  pages: { id: string; name: string; required: boolean }[]
  config: { id: string; label: string; type: string; required: boolean }[]
  features: string[]
  technologies: string[]
}

type FeatureManifest = {
  id: string
  name: string
  description: string
  dependencies?: Record<string, string>
}

type BenchmarkEntry = {
  avgMs: number
  sampleCount: number
}

type CatalogueViewProps = {
  templates: TemplateManifest[]
  features: FeatureManifest[]
  benchmarkMap: Record<string, BenchmarkEntry>
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
      <div className="flex border-b border-zinc-800 px-4 lg:px-6">
        {(["templates", "features"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors duration-[120ms] ease-out capitalize",
              tab === t
                ? "border-brand text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-300",
            ].join(" ")}
          >
            {t === "templates" ? `Templates (${templates.length})` : `Features (${features.length})`}
          </button>
        ))}
      </div>

      <div className="p-4 lg:p-6">
        {tab === "templates" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {templates.map((t) => {
              const scaffoldBench = benchmarkMap[`scaffold:${t.id}:copy-files`]
              const installBench = benchmarkMap["validate:npm-install"]
              const buildBench = benchmarkMap["validate:next-build"]
              const featureBenches = t.features
                .map((f) => benchmarkMap[`feature:${f}`])
                .filter(Boolean) as BenchmarkEntry[]
              const featureAvg = featureBenches.reduce((s, b) => s + b.avgMs, 0)
              const totalAvg =
                scaffoldBench || installBench || buildBench || featureAvg > 0
                  ? (scaffoldBench?.avgMs ?? 0) +
                    featureAvg +
                    (installBench?.avgMs ?? 0) +
                    (buildBench?.avgMs ?? 0)
                  : null

              return (
                <div
                  key={t.id}
                  className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-5 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-zinc-100">{t.name}</h2>
                      <p className="text-xs text-zinc-500 mt-0.5">{t.description}</p>
                    </div>
                    {totalAvg !== null && (
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-zinc-600">Temps estimé</p>
                        <p className="text-sm font-mono text-zinc-300 font-medium">
                          {formatAvg(totalAvg)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {t.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 bg-zinc-700/60 text-zinc-300 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-zinc-600 mb-1">Pages</p>
                      <div className="space-y-0.5">
                        {t.pages.map((p) => (
                          <div key={p.id} className="flex items-center gap-1.5 text-zinc-400">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${p.required ? "bg-brand" : "bg-zinc-600"}`}
                            />
                            {p.name}
                            {p.required && (
                              <span className="text-zinc-600 text-[10px]">requis</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-zinc-600 mb-1">Features incluses</p>
                      <div className="space-y-0.5">
                        {t.features.length === 0 ? (
                          <span className="text-zinc-600">Aucune</span>
                        ) : (
                          t.features.map((f) => {
                            const bench = benchmarkMap[`feature:${f}`]
                            return (
                              <div key={f} className="flex items-center justify-between text-zinc-400">
                                <span>{f}</span>
                                {bench && (
                                  <span className="text-zinc-600 font-mono">
                                    {formatAvg(bench.avgMs)}
                                  </span>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === "features" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {features.map((f) => {
              const bench = benchmarkMap[`feature:${f.id}`]
              const depCount = Object.keys(f.dependencies ?? {}).length

              return (
                <div
                  key={f.id}
                  className="bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-5 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-zinc-100">{f.name}</h2>
                        <code className="text-xs text-zinc-600 font-mono">{f.id}</code>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{f.description}</p>
                    </div>
                    {bench && (
                      <div className="shrink-0 text-right">
                        <p className="text-xs text-zinc-600">
                          Moy. ({bench.sampleCount} run{bench.sampleCount > 1 ? "s" : ""})
                        </p>
                        <p className="text-sm font-mono text-zinc-300 font-medium">
                          {formatAvg(bench.avgMs)}
                        </p>
                      </div>
                    )}
                  </div>

                  {depCount > 0 && (
                    <div>
                      <p className="text-xs text-zinc-600 mb-1">Dépendances</p>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(f.dependencies ?? {}).map(([pkg, ver]) => (
                          <span
                            key={pkg}
                            className="text-xs px-2 py-0.5 bg-zinc-700/60 text-zinc-400 rounded font-mono"
                          >
                            {pkg}@{ver}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {!bench && (
                    <p className="text-xs text-zinc-700">
                      Aucune donnée de timing — lancez une génération pour collecter.
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
