"use client"

import { Check, Copy, X } from "lucide-react"
import { useState } from "react"

type EnvEntry = {
  key: string
  configured: boolean
}

type SettingsEnvPanelProps = {
  entries: EnvEntry[]
}

function CopyEnvButton({ envKey, disabled }: { envKey: string; disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "loading" | "copied" | "error">("idle")

  async function copy() {
    if (disabled) return
    setState("loading")
    try {
      const res = await fetch(`/api/settings/env/${encodeURIComponent(envKey)}`, {
        cache: "no-store",
      })
      if (!res.ok) {
        setState("error")
        window.setTimeout(() => setState("idle"), 1500)
        return
      }
      const data = (await res.json()) as { value?: string }
      if (!data.value) {
        setState("error")
        window.setTimeout(() => setState("idle"), 1500)
        return
      }
      await navigator.clipboard.writeText(data.value)
      setState("copied")
      window.setTimeout(() => setState("idle"), 1200)
    } catch {
      setState("error")
      window.setTimeout(() => setState("idle"), 1500)
    }
  }

  return (
    <button
      type="button"
      disabled={disabled || state === "loading"}
      onClick={() => void copy()}
      aria-label="Copier"
      title={state === "copied" ? "Copié" : state === "error" ? "Erreur" : "Copier"}
      className="p-1 text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors duration-140 disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {state === "loading" ? (
        <span className="block w-3 h-3 border border-white/20 border-t-transparent rounded-full animate-spin" />
      ) : state === "copied" ? (
        <Check className="w-3 h-3 text-success" strokeWidth={2} />
      ) : state === "error" ? (
        <X className="w-3 h-3 text-danger" strokeWidth={2} />
      ) : (
        <Copy className="w-3 h-3" strokeWidth={2} />
      )}
    </button>
  )
}

export function SettingsEnvPanel({ entries }: SettingsEnvPanelProps) {
  const ready = entries.filter((e) => e.configured).length

  return (
    <div className="rounded-xl border border-white/[0.08] bg-surface/80 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <p className="metric text-[10px] text-zinc-400">Variables d&apos;environnement</p>
        <p className="metric text-[10px] text-brand tabular-nums">
          {ready}/{entries.length}
        </p>
      </div>
      <div className="divide-y divide-white/[0.05]">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2 items-center px-2.5 py-1.5 hover:bg-brand/[0.05] transition-colors duration-140"
          >
            <span
              className={[
                "status-dot shrink-0",
                entry.configured ? "text-success" : "text-danger",
              ].join(" ")}
              title={entry.configured ? "Configurée" : "Manquante"}
            />
            <code className="metric text-[11px] text-zinc-200 truncate">{entry.key}</code>
            <CopyEnvButton envKey={entry.key} disabled={!entry.configured} />
          </div>
        ))}
      </div>
      <p className="px-3 py-1.5 metric text-[9px] text-zinc-600 border-t border-white/[0.05]">
        Valeurs jamais affichées — copie uniquement.
      </p>
    </div>
  )
}
