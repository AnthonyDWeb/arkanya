export function PageLoading() {
  return (
    <div className="px-4 lg:px-6 py-6 animate-pulse space-y-4 max-w-lg">
      <div className="space-y-2">
        <div className="h-2.5 w-20 rounded bg-white/[0.06]" />
        <div className="h-6 w-48 rounded bg-white/[0.08]" />
      </div>
      <div className="rounded-xl border border-white/[0.06] bg-surface/50 h-28" />
      <div className="rounded-xl border border-white/[0.06] bg-surface/40 h-40" />
    </div>
  )
}
