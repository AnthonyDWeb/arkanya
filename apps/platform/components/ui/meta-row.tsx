import type { ReactNode } from "react"

type MetaRowProps = {
  label: string
  children: ReactNode
  valueClassName?: string
}

export function MetaRow({ label, children, valueClassName = "" }: MetaRowProps) {
  return (
    <div className="grid grid-cols-[4.75rem_minmax(0,1fr)] sm:grid-cols-[5.5rem_minmax(0,1fr)] gap-x-2 items-baseline py-1.5 border-b border-white/[0.05] last:border-0">
      <span className="metric text-[10px] text-zinc-400">{label}</span>
      <div
        className={[
          "text-[12px] text-zinc-200 min-w-0 overflow-hidden",
          valueClassName || "break-all",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  )
}
