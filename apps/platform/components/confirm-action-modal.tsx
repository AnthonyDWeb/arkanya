"use client"

type ConfirmActionModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  consequences?: string[]
  target?: { label: string; value: string }
  confirmLabel: string
  confirmingLabel: string
  pending: boolean
  error?: string | null
  warnings?: string[]
  tone?: "danger" | "warning"
}

const TONE_STYLES = {
  danger: {
    dot: "text-danger",
    error: "text-danger bg-danger/10 border-danger/30",
    confirmButton: "bg-danger-deep text-white [background-image:none]",
  },
  warning: {
    dot: "text-warning",
    error: "text-danger bg-danger/10 border-danger/30",
    confirmButton: "bg-warning-deep text-white [background-image:none]",
  },
} as const

export function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  consequences,
  target,
  confirmLabel,
  confirmingLabel,
  pending,
  error,
  warnings,
  tone = "danger",
}: ConfirmActionModalProps) {
  if (!open) return null
  const styles = TONE_STYLES[tone]

  return (
    <div
      className="animate-overlay-in fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onClose()
      }}
    >
      <div className="animate-modal-in w-full max-w-md chassis trim-gold p-6 space-y-5">
        <div>
          <h2 className="heading text-lg text-white">{title}</h2>
          <p className="text-sm text-zinc-400 mt-1.5">{description}</p>
        </div>

        {consequences && consequences.length > 0 && (
          <ul className="space-y-1.5 text-sm text-zinc-400">
            {consequences.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className={`status-dot shrink-0 ${styles.dot}`} />
                {item}
              </li>
            ))}
          </ul>
        )}

        {target && (
          <div className="well !shadow-none py-2.5">
            <p className="field-label mb-0">{target.label}</p>
            <p className="metric text-sm text-zinc-200 mt-1">{target.value}</p>
          </div>
        )}

        {error && (
          <p className={`metric text-xs rounded-[3px] px-3 py-2 border ${styles.error}`}>
            {error}
          </p>
        )}

        {warnings && warnings.length > 0 && (
          <div className="metric text-xs text-warning bg-warning/10 border border-warning/30 rounded-[3px] px-3 py-2 space-y-0.5">
            <p className="font-medium">Avertissements :</p>
            {warnings.map((w) => (
              <p key={w}>{w}</p>
            ))}
          </div>
        )}

        <div className="flex gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-200 chassis transition-colors duration-140 disabled:opacity-40"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={`slab px-5 py-2.5 disabled:opacity-50 flex items-center gap-2 ${styles.confirmButton}`}
          >
            {pending && (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {pending ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
