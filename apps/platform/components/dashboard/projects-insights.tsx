"use client"

import {
  CardBlock,
  DeliverySplit,
  InsightCard,
  StackedMeter,
} from "@/components/dashboard/insight-charts"
import type { ChartSlice } from "@/lib/dashboard/chart"

type ProjectsInsightsProps = {
  pipeline: ChartSlice[]
  live: number
  undelivered: number
  orphans: number
}

export function ProjectsInsights({
  pipeline,
  live,
  undelivered,
  orphans,
}: ProjectsInsightsProps) {
  return (
    <div className="px-4 lg:px-6 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
        <InsightCard
          title="Pipeline"
          href="/projects"
          linkLabel="Liste →"
        >
          <CardBlock title="Statuts">
            <StackedMeter
              slices={pipeline}
              href="/projects"
              compact
            />
          </CardBlock>
        </InsightCard>
        <InsightCard
          title="Livraison"
          href="/projects"
          linkLabel="Liste →"
        >
          <DeliverySplit
            live={live}
            undelivered={undelivered}
            orphans={orphans}
          />
        </InsightCard>
      </div>
    </div>
  )
}
