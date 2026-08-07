"use client"

import { useEffect, useState } from "react"
import type { WorkerUiStatus } from "@/types/settings"

type WorkerStatusProps = {
  compact?: boolean
}

export function WorkerStatus({ compact = false }: WorkerStatusProps) {
  const [status, setStatus] = useState<WorkerUiStatus>("checking")

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch("/api/worker/health", { cache: "no-store" })
        setStatus(res.ok ? "online" : "offline")
      } catch {
        setStatus("offline")
      }
    }

    void check()
    const interval = setInterval(() => void check(), 30_000)
    return () => clearInterval(interval)
  }, [])

  const tone =
    status === "online"
      ? "text-brand"
      : status === "offline"
        ? "text-danger"
        : "text-zinc-600"

  const label =
    status === "online" ? "Worker OK" : status === "offline" ? "Worker OFF" : "…"

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/[0.06] bg-well/40">
        <span
          className={`status-dot shrink-0 ${tone} ${status === "online" ? "animate-glow-pulse" : status === "checking" ? "animate-pulse" : ""}`}
        />
        <span className={`metric text-[10px] tracking-wide ${tone}`}>{label}</span>
      </div>
    )
  }

  return (
    <div className="chassis flex items-center gap-2.5 px-3 py-2.5">
      <span
        className={`status-dot shrink-0 ${tone} ${status === "online" ? "animate-glow-pulse" : status === "checking" ? "animate-pulse" : ""}`}
        style={
          status === "online"
            ? {
                boxShadow:
                  "0 0 10px 1px color-mix(in oklch, var(--color-arc) 55%, transparent)",
              }
            : undefined
        }
      />
      <span className={`metric text-[10px] tracking-[0.14em] ${tone}`}>
        {label}
      </span>
    </div>
  )
}
