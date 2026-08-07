"use client"

import {
  CardBlock,
  InsightCard,
  ShareMap,
  StackedMeter,
} from "@/components/dashboard/insight-charts"
import type { ChartSlice } from "@/lib/dashboard/chart"

type ClientsInsightsProps = {
  statusSlices: ChartSlice[]
  portfolioSlices: ChartSlice[]
}

export function ClientsInsights({
  statusSlices,
  portfolioSlices,
}: ClientsInsightsProps) {
  if (statusSlices.length === 0 && portfolioSlices.length === 0) {
    return null
  }

  return (
    <div className="px-4 lg:px-6 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
        {statusSlices.length > 0 ? (
          <InsightCard
            title="Statuts"
            href="/clients"
            linkLabel="Liste →"
          >
            <CardBlock title="Portefeuille">
              <StackedMeter
                slices={statusSlices}
                href="/clients"
                compact
              />
            </CardBlock>
          </InsightCard>
        ) : null}
        {portfolioSlices.length > 0 ? (
          <InsightCard
            title="Projets par client"
            href="/clients"
            linkLabel="Liste →"
          >
            <ShareMap slices={portfolioSlices} />
          </InsightCard>
        ) : null}
      </div>
    </div>
  )
}
