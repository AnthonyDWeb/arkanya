"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { toPercent, type ChartSlice } from "@/lib/dashboard/chart"
import { CATALOG, DELIVERY_COLORS } from "@/lib/dashboard/colors"
import { revealInt, useRevealProgress } from "@/lib/dashboard/use-reveal"

type InsightCardProps = {
  title: string
  href: string
  linkLabel: string
  children: ReactNode
  empty?: boolean
  emptyLabel?: string
  className?: string
  fill?: boolean
}

export function InsightCard({
  title,
  href,
  linkLabel,
  children,
  empty,
  emptyLabel = "Aucune donnée",
  className = "",
  fill = false,
}: InsightCardProps) {
  return (
    <section
      className={[
        "rounded-xl border border-white/[0.08] bg-surface/80 min-w-0 flex flex-col overflow-hidden",
        fill ? "h-full min-h-0" : "h-fit",
        className,
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between gap-2 px-4 pt-3.5 pb-2 shrink-0">
        <h2 className="metric text-[10px] text-zinc-400 uppercase tracking-wide">
          {title}
        </h2>
        <Link
          href={href}
          className="metric text-[10px] text-brand hover:opacity-80 transition-opacity duration-140 shrink-0"
        >
          {linkLabel}
        </Link>
      </div>
      <div
        className={[
          "px-4 pb-4",
          fill ? "flex-1 min-h-0 flex flex-col" : "",
        ].join(" ")}
      >
        {empty ? (
          <p className="text-[11px] text-zinc-500 py-4 text-center">{emptyLabel}</p>
        ) : (
          children
        )}
      </div>
    </section>
  )
}

type CardBlockProps = {
  title: string
  children: ReactNode
  className?: string
}

export function CardBlock({ title, children, className = "" }: CardBlockProps) {
  return (
    <div className={className}>
      <p className="metric text-[9px] text-zinc-600 uppercase tracking-wide mb-3">
        {title}
      </p>
      {children}
    </div>
  )
}

type ChartTooltipProps = {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; payload?: ChartSlice }>
}

function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.[0]) return null
  const item = payload[0]
  const slice = item.payload
  return (
    <div className="rounded-lg border border-white/10 bg-elevated px-2.5 py-1.5 shadow-lg">
      <p className="text-[11px] text-zinc-200">{item.name ?? slice?.label}</p>
      <p className="metric text-[11px] text-brand tabular-nums mt-0.5">
        {item.value ?? slice?.value}
      </p>
    </div>
  )
}

type DonutChartProps = {
  slices: ChartSlice[]
  centerLabel: string
  /** Pourcentage final affiché au centre (animé 0 → valeur). */
  centerPercent: number
  footer?: ReactNode
}

