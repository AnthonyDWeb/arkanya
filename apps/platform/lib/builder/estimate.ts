import type { BenchmarkEntry, BuilderState } from "@/types/builder"

export type { BenchmarkEntry }

export function formatEstimateMs(ms: number): string {
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  const rem = ms % 1000
  if (min > 0) return `${min}m ${sec}s`
  if (sec > 0) return `${sec}s`
  return `${rem}ms`
}

export function buildBenchmarkKeys(state: BuilderState): string[] {
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
