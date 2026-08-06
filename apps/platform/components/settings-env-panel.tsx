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
      title={
        state === "copied" ? "Copié" : state === "error" ? "Erreur" : "Copier"
      }
      className="p-1 rounded text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors duration-[120ms] ease-out disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {state === "loading" ? (
        <span className="block w-3.5 h-3.5 border border-zinc-500 border-t-transparent rounded-full animate-spin" />
      ) : state === "copied" ? (
        <Check className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
      ) : state === "error" ? (
        <X className="w-3.5 h-3.5 text-red-400" strokeWidth={2} />
      ) : (
        <Copy className="w-3.5 h-3.5" strokeWidth={2} />
      )}
    </button>
  )
}

export function SettingsEnvPanel({ entries }: SettingsEnvPanelProps) {
  return (
    <div>
      <p className="text-[11px] text-zinc-600 mb-2">
        Valeurs jamais affichées — copie uniquement.
      </p>
      <div className="rounded-lg border border-zinc-800 divide-y divide-zinc-800/80 overflow-hidden">
        {entries.map((entry) => (
          <div
            key={entry.key}
            className="h-8 px-2.5 flex items-center justify-between gap-2 bg-zinc-900/40"
          >
            <code className="text-[11px] text-zinc-400 font-mono truncate">{entry.key}</code>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={[
                  "w-1.5 h-1.5 rounded-full",
                  entry.configured ? "bg-emerald-500" : "bg-red-500",
                ].join(" ")}
                title={entry.configured ? "Configurée" : "Manquante"}
              />
              <CopyEnvButton envKey={entry.key} disabled={!entry.configured} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
