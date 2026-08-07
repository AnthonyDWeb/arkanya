"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type PulseState = {
  status: "checking" | "online" | "offline"
  mode: string | null
  latencyMs: number | null
}

type WorkerPulseProps = {
  /** Compact strip for embedding inside another card. */
  inline?: boolean
}

export function WorkerPulse({ inline = false }: WorkerPulseProps) {
  const [pulse, setPulse] = useState<PulseState>({
    status: "checking",
    mode: null,
    latencyMs: null,
  })

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      const started = performance.now()
      try {
        const res = await fetch("/api/worker/health", { cache: "no-store" })
        const latencyMs = Math.round(performance.now() - started)
        const data = (await res.json()) as { status?: string; mode?: string }
        if (cancelled) return
        setPulse({
          status: res.ok && data.status !== "offline" ? "online" : "offline",
          mode: typeof data.mode === "string" ? data.mode : null,
          latencyMs,
        })
      } catch {
        if (cancelled) return
        setPulse({
          status: "offline",
          mode: null,
          latencyMs: Math.round(performance.now() - started),
        })
      }
    }

    void check()
    const interval = setInterval(() => void check(), 30_000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  const tone =
    pulse.status === "online"
      ? "text-brand"
      : pulse.status === "offline"
        ? "text-danger"
        : "text-zinc-500"

  const label =
    pulse.status === "online"
      ? "OK"
      : pulse.status === "offline"
        ? "OFF"
        : "…"

  const modeLabel =
    pulse.mode === "remote" ? "remote" : pulse.mode === "local" ? "local" : null

  if (inline) {
    return (
      <Link
        href="/settings"
        className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-well/40 px-3 py-2.5 hover:border-white/15 transition-[border-color] duration-140"
      >
        <span className="inline-flex items-center gap-2 min-w-0">
          <span
            className={`status-dot shrink-0 ${tone} ${pulse.status === "online" ? "animate-glow-pulse" : pulse.status === "checking" ? "animate-pulse" : ""}`}
          />
          <span className="metric text-[11px] text-zinc-400">
            Worker
            {modeLabel ? (
              <span className="text-zinc-600"> · {modeLabel}</span>
            ) : null}
          </span>
        </span>
        <span className={`metric text-[11px] tabular-nums shrink-0 ${tone}`}>
          {label}
          {pulse.latencyMs != null ? (
            <span className="text-zinc-600"> · {pulse.latencyMs} ms</span>
          ) : null}
        </span>
      </Link>
    )
  }

  return (
    <Link
      href="/settings"
      className="block rounded-2xl border border-white/[0.08] bg-surface/80 px-4 py-4 hover:border-white/20 transition-[border-color] duration-140"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="metric text-[10px] text-zinc-500 uppercase tracking-wide">
          Worker
        </p>
        <span className={`inline-flex items-center gap-1.5 ${tone}`}>
          <span
            className={`status-dot shrink-0 ${tone} ${pulse.status === "online" ? "animate-glow-pulse" : pulse.status === "checking" ? "animate-pulse" : ""}`}
          />
          <span className="metric text-[10px] tracking-wide">
            {pulse.status === "online"
              ? "En ligne"
              : pulse.status === "offline"
                ? "Hors ligne"
                : "…"}
          </span>
        </span>
      </div>
      <p className="heading text-2xl text-white tabular-nums leading-none mt-3">
        {pulse.latencyMs != null ? `${pulse.latencyMs} ms` : "—"}
      </p>
      <p className="metric text-[11px] text-zinc-500 mt-2">
        {modeLabel ? `Mode ${modeLabel}` : "Latence health"}
      </p>
    </Link>
  )
}
