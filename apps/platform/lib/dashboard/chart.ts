export type ChartSlice = {
  id: string
  label: string
  value: number
  color: string
  href?: string
}

export function toPercent(value: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((value / total) * 100)
}

/** Keep top N slices, fold the rest into "Autres". */
export function topSlices(
  slices: ChartSlice[],
  limit: number,
  otherColor = "#52525b",
): ChartSlice[] {
  const sorted = [...slices].sort((a, b) => b.value - a.value)
  if (sorted.length <= limit) return sorted
  const head = sorted.slice(0, limit - 1)
  const rest = sorted.slice(limit - 1)
  const otherValue = rest.reduce((sum, s) => sum + s.value, 0)
  if (otherValue <= 0) return head
  return [
    ...head,
    {
      id: "autres",
      label: "Autres",
      value: otherValue,
      color: otherColor,
    },
  ]
}
