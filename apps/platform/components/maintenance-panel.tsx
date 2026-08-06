"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type WorkerHealth = {
  status: string
  mode?: string
}

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
    <div className="space-y-4 max-w-xl">
      <div className="p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-lg space-y-3">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Worker
        </h2>
        <div className="flex items-center gap-2">
          <span
            className={[
              "w-2 h-2 rounded-full",
              checking ? "bg-zinc-600 animate-pulse" : online ? "bg-emerald-500" : "bg-red-500",
            ].join(" ")}
          />
          <span className="text-sm text-zinc-300">
            {checking
              ? "Vérification…"
              : online
                ? `En ligne${health?.mode ? ` · mode ${health.mode}` : ""}`
                : "Hors ligne"}
          </span>
        </div>
        <p className="text-xs text-zinc-600">
          Healthcheck via <code className="text-zinc-500">/api/worker/health</code>
        </p>
      </div>

      <div className="p-4 bg-zinc-800/40 border border-zinc-700/40 rounded-lg space-y-2">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Raccourcis
        </h2>
        <ul className="space-y-1.5 text-sm">
          <li>
            <Link href="/console" className="text-zinc-300 hover:text-white transition-colors duration-[120ms] ease-out">
              Console jobs →
            </Link>
          </li>
          <li>
            <Link href="/builder" className="text-zinc-300 hover:text-white transition-colors duration-[120ms] ease-out">
              Nouveau projet (Builder) →
            </Link>
          </li>
          <li>
            <Link href="/catalogue" className="text-zinc-300 hover:text-white transition-colors duration-[120ms] ease-out">
              Catalogue templates / features →
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
