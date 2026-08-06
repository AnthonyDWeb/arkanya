"use client"

import { useEffect, useState } from "react"

type Status = "checking" | "online" | "offline"

export function WorkerStatus() {
  const [status, setStatus] = useState<Status>("checking")

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

  const dot =
    status === "online"
      ? "bg-emerald-500"
      : status === "offline"
        ? "bg-red-500"
        : "bg-zinc-600 animate-pulse"

  const label =
    status === "online" ? "Worker actif" : status === "offline" ? "Worker hors ligne" : "…"

  return (
    <div className="flex items-center gap-2 px-3 py-2">
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="text-xs text-zinc-500">{label}</span>
    </div>
  )
}
