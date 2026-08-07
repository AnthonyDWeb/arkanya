"use client"

import { Check, Copy, X } from "lucide-react"
import { useState } from "react"
import type { SettingsEnvEntry, SettingsEnvKey } from "@/types/settings"

type CopyEnvButtonProps = {
  envKey: SettingsEnvKey | string
  disabled?: boolean
}

export function CopyEnvButton({ envKey, disabled }: CopyEnvButtonProps) {
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
      className="p-1.5 text-zinc-500 hover:text-zinc-200 cursor-pointer transition-colors duration-140 disabled:opacity-30 disabled:cursor-not-allowed touch-manipulation"
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

type EnvKeyRowProps = {
  entry: SettingsEnvEntry
}

export function EnvKeyRow({ entry }: EnvKeyRowProps) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] gap-2 items-center px-2.5 py-1.5">
      <span
        className={[
          "status-dot shrink-0",
          entry.configured ? "text-success" : "text-danger",
        ].join(" ")}
        title={entry.configured ? "Configurée" : "Manquante"}
      />
      <code className="metric text-[11px] text-zinc-300 truncate">{entry.key}</code>
      <CopyEnvButton envKey={entry.key} disabled={!entry.configured} />
    </div>
  )
}