export function DonutChart({
  slices,
  centerLabel,
  centerPercent,
  footer,
}: DonutChartProps) {
  const router = useRouter()
  const progress = useRevealProgress()
  const total = slices.reduce((sum, s) => sum + s.value, 0)
  const animatedSlices = slices.map((s) => ({
    ...s,
    value: Math.max(0.001, s.value * progress),
  }))
  const shownPercent = revealInt(centerPercent, progress)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-[168px] h-[168px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={animatedSlices}
                dataKey="value"
                nameKey="label"
                innerRadius={52}
                outerRadius={74}
                paddingAngle={3}
                stroke="none"
                isAnimationActive={false}
                onClick={(data) => {
                  const payload = data as unknown as ChartSlice
                  if (payload.href) router.push(payload.href)
                }}
                style={{ cursor: "pointer" }}
              >
                {slices.map((slice) => (
                  <Cell key={slice.id} fill={slice.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="heading text-3xl text-white tabular-nums leading-none">
              {shownPercent}%
            </span>
            <span className="metric text-[9px] text-zinc-500 uppercase tracking-wide mt-1">
              {centerLabel}
            </span>
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
          {slices.map((slice) => (
            <li key={slice.id}>
              <Link
                href={slice.href ?? "#"}
                className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors duration-140"
                onClick={(e) => {
                  if (!slice.href) e.preventDefault()
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: slice.color }}
                />
                <span>{slice.label}</span>
                <span className="metric text-zinc-500 tabular-nums">
                  {revealInt(slice.value, progress)}
                </span>
                <span className="metric text-zinc-600 tabular-nums">
                  {revealInt(toPercent(slice.value, total), progress)}%
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {footer}
    </div>
  )
}

type ShareMapProps = {
  slices: ChartSlice[]
}

export function ShareMap({ slices }: ShareMapProps) {
  const progress = useRevealProgress()
  const total = slices.reduce((sum, s) => sum + s.value, 0)

  return (
    <ul className="space-y-3">
      {slices.map((slice) => {
        const pct = toPercent(slice.value, total)
        const shownPct = revealInt(pct, progress)
        return (
          <li key={slice.id}>
            <Link
              href={slice.href ?? "/clients"}
              className="block group"
              title={`${slice.label}: ${slice.value} projet${slice.value > 1 ? "s" : ""} · ${pct}%`}
            >
              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: slice.color }}
                  />
                  <span className="text-[13px] font-medium text-white group-hover:text-brand transition-colors duration-140 truncate">
                    {slice.label}
                  </span>
                </span>
                <span className="metric text-[12px] text-zinc-400 tabular-nums shrink-0">
                  {shownPct}%
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-well overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct * progress}%`,
                    background: slice.color,
                  }}
                />
              </div>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

type FeatureBar = {
  id: string
  label: string
  value: number
}

type CatalogCoverageProps = {
  slices: ChartSlice[]
  usedCount: number
  totalCount: number
  features?: FeatureBar[]
}

export function CatalogCoverage({
  slices,
  usedCount,
  totalCount,
  features = [],
}: CatalogCoverageProps) {
  const progress = useRevealProgress()
  const projectTotal = slices.reduce((sum, s) => sum + s.value, 0)
  const coverage =
    totalCount === 0 ? 0 : Math.min(100, Math.round((usedCount / totalCount) * 100))
  const featureMax = Math.max(...features.map((f) => f.value), 1)
  const shownCoverage = revealInt(coverage, progress)
  const circumference = 2 * Math.PI * 15.5
  const dash = (shownCoverage / 100) * circumference

  return (
    <div className="space-y-5 lg:space-y-3">
      <div className="flex flex-col items-center text-center gap-3 lg:gap-2">
        <div className="relative w-[148px] h-[148px] lg:w-[132px] lg:h-[132px]">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="3"
            />
            <circle
              cx="18"
              cy="18"
              r="15.5"
              fill="none"
              stroke={CATALOG.primary}
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="heading text-3xl lg:text-3xl text-white tabular-nums leading-none">
              {shownCoverage}%
            </span>
            <span className="metric text-[9px] text-zinc-500 uppercase tracking-wide mt-1">
              couverture
            </span>
          </div>
        </div>
        <p className="metric text-[11px] text-zinc-400">
          <span className="heading text-lg text-white tabular-nums">
            {revealInt(usedCount, progress)}
          </span>
          <span className="text-zinc-600">/{totalCount}</span>
          <span className="ml-1.5">modèles utilisés</span>
        </p>
      </div>

      <div className="flex h-2.5 lg:h-2 rounded-full overflow-hidden bg-well">
        {projectTotal === 0 ? (
          <div className="w-full bg-zinc-800" />
        ) : (
          slices.map((slice) => (
            <Link
              key={slice.id}
              href={slice.href ?? "/catalogue"}
              title={`${slice.label}: ${slice.value}`}
              className="h-full hover:brightness-110 transition-[filter] duration-140"
              style={{
                width: `${(slice.value / projectTotal) * 100 * progress}%`,
                background: slice.color,
              }}
            />
          ))
        )}
      </div>

      <ul className="flex flex-wrap justify-center gap-x-3 gap-y-1">
        {slices.map((slice) => (
          <li key={slice.id}>
            <Link
              href={slice.href ?? "/catalogue"}
              className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors duration-140"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: slice.color }}
              />
              {slice.label}
              <span className="metric text-zinc-600 tabular-nums">
                {revealInt(toPercent(slice.value, projectTotal), progress)}%
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {features.length > 0 ? (
        <div className="pt-4 lg:pt-2.5 border-t border-white/[0.06] space-y-3.5 lg:space-y-2">
          <p className="metric text-[10px] text-zinc-600 uppercase tracking-wide text-center">
            Features
          </p>
          {features.map((feature) => (
            <Link key={feature.id} href="/catalogue" className="block group">
              <div className="flex items-baseline justify-between gap-2 mb-1.5 lg:mb-1">
                <span className="text-[11px] text-zinc-300 truncate group-hover:text-brand transition-colors duration-140">
                  {feature.label}
                </span>
                <span className="metric text-[10px] text-zinc-500 tabular-nums">
                  {revealInt(feature.value, progress)}
                </span>
              </div>
              <div className="h-1.5 lg:h-1 w-full rounded-full bg-well overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(feature.value / featureMax) * 100 * progress}%`,
                    background: CATALOG.muted,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  )
}

type StackedMeterProps = {
  slices: ChartSlice[]
  href: string
  compact?: boolean
}

export function StackedMeter({ slices, href, compact }: StackedMeterProps) {
  const progress = useRevealProgress()
  const total = slices.reduce((sum, s) => sum + s.value, 0)

  return (
    <Link href={href} className="block group">
      <div
        className={[
          "flex rounded-full overflow-hidden bg-well border border-white/[0.06]",
          compact ? "h-3" : "h-3.5",
        ].join(" ")}
      >
        {total === 0 ? (
          <div className="w-full bg-zinc-800" />
        ) : (
          slices.map((slice) =>
            slice.value > 0 ? (
              <div
                key={slice.id}
                title={`${slice.label}: ${slice.value}`}
                className="h-full first:rounded-l-full last:rounded-r-full group-hover:brightness-110 transition-[filter] duration-140"
                style={{
                  width: `${(slice.value / total) * 100 * progress}%`,
                  background: slice.color,
                }}
              />
            ) : null,
          )
        )}
      </div>
      <ul
        className={[
          "flex flex-wrap gap-x-4 gap-y-1.5",
          compact ? "mt-3.5" : "mt-4",
        ].join(" ")}
      >
        {slices.map((slice) => (
          <li key={slice.id} className="flex items-center gap-1.5 text-[11px]">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: slice.color }}
            />
            <span className="text-zinc-400">{slice.label}</span>
            <span className="metric text-zinc-200 tabular-nums">
              {revealInt(slice.value, progress)}
            </span>
            <span className="metric text-zinc-600 tabular-nums">
              {revealInt(toPercent(slice.value, total), progress)}%
            </span>
          </li>
        ))}
      </ul>
    </Link>
  )
}

type AttentionItem = {
  id: string
  label: string
  href: string
  detail: string
  tone: "danger" | "warn" | "muted"
}

type AttentionBoardProps = {
  items: AttentionItem[]
  emptyLabel: string
}

export function AttentionBoard({ items, emptyLabel }: AttentionBoardProps) {
  if (items.length === 0) {
    return (
      <p className="text-[11px] text-zinc-500 py-4 text-center">{emptyLabel}</p>
    )
  }

  return (
    <ul className="space-y-2.5">
      {items.map((item) => {
        const tone =
          item.tone === "danger"
            ? "border-danger/30 bg-danger/5"
            : item.tone === "warn"
              ? "border-gold/25 bg-gold/5"
              : "border-white/[0.06] bg-well/40"
        const dot =
          item.tone === "danger"
            ? "bg-danger"
            : item.tone === "warn"
              ? "bg-gold"
              : "bg-zinc-500"

        return (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 hover:border-white/20 transition-[border-color] duration-140 ${tone}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
              <span className="min-w-0 flex-1">
                <span className="block text-[12px] font-medium text-zinc-100 truncate">
                  {item.label}
                </span>
                <span className="block metric text-[10px] text-zinc-500 truncate">
                  {item.detail}
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

type DeliverySplitProps = {
  live: number
  undelivered: number
  orphans: number
}

export function DeliverySplit({ live, undelivered, orphans }: DeliverySplitProps) {
  const progress = useRevealProgress()
  const total = live + undelivered
  const livePct = total === 0 ? 0 : Math.round((live / total) * 100)
  const shownPct = revealInt(livePct, progress)

  return (
    <div className="space-y-4 lg:space-y-2.5">
      <div className="text-center">
        <p
          className="heading text-5xl lg:text-5xl tabular-nums leading-none"
          style={{ color: DELIVERY_COLORS.live }}
        >
          {shownPct}%
        </p>
        <p className="metric text-[11px] text-zinc-500 mt-2.5 lg:mt-1.5">
          livrés
          <span className="text-zinc-600"> · </span>
          <span className="tabular-nums">
            {revealInt(live, progress)}/{total}
          </span>
        </p>
      </div>

      <div className="flex h-2.5 lg:h-2 rounded-full overflow-hidden bg-well">
        {total === 0 ? (
          <div className="w-full bg-zinc-800" />
        ) : (
          <>
            {live > 0 ? (
              <div
                className="h-full"
                style={{
                  width: `${(live / total) * 100 * progress}%`,
                  background: DELIVERY_COLORS.live,
                }}
              />
            ) : null}
            {undelivered > 0 ? (
              <div
                className="h-full"
                style={{
                  width: `${(undelivered / total) * 100 * progress}%`,
                  background: DELIVERY_COLORS.pending,
                }}
              />
            ) : null}
          </>
        )}
      </div>

      <ul className="grid grid-cols-3 gap-2 lg:gap-1.5">
        <li className="rounded-lg bg-well/50 border border-white/[0.05] px-2 py-2.5 lg:py-1.5 text-center">
          <p
            className="heading text-xl lg:text-base tabular-nums leading-none"
            style={{ color: DELIVERY_COLORS.live }}
          >
            {revealInt(live, progress)}
          </p>
          <p className="metric text-[9px] lg:text-[8px] text-zinc-500 uppercase mt-1.5 lg:mt-1">
            En ligne
          </p>
        </li>
        <li className="rounded-lg bg-well/50 border border-white/[0.05] px-2 py-2.5 lg:py-1.5 text-center">
          <p
            className="heading text-xl lg:text-base tabular-nums leading-none"
            style={{ color: DELIVERY_COLORS.pending }}
          >
            {revealInt(undelivered, progress)}
          </p>
          <p className="metric text-[9px] lg:text-[8px] text-zinc-500 uppercase mt-1.5 lg:mt-1">
            À livrer
          </p>
        </li>
        <li className="rounded-lg bg-well/50 border border-white/[0.05] px-2 py-2.5 lg:py-1.5 text-center">
          <p
            className="heading text-xl lg:text-base tabular-nums leading-none"
            style={{ color: DELIVERY_COLORS.orphan }}
          >
            {revealInt(orphans, progress)}
          </p>
          <p className="metric text-[9px] lg:text-[8px] text-zinc-500 uppercase mt-1.5 lg:mt-1">
            Sans client
          </p>
        </li>
      </ul>
    </div>
  )
}
