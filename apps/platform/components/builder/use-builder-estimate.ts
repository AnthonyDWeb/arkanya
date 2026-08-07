"use client"

import { useEffect, useState } from "react"
import type { BuilderState } from "./types"

export type BenchmarkEntry = {
  key: string
  label: string
  category: string
  avgMs: number
  minMs: number
  maxMs: number
  sampleCount: number
}

export function formatEstimateMs(ms: number): string {
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  const rem = ms % 1000
  if (min > 0) return `${min}m ${sec}s`
  if (sec > 0) return `${sec}s`
  return `${rem}ms`
}

function buildBenchmarkKeys(state: BuilderState): string[] {
  const keys: string[] = []
  if (!state.template) return keys
  keys.push(`scaffold:${state.template}:copy-files`)
  const enabledCount = state.pages.filter((p) => p.enabled).length
  if (enabledCount > 0) keys.push(`scaffold:pages:${enabledCount}`)
  for (const f of state.features) keys.push(`feature:${f}`)
  keys.push("validate:npm-install")
  keys.push("validate:next-build")
  return keys
}

export function useBuilderEstimate(state: BuilderState) {
  const [benchmarks, setBenchmarks] = useState<BenchmarkEntry[]>([])
  const [loading, setLoading] = useState(false)

  const keysKey = [
    state.template,
    state.features.join(","),
    String(state.pages.filter((p) => p.enabled).length),
  ].join("|")

  useEffect(() => {
    const keys = buildBenchmarkKeys(state)
    if (keys.length === 0) {
      setBenchmarks([])
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`/api/timings/benchmarks?keys=${encodeURIComponent(keys.join(","))}`)
      .then((r) => r.json())
      .then((data: BenchmarkEntry[]) => {
        setBenchmarks(data)
        setLoading(false)
      })
      .catch(() => {
        setBenchmarks([])
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keysKey])

  const totalAvgMs = benchmarks.reduce((acc, b) => acc + b.avgMs, 0)
  const known = benchmarks.length
  const expected = buildBenchmarkKeys(state).length

  return { benchmarks, loading, totalAvgMs, known, expected }
}
