import Link from "next/link"
import type { ReactNode } from "react"

type EmptyStateProps = {
  title: string
  description?: string
  actionHref?: string
  actionLabel?: string
  children?: ReactNode
}

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  children,
}: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-white/[0.1] bg-well/40 px-4 py-6 text-center">
      <p className="text-[13px] font-medium text-zinc-200">{title}</p>
      {description && (
        <p className="text-[12px] text-zinc-500 mt-1.5 leading-snug max-w-xs mx-auto">
          {description}
        </p>
      )}
      {actionHref && actionLabel && (
        <Link
          href={actionHref}
          className="inline-flex mt-3 metric text-[11px] text-brand hover:opacity-80 transition-opacity duration-140"
        >
          {actionLabel}
        </Link>
      )}
      {children}
    </div>
  )
}
