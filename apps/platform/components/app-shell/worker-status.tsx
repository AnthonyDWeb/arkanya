"use client"

import { useEffect, useState } from "react"
import type { WorkerUiStatus } from "@/types/settings"

export function WorkerStatus() {
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
    status === "online"
      ? "WORKER LIVE"
      : status === "offline"
        ? "WORKER OFF"
        : "CONNECTING"

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
      {status === "online" && (
        <span className="ml-auto metric text-[9px] text-gold/60 tracking-wider">
          ARC
        </span>
      )}
    </div>
  )
}
