"use client"

import {
  CatalogCoverage,
  InsightCard,
} from "@/components/dashboard/insight-charts"
import type { ChartSlice } from "@/lib/dashboard/chart"

type CatalogueInsightsProps = {
  slices: ChartSlice[]
  usedCount: number
  totalCount: number
  features: Array<{ id: string; label: string; value: number }>
}

export function CatalogueInsights({
  slices,
  usedCount,
  totalCount,
  features,
}: CatalogueInsightsProps) {
  if (totalCount === 0 && features.length === 0) {
    return null
  }

  return (
    <InsightCard
      title="Couverture"
      href="/catalogue"
      linkLabel="Catalogue →"
      className="w-full"
    >
      <CatalogCoverage
        slices={slices}
        usedCount={usedCount}
        totalCount={totalCount}
        features={features}
      />
    </InsightCard>
  )
}
