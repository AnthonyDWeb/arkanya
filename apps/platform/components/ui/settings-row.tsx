import type { ReactNode } from "react"

type SettingsRowProps = {
  title: string
  description: string
  control: ReactNode
}

export function SettingsRow({ title, description, control }: SettingsRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 px-3.5 py-3">
      <div className="min-w-0 pr-2">
        <p className="text-[13px] font-medium text-zinc-100">{title}</p>
        <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{description}</p>
      </div>
      <div className="shrink-0 pt-0.5">{control}</div>
    </div>
  )
}
