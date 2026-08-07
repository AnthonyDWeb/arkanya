"use client"

import {
  CardBlock,
  DonutChart,
  InsightCard,
} from "@/components/dashboard/insight-charts"
import type { ChartSlice } from "@/lib/dashboard/chart"
import { formatDurationMs } from "@/lib/dashboard/format"

type ConsoleInsightsProps = {
  slices: ChartSlice[]
  successRate: number
  avgSuccessMs: number | null
  total: number
}

export function ConsoleInsights({
  slices,
  successRate,
  avgSuccessMs,
  total,
}: ConsoleInsightsProps) {
  if (total === 0) {
    return null
  }

  return (
    <div className="px-4 lg:px-6 pb-4">
      <div className="max-w-sm">
        <InsightCard
          title="Jobs"
          href="/console"
          linkLabel="Historique →"
        >
          <CardBlock title="Répartition">
            <DonutChart
              slices={slices}
              centerLabel="succès"
              centerPercent={successRate}
              footer={
                <div className="flex items-center justify-between gap-2 rounded-lg border border-white/[0.06] bg-well/40 px-2.5 py-2">
                  <span className="metric text-[10px] text-zinc-400">
                    Durée moy.
                  </span>
                  <span className="metric text-[11px] text-zinc-200 tabular-nums">
                    {avgSuccessMs != null
                      ? formatDurationMs(avgSuccessMs)
                      : "—"}
                  </span>
                </div>
              }
            />
          </CardBlock>
        </InsightCard>
      </div>
    </div>
  )
}
