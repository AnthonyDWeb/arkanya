import type { ReactNode } from "react"

type SurfacePanelProps = {
  children: ReactNode
  className?: string
  padded?: boolean
}

export function SurfacePanel({
  children,
  className = "",
  padded = false,
}: SurfacePanelProps) {
  return (
    <div
      className={[
        "rounded-xl border border-white/[0.08] bg-surface/80 overflow-hidden",
        padded ? "px-2.5 py-1" : "divide-y divide-white/[0.05]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}
