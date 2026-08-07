export function formatDurationMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds} s`
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest === 0 ? `${minutes} min` : `${minutes} min ${rest} s`
}

export function formatAge(date: Date, now = Date.now()): string {
  const diffMs = Math.max(0, now - date.getTime())
  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return "à l’instant"
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 48) return `${hours} h`
  const days = Math.floor(hours / 24)
  return `${days} j`
}
