"use client"

import { useState } from "react"

type EnvEntry = {
  key: string
  value: string
  secret: boolean
}

type SettingsEnvPanelProps = {
  entries: EnvEntry[]
  publicInfo: Array<{ label: string; value: string }>
}

function maskValue(value: string): string {
  if (!value) return "—"
  if (value.length <= 8) return "••••••••"
  return `${value.slice(0, 4)}••••${value.slice(-4)}`
}

function CopyButton({ value, disabled }: { value: string; disabled?: boolean }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!value || disabled) return
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || !value}
      onClick={() => void copy()}
      className="text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors duration-[120ms] ease-out disabled:opacity-40"
    >
      {copied ? "Copié" : "Copier"}
    </button>
  )
}

export function SettingsEnvPanel({ entries, publicInfo }: SettingsEnvPanelProps) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  return (
    <div className="space-y-6">
      <div className="bg-zinc-800/40 rounded-lg border border-zinc-700/40 px-4 divide-y divide-zinc-800">
        {publicInfo.map((item) => (
          <div key={item.label} className="py-3 flex items-center justify-between gap-4 text-sm">
            <span className="text-zinc-500 shrink-0">{item.label}</span>
            <div className="flex items-center gap-2 min-w-0">
              <code className="text-zinc-300 font-mono text-xs break-all text-right">
                {item.value || "—"}
              </code>
              <CopyButton value={item.value} />
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Variables d’environnement
            </h2>
            <p className="text-xs text-zinc-600 mt-1">
              Masquées par défaut. Copie / révélation réservées à ta session admin.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {entries.map((entry) => {
            const isOpen = Boolean(revealed[entry.key])
            const display =
              !entry.value
                ? "—"
                : entry.secret && !isOpen
                  ? maskValue(entry.value)
                  : entry.value

            return (
              <div
                key={entry.key}
                className="px-3 py-2.5 bg-zinc-800/40 border border-zinc-700/40 rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <code className="text-xs text-zinc-400 font-mono">{entry.key}</code>
                  <span
                    className={[
                      "text-[10px] px-1.5 py-0.5 rounded",
                      entry.value
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400",
                    ].join(" ")}
                  >
                    {entry.value ? "OK" : "Manquant"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs font-mono text-zinc-300 break-all min-w-0">
                    {display}
                  </code>
                  {entry.secret && entry.value && (
                    <button
                      type="button"
                      onClick={() =>
                        setRevealed((prev) => ({ ...prev, [entry.key]: !prev[entry.key] }))
                      }
                      className="text-[10px] px-2 py-1 rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors duration-[120ms] ease-out shrink-0"
                    >
                      {isOpen ? "Masquer" : "Voir"}
                    </button>
                  )}
                  <CopyButton value={entry.value} disabled={!entry.value} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
