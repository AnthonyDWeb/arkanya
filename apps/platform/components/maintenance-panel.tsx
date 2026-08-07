"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type WorkerHealth = {
  status: string
  mode?: string
}

const SHORTCUTS = [
  { href: "/console", label: "Console jobs" },
  { href: "/builder", label: "Builder" },
  { href: "/catalogue", label: "Catalogue" },
] as const

export function MaintenancePanel() {
  const [health, setHealth] = useState<WorkerHealth | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let cancelled = false
    void fetch("/api/worker/health", { cache: "no-store" })
      .then(async (res) => {
        const data = (await res.json()) as WorkerHealth
        if (!cancelled) setHealth({ ...data, status: res.ok ? data.status : "offline" })
      })
      .catch(() => {
        if (!cancelled) setHealth({ status: "offline" })
      })
      .finally(() => {
        if (!cancelled) setChecking(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const online = health?.status === "ok"

  return (
    <div className="w-full max-w-md space-y-2.5">
      <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-3 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="metric text-[10px] text-zinc-400 mb-0.5">Worker</p>
            <p className="text-[13px] font-semibold text-white">
              {checking
                ? "Vérification…"
                : online
                  ? `En ligne${health?.mode ? ` · ${health.mode}` : ""}`
                  : "Hors ligne"}
            </p>
            <p className="metric text-[10px] text-zinc-500 mt-1">
              /api/worker/health
            </p>
          </div>
          <span
            className={[
              "status-dot shrink-0",
              checking
                ? "text-zinc-600 animate-pulse"
                : online
                  ? "text-success animate-glow-pulse"
                  : "text-danger",
            ].join(" ")}
            style={
              online
                ? {
                    boxShadow:
                      "0 0 6px 1px color-mix(in oklch, var(--color-success) 70%, transparent)",
                  }
                : undefined
            }
          />
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-surface/80 px-3 py-2.5">
        <p className="metric text-[10px] text-zinc-400 mb-2">Raccourcis</p>
        <div className="flex flex-wrap gap-1.5">
          {SHORTCUTS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="metric text-[11px] px-2 py-1 rounded-lg border border-white/[0.08] bg-well/50 text-zinc-300 hover:text-brand hover:border-brand/35 transition-[color,border-color] duration-140"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
